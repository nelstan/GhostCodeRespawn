<template>
	<div class="relative">
		<!-- Десктоп версия -->
		<div class="sm:block hidden">
			<div
				class="absolute w-[130px] h-[130px] ml-[430px] mt-[250px] rounded-full cursor-pointer overflow-hidden border-2 border-transparent hover:border-[#D2EE5B] transition-all duration-300"
				@click="triggerAvatarInput"
			>
				<div class="relative w-full h-full overflow-hidden">
					<img
						:src="currentAvatarUrl"
						alt="userAvatar"
						class="w-full h-full object-cover transition-transform duration-300"
						:style="{
							transform: `scale(${zoom}) translate(${position.x}%, ${position.y}%)`,
						}"
						@error="handleImageError"
					/>
					<div
						class="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center"
					>
						<span
							class="text-white text-xs text-center opacity-0 hover:opacity-100 font-exo font-semibold"
							>Нажмите чтобы изменить аватар</span
						>
					</div>
				</div>
			</div>

			<button
				v-if="avatarFile && !showAvatarEditor"
				@click="showAvatarEditor = true"
				class="absolute ml-[570px] mt-[350px] bg-[#D2EE5B] text-black px-4 py-2 rounded-lg font-exo font-semibold z-10"
			>
				Настроить аватар
			</button>
		</div>

		<!-- Мобильная версия -->
		<div class="sm:hidden block">
			<div
				class="mx-auto w-[100px] h-[100px] mt-[-25px] rounded-full cursor-pointer overflow-hidden border-2 border-transparent hover:border-[#D2EE5B] transition-all duration-300"
				@click="triggerAvatarInput"
			>
				<div class="relative w-full h-full overflow-hidden">
					<img
						:src="currentAvatarUrl"
						alt="userAvatar"
						class="w-full h-full object-cover transition-transform duration-300"
						:style="{
							transform: `scale(${zoom}) translate(${position.x}%, ${position.y}%)`,
						}"
						@error="handleImageError"
					/>
					<div
						class="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center"
					>
						<span
							class="text-white text-[10px] text-center opacity-0 hover:opacity-100 font-exo font-semibold px-1"
							>Нажмите чтобы изменить</span
						>
					</div>
				</div>
			</div>

			<button
				v-if="avatarFile && !showAvatarEditor"
				@click="showAvatarEditor = true"
				class="mx-auto mt-4 bg-[#D2EE5B] text-black px-4 py-2 rounded-lg font-exo font-semibold z-10 block"
			>
				Настроить аватар
			</button>
		</div>

		<input
			ref="avatarInput"
			type="file"
			accept="image/*"
			@change="handleAvatarSelect"
			class="hidden"
		/>

		<!-- Редактор (общий для обеих версий) -->
		<div
			v-if="showAvatarEditor"
			class="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
		>
			<div
				class="bg-[#1A1A1A] rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto"
			>
				<h3 class="text-white text-xl font-exo font-bold mb-4">
					Настройка аватара
				</h3>

				<div class="flex flex-col lg:flex-row gap-6">
					<div class="flex-1">
						<div
							class="relative w-64 h-64 mx-auto border-2 border-[#D2EE5B] rounded-full overflow-hidden"
						>
							<img
								ref="avatarEditor"
								:src="avatarPreview"
								alt="avatar edit"
								class="w-full h-full object-cover transition-transform duration-150"
								:style="{
									transform: `scale(${zoom}) translate(${position.x}%, ${position.y}%)`,
								}"
							/>
							<div
								class="absolute inset-0 border-2 border-white border-dashed pointer-events-none"
							></div>
						</div>

						<div class="mt-4">
							<label class="text-white font-exo block mb-2"
								>Масштаб: {{ Math.round(zoom * 100) }}%</label
							>
							<input
								v-model="zoom"
								type="range"
								min="1"
								max="3"
								step="0.1"
								class="w-full h-2 bg-[#2A2A2A] rounded-lg appearance-none cursor-pointer"
							/>
						</div>
					</div>

					<div class="flex-1">
						<div class="grid grid-cols-3 gap-2 mb-4">
							<button
								v-for="dir in positionPresets"
								:key="dir.key"
								@click="setPosition(dir.x, dir.y)"
								class="bg-[#2A2A2A] text-white p-2 rounded hover:bg-[#333333] transition-colors text-sm"
							>
								{{ dir.label }}
							</button>
						</div>

						<div class="space-y-2">
							<label class="text-white font-exo block"
								>Положение по X: {{ position.x }}%</label
							>
							<input
								v-model="position.x"
								type="range"
								min="-50"
								max="50"
								step="1"
								class="w-full"
							/>

							<label class="text-white font-exo block"
								>Положение по Y: {{ position.y }}%</label
							>
							<input
								v-model="position.y"
								type="range"
								min="-50"
								max="50"
								step="1"
								class="w-full"
							/>
						</div>
					</div>
				</div>

				<div class="flex gap-3 justify-end mt-6">
					<button
						@click="cancelAvatarEdit"
						class="bg-[#2A2A2A] text-white px-6 py-2 rounded-lg font-exo font-semibold hover:bg-[#333333] transition-colors"
					>
						Отмена
					</button>
					<button
						@click="saveAvatar"
						:disabled="uploadingAvatar"
						class="bg-[#D2EE5B] text-black px-6 py-2 rounded-lg font-exo font-semibold hover:bg-[#c5e04f] disabled:opacity-50 transition-colors"
					>
						{{ uploadingAvatar ? 'Сохранение...' : 'Сохранить аватар' }}
					</button>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup>
import { useFileUpload } from '@/composables/useFileUpload.js'
import { computed, onMounted, ref } from 'vue'
import userAvatar from '/src/assets/авапрофиль.png'

const props = defineProps({
	userData: Object,
	currentUser: Object,
})

const emit = defineEmits(['avatar-updated'])

const {
	avatarFile,
	avatarPreview,
	uploadingAvatar,
	handleAvatarSelect,
	uploadAvatar,
} = useFileUpload()

const zoom = ref(1)
const position = ref({ x: 0, y: 0 })
const savedAvatarLink = ref('')
const showAvatarEditor = ref(false)
const avatarInput = ref()

const positionPresets = [
	{ key: 'center', label: 'По центру', x: 0, y: 0 },
	{ key: 'top', label: 'Вверх', x: 0, y: -25 },
	{ key: 'bottom', label: 'Вниз', x: 0, y: 25 },
	{ key: 'left', label: 'Влево', x: -25, y: 0 },
	{ key: 'right', label: 'Вправо', x: 25, y: 0 },
	{ key: 'top-left', label: 'Вверх-влево', x: -25, y: -25 },
]

onMounted(() => {
	loadAvatarFromStorage()
})

const loadAvatarFromStorage = () => {
	const savedAvatar = localStorage.getItem('userAvatar')
	if (savedAvatar) {
		savedAvatarLink.value = savedAvatar
		console.log('📥 Загружен аватар из localStorage:', savedAvatar)
	}
}

const currentAvatarUrl = computed(() => {
	console.log('🔄 Формируем URL аватара:', {
		avatarPreview: !!avatarPreview.value,
		savedAvatarLink: savedAvatarLink.value,
		userDataAvatar: props.userData?.avatarLink,
		currentUserAvatar: props.currentUser?.avatarLink,
	})

	if (avatarPreview.value) {
		console.log('📸 Используем preview аватара')
		return avatarPreview.value
	}

	const base64Avatar = localStorage.getItem('avatarBase64')
	if (base64Avatar) {
		console.log('🖼️ Используем base64 аватар')
		return base64Avatar
	}

	const link =
		savedAvatarLink.value ||
		props.userData?.avatarLink ||
		props.currentUser?.avatarLink
	if (link && link !== 'base64') {
		const url = `/api/content/link/avatars/${link}`
		console.log('🔗 Формируем URL аватара:', url)
		return url
	}

	console.log('🖼️ Используем дефолтный аватар')
	return userAvatar
})

const handleImageError = event => {
	console.error('❌ Ошибка загрузки изображения:', {
		src: event.target.src,
		error: event,
	})

	// Пробуем загрузить без timestamp
	if (event.target.src.includes('?')) {
		const cleanUrl = event.target.src.split('?')[0]
		event.target.src = cleanUrl
	} else {
		event.target.src = userAvatar
	}
}

const triggerAvatarInput = () => {
	avatarInput.value?.click()
}

const validateFile = file => {
	if (file.size > 5 * 1024 * 1024) {
		alert('Файл слишком большой. Максимальный размер: 5MB')
		return false
	}
	if (!file.type.startsWith('image/')) {
		alert('Пожалуйста, выберите изображение')
		return false
	}
	return true
}

const setPosition = (x, y) => {
	position.value = { x, y }
}

const cancelAvatarEdit = () => {
	showAvatarEditor.value = false
	avatarFile.value = null
	avatarPreview.value = null
}

const saveAvatar = async () => {
	if (!avatarFile.value) return

	try {
		console.log('')
		console.log('📁 Файл для загрузки:', {
			name: avatarFile.value.name,
			size: avatarFile.value.size,
			type: avatarFile.value.type,
		})

		const reader = new FileReader()
		reader.onload = e => {
			const base64Data = e.target.result
			localStorage.setItem('avatarBase64', base64Data)

			savedAvatarLink.value = 'base64'
			const savedUser = localStorage.getItem('currentUser')
			if (savedUser) {
				const user = JSON.parse(savedUser)
				user.avatarLink = 'base64'
				localStorage.setItem('currentUser', JSON.stringify(user))
			}

			showAvatarEditor.value = false
			avatarFile.value = null
			avatarPreview.value = null
			emit('avatar-updated', 'base64')
		}
		reader.readAsDataURL(avatarFile.value)
	} catch (error) {
		console.log(error)
	}
}
</script>
