<script setup>
import { useAuth } from '@/composables/useAuth.js'
import { ref, watch } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const { apiRequest, saveAuthData } = useAuth()

const username = ref('')
const password = ref('')
const error = ref('')
const showWelcome = ref(false)
const usernameError = ref('')
const passwordError = ref('')

// Функция проверки на английские символы и цифры
const isEnglishOnly = text => {
	return /^[A-Za-z0-9_]*$/.test(text) // Изменил + на * чтобы позволять пустую строку
}

// Функция проверки пароля (только английские буквы и цифры)
const isValidPassword = password => {
	return /^[A-Za-z0-9!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]*$/.test(password)
}

// Watcher для моментальной проверки username
watch(username, newValue => {
	if (newValue.trim() === '') {
		usernameError.value = ''
	} else if (!isEnglishOnly(newValue)) {
		usernameError.value =
			'Никнейм должен содержать только английские буквы, цифры и символ подчеркивания'
	} else {
		usernameError.value = ''
	}
})

// Watcher для моментальной проверки password
watch(password, newValue => {
	if (newValue.trim() === '') {
		passwordError.value = ''
	} else if (!isValidPassword(newValue)) {
		passwordError.value =
			'Пароль должен содержать только английские буквы, цифры и специальные символы'
	} else if (newValue.length < 6) {
		passwordError.value = 'Пароль должен быть не менее 6 символов'
	} else {
		passwordError.value = ''
	}
})

const handleRegister = async () => {
	try {
		error.value = ''

		// Проверяем данные перед отправкой
		if (!username.value.trim() || !password.value.trim()) {
			error.value = 'Заполните все поля'
			return
		}

		// Проверка никнейма на английские символы
		if (!isEnglishOnly(username.value)) {
			error.value =
				'Никнейм должен содержать только английские буквы, цифры и символ подчеркивания'
			return
		}

		// Проверка пароля на длину
		if (password.value.length < 6) {
			error.value = 'Пароль должен быть не менее 6 символов'
			return
		}

		// Проверка пароля на допустимые символы
		if (!isValidPassword(password.value)) {
			error.value =
				'Пароль должен содержать только английские буквы, цифры и специальные символы'
			return
		}

		// Если есть ошибки моментальной валидации
		if (usernameError.value || passwordError.value) {
			error.value = 'Исправьте ошибки в форме'
			return
		}

		console.log('🔄 Отправка данных регистрации:', {
			login: username.value,
			password: password.value,
		})

		const response = await apiRequest('/api/accounts/register', {
			method: 'POST',
			body: JSON.stringify({
				login: username.value.trim(),
				password: password.value,
			}),
		})

		console.log('📥 Статус ответа:', response.status)

		if (!response.ok) {
			let errorMessage = `Ошибка регистрации: ${response.status}`

			try {
				const errorData = await response.json()
				errorMessage = errorData.message || errorData.error || errorMessage
				console.error('❌ Ошибка от сервера:', errorData)
			} catch (e) {
				const text = await response.text()
				if (text) errorMessage = text
			}

			error.value = errorMessage
			return
		}

		const data = await response.json()
		console.log('✅ Успешный ответ:', data)

		if (data.refreshToken) {
			localStorage.setItem('refreshToken', data.refreshToken)
			console.log('🔄 Refresh token сохранен')

			try {
				const tokenResponse = await fetch('/api/tokens/refresh', {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify({ token: data.refreshToken }),
				})

				if (tokenResponse.ok) {
					const tokenData = await tokenResponse.json()

					localStorage.setItem('accessToken', tokenData.newJwt)
					localStorage.setItem('refreshToken', tokenData.newRefresh)
					console.log('🔑 Access token получен через refresh')
				} else {
					console.error('❌ Не удалось получить access token')
				}
			} catch (tokenError) {
				console.error('❌ Ошибка при получении access token:', tokenError)
			}
		}

		const userData = {
			username: username.value,
			role: data.data?.role || 'user',
			avatarLink: data.data?.avatarLink || '',
			headerLink: data.data?.headerLink || '',
		}
		localStorage.setItem('currentUser', JSON.stringify(userData))
		console.log('👤 Данные пользователя сохранены:', userData)

		if (data.recoveryCode) {
			localStorage.setItem('recoveryCode', data.recoveryCode)
			console.log('🔐 Recovery code saved')
		}

		showWelcome.value = true
		setTimeout(() => router.push('/Login'), 1000)
	} catch (err) {
		console.error('❌ Ошибка регистрации:', err)
		error.value =
			err.name === 'SyntaxError'
				? 'Сервер вернул некорректный ответ'
				: 'Ошибка соединения с сервером'
	}
}
</script>

<template>
	<div class="bg-[#111111] min-h-screen flex items-center justify-center">
		<div
			class="w-[590px] h-[530px] border-[#1F1F1F] border-2 rounded-[15px] bg-[#111111] flex flex-col items-center"
		>
			<span class="text-white text-[26px] mt-[56px]"
				>Зарегистрироваться в GhostCode</span
			>

			<div v-if="error" class="text-red-500 mt-4 text-center max-w-[376px]">
				{{ error }}
			</div>

			<div class="mt-[48px] w-[376px]">
				<div
					class="relative border-[#323436] border-2 rounded-t-[10px] bg-[#212224]"
					:class="{ 'border-red-500': usernameError }"
				>
					<img
						src="@/assets/лого ник.png"
						alt=""
						class="h-[31px] w-[31px] absolute left-[13px] top-1/2 transform -translate-y-1/2"
					/>
					<input
						v-model="username"
						type="text"
						placeholder="Введите свой никнейм"
						class="bg-[#212224] text-[#707070] w-full h-[48px] font-[400] pl-[57px] focus:outline-none rounded-t-[10px]"
					/>
				</div>
				<div v-if="usernameError" class="text-red-500 text-sm mt-1 text-left">
					{{ usernameError }}
				</div>

				<div
					class="relative border-[#323436] border-l-2 border-r-2 border-b-2 rounded-b-[10px] bg-[#212224] mt-1"
					:class="{ 'border-red-500': passwordError }"
				>
					<img
						src="@/assets/лого пароль.png"
						alt=""
						class="h-[31px] w-[31px] absolute left-[13px] top-1/2 transform -translate-y-1/2"
					/>
					<img
						src="@/assets/скрыть пароль.png"
						alt=""
						class="h-[23px] w-[23px] absolute right-[13px] top-1/2 transform -translate-y-1/2"
					/>
					<input
						v-model="password"
						type="password"
						placeholder="Введите свой пароль"
						class="bg-[#212224] text-[#707070] w-full h-[48px] font-[400] pl-[57px] focus:outline-none rounded-b-[10px]"
					/>
				</div>
				<div v-if="passwordError" class="text-red-500 text-sm mt-1 text-left">
					{{ passwordError }}
				</div>
			</div>

			<button
				@click="handleRegister"
				:disabled="!!usernameError || !!passwordError"
				class="w-[376px] h-[40px] bg-[#D2EE5B] border-[#819723] border-[1.5px] rounded-[10px] mt-[44px] cursor-pointer hover:bg-[#c5e04f] transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed disabled:border-gray-500"
			>
				Зарегистрироваться
			</button>

			<div class="text-white flex justify-center items-center mt-[133px]">
				<router-link to="/Login" class="flex items-center">
					У вас уже есть аккаунт?
					<span class="border-b border-[#D2EE5B] pb-1 ml-1">Войти</span>
				</router-link>
			</div>
		</div>
	</div>
</template>
