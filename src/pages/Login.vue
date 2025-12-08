<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const username = ref('')
const password = ref('')
const error = ref('')
const showWelcome = ref(false)
const showPassword = ref(false)

const saveAuthData = (token, refreshToken, userData) => {
	localStorage.setItem('accessToken', token)
	if (refreshToken) localStorage.setItem('refreshToken', refreshToken)
	localStorage.setItem('currentUser', JSON.stringify(userData))
}

const refreshAccessToken = async () => {
	try {
		const refreshToken = localStorage.getItem('refreshToken')
		if (!refreshToken) throw new Error('No refresh token')

		const response = await fetch('/api/tokens/refresh', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ token: refreshToken }),
		})

		if (!response.ok) throw new Error('Token refresh failed')

		const data = await response.json()
		localStorage.setItem('accessToken', data.newJwt)
		localStorage.setItem('refreshToken', data.newRefresh)
		return data.newJwt
	} catch (err) {
		localStorage.removeItem('accessToken')
		localStorage.removeItem('refreshToken')
		localStorage.removeItem('currentUser')
		router.push('/login')
		return null
	}
}

const apiRequest = async (url, options = {}) => {
	const token = localStorage.getItem('accessToken')

	const isFormData = options.body instanceof FormData
	const config = {
		...options,
		headers: {
			...options.headers,
		},
		credentials: 'include',
	}

	if (!isFormData && !config.headers['Content-Type']) {
		config.headers['Content-Type'] = 'application/json'
	}

	if (token) config.headers.Authorization = `Bearer ${token}`

	let response = await fetch(url, config)

	if (response.status === 401) {
		const newToken = await refreshAccessToken()
		if (newToken) {
			config.headers.Authorization = `Bearer ${newToken}`
			response = await fetch(url, config)
		}
	}

	return response
}

const handleLogin = async () => {
	try {
		error.value = ''

		const response = await apiRequest('/api/accounts/login', {
			method: 'POST',
			body: JSON.stringify({
				login: username.value,
				password: password.value,
			}),
		})

		const contentType = response.headers.get('content-type')
		let data = {}

		if (contentType?.includes('application/json')) {
			data = await response.json()
		} else {
			const text = await response.text()
			if (!response.ok) {
				error.value = `Ошибка сервера: ${response.status}`
				return
			}
		}

		if (!response.ok) {
			error.value =
				data.message || data.error || `Ошибка входа: ${response.status}`
			return
		}

		if (data.refreshToken || data.newJwt || data.token) {
			saveAuthData(data.newJwt || data.token, data.refreshToken, {
				username: data.user?.username || username.value,
				role: data.user?.role || 'user',
			})
		}

		if (data.recoveryCode) {
			localStorage.setItem('recoveryCode', data.recoveryCode)
		}

		showWelcome.value = true
		setTimeout(() => router.push('/GhostCode'), 1000)
	} catch (err) {
		error.value =
			err.name === 'SyntaxError'
				? 'Сервер вернул некорректный ответ'
				: 'Ошибка соединения с сервером'
	}
}
</script>

<template>
	<div class="bg-[#111111] min-h-screen">
		<transition name="fade">
			<div
				v-if="showWelcome"
				class="fixed inset-0 bg-black bg-opacity-95 flex items-center justify-center z-50"
			>
				<div class="text-[#D2EE5B] text-[60px] font-bold animate-pulse">
					Добро пожаловать в GhostCode
				</div>
			</div>
		</transition>

		<div class="flex items-center justify-center min-h-screen">
			<div
				class="w-[590px] h-[530px] border-[#1F1F1F] border-2 rounded-[15px] bg-[#111111]"
			>
				<span class="text-white flex justify-center mt-[56px] text-[26px]"
					>Войдите в GhostCode</span
				>

				<div
					v-if="error"
					class="text-red-500 text-[15px] text-center mt-4 font-exo"
				>
					{{ error }}
				</div>

				<div class="flex justify-center mt-[48px]">
					<div
						class="relative border-[#323436] border-2 rounded-t-[10px] bg-[#212224]"
					>
						<img
							src="@/assets/лого ник.png"
							alt=""
							class="h-[31px] w-[31px] absolute left-[13px] top-1/2 transform -translate-y-1/2"
						/>
						<input
							v-model="username"
							@input="error = ''"
							type="text"
							placeholder="Введите свой никнейм"
							class="bg-transparent text-white w-[376px] h-[48px] font-[400] pl-[57px] focus:outline-none rounded-t-[10px]"
						/>
					</div>
				</div>

				<div class="flex justify-center">
					<div
						class="relative border-[#323436] border-l-2 border-r-2 border-b-2 rounded-b-[10px] bg-[#212224]"
					>
						<img
							src="@/assets/лого пароль.png"
							alt=""
							class="h-[31px] w-[31px] absolute left-[13px] top-1/2 transform -translate-y-1/2"
						/>
						<img
							src="@/assets/скрыть пароль.png"
							alt=""
							class="h-[23px] w-[23px] absolute right-[13px] top-1/2 transform -translate-y-1/2 cursor-pointer"
							@click="showPassword = !showPassword"
						/>
						<input
							v-model="password"
							@input="error = ''"
							:type="showPassword ? 'text' : 'password'"
							placeholder="Введите свой пароль"
							class="bg-transparent text-white w-[376px] h-[48px] font-[400] pl-[57px] focus:outline-none rounded-b-[10px]"
						/>
					</div>
				</div>

				<div class="flex justify-center mt-[8px]">
					<router-link
						to="forgetPassword"
						class="font-[400] text-[#D2EE5B] text-[14px] cursor-pointer"
					>
						Забыли пароль?
					</router-link>
				</div>

				<div class="flex justify-center">
					<button
						@click="handleLogin"
						class="w-[376px] h-[40px] bg-[#D2EE5B] border-[#819723] border-[1.5px] rounded-[10px] mt-[8px] cursor-pointer hover:bg-[#c5e04f] transition-colors"
					>
						Войти
					</button>
				</div>

				<div class="text-white flex justify-center items-center mt-[133px]">
					<router-link to="/Register" class="flex items-center">
						У вас нет аккаунта?
						<span class="border-b border-[#D2EE5B] pb-1 ml-1"
							>Зарегистрироваться</span
						>
					</router-link>
				</div>
			</div>
		</div>
	</div>
</template>

<style>
.fade-enter-active,
.fade-leave-active {
	transition: opacity 0.5s;
}
.fade-enter-from,
.fade-leave-to {
	opacity: 0;
}
</style>