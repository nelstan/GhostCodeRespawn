<template>
	<div class="relative">
		<!-- Десктоп версия -->
		<div class="sm:block hidden">
			<div
				class="absolute ml-[250px] mt-[45px] rounded-[5px] w-[1420px] h-[200px] cursor-pointer overflow-hidden"
				@click="triggerHeaderInput"
			>
				<div class="relative w-full h-full overflow-hidden">
					<img
						:src="currentBannerUrl"
						alt="bannerItem"
						class="w-full h-full object-cover transition-transform duration-300"
						:style="{
							transform: `scale(${zoom}) translate(${position.x}%, ${position.y}%)`,
						}"
					/>
					<div
						class="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center"
					>
						<span
							class="text-white opacity-0 hover:opacity-100 font-exo font-semibold"
							>Нажмите чтобы изменить шапку</span
						>
					</div>
				</div>
			</div>

			<button
				v-if="headerFile && !showBannerEditor"
				@click="showBannerEditor = true"
				class="absolute ml-[1650px] mt-[220px] bg-[#D2EE5B] text-black px-4 py-2 rounded-lg font-exo font-semibold z-10"
			>
				Настроить шапку
			</button>
		</div>

		<!-- Мобильная версия -->
		<div class="sm:hidden block">
			<div
				class="mx-4 mt-4 rounded-[5px] h-[120px] cursor-pointer overflow-hidden"
				@click="triggerHeaderInput"
			>
				<div class="relative w-full h-full overflow-hidden">
					<img
						:src="currentBannerUrl"
						alt="bannerItem"
						class="w-full h-full object-cover transition-transform duration-300"
						:style="{
							transform: `scale(${zoom}) translate(${position.x}%, ${position.y}%)`,
						}"
					/>
					<div
						class="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center"
					>
						<span
							class="text-white text-xs text-center opacity-0 hover:opacity-100 font-exo font-semibold px-2"
							>Нажмите чтобы изменить шапку</span
						>
					</div>
				</div>
			</div>

			<button
				v-if="headerFile && !showBannerEditor"
				@click="showBannerEditor = true"
				class="mx-auto mt-2 bg-[#D2EE5B] text-black px-4 py-2 rounded-lg font-exo font-semibold z-10 block"
			>
				Настроить шапку
			</button>
		</div>

		<input
			ref="headerInput"
			type="file"
			accept="image/*"
			@change="handleHeaderSelect"
			class="hidden"
		/>

		<!-- Редактор (общий для обеих версий) -->
		<div
			v-if="showBannerEditor"
			class="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
		>
			<div
				class="bg-[#1A1A1A] rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto"
			>
				<h3 class="text-white text-xl font-exo font-bold mb-4">
					Настройка шапки профиля
				</h3>

				<div class="flex flex-col lg:flex-row gap-6">
					<div class="flex-1">
						<div
							class="relative w-full h-48 border-2 border-[#D2EE5B] rounded-lg overflow-hidden"
						>
							<img
								:src="headerPreview"
								alt="banner edit"
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
						<div class="grid grid-cols-2 lg:grid-cols-3 gap-2 mb-4">
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
						@click="cancelBannerEdit"
						class="bg-[#2A2A2A] text-white px-6 py-2 rounded-lg font-exo font-semibold hover:bg-[#333333] transition-colors"
					>
						Отмена
					</button>
					<button
						@click="saveBanner"
						:disabled="uploadingHeader"
						class="bg-[#D2EE5B] text-black px-6 py-2 rounded-lg font-exo font-semibold hover:bg-[#c5e04f] disabled:opacity-50 transition-colors"
					>
						{{ uploadingHeader ? 'Сохранение...' : 'Сохранить шапку' }}
					</button>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup>
import { FileUploadService } from '@/utils/fileUpload.js'
import { computed, onMounted, ref } from 'vue'
import bannerItem from '/src/assets/баннер.png'

const props = defineProps({
	userData: Object,
	currentUser: Object,
})

const emit = defineEmits(['header-updated'])

const headerFile = ref(null)
const headerPreview = ref(null)
const uploadingHeader = ref(false)
const headerInput = ref(null)
const showBannerEditor = ref(false)

const zoom = ref(1)
const position = ref({ x: 0, y: 0 })
const savedHeaderLink = ref('')

const positionPresets = [
	{ key: 'center', label: 'По центру', x: 0, y: 0 },
	{ key: 'top', label: 'Вверх', x: 0, y: -25 },
	{ key: 'bottom', label: 'Вниз', x: 0, y: 25 },
	{ key: 'left', label: 'Влево', x: -25, y: 0 },
	{ key: 'right', label: 'Вправо', x: 25, y: 0 },
	{ key: 'top-left', label: 'Вверх-влево', x: -25, y: -25 },
]

onMounted(() => {
	loadHeaderFromStorage()
})

const loadHeaderFromStorage = () => {
	const savedHeader = localStorage.getItem('userHeader')
	if (savedHeader) {
		savedHeaderLink.value = savedHeader
	}
}

const currentBannerUrl = computed(() => {
	if (headerPreview.value) return headerPreview.value
	if (savedHeaderLink.value) {
		return `/api/content/link/headers/${savedHeaderLink.value}?t=${Date.now()}`
	}
	return bannerItem
})

const triggerHeaderInput = () => {
	headerInput.value?.click()
}

const handleHeaderSelect = event => {
	const file = event.target.files[0]
	if (file && validateFile(file)) {
		headerFile.value = file
		const reader = new FileReader()
		reader.onload = e => {
			headerPreview.value = e.target.result
			showBannerEditor.value = true
		}
		reader.readAsDataURL(file)
	}
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

const cancelBannerEdit = () => {
	showBannerEditor.value = false
	headerFile.value = null
	headerPreview.value = null
}

const saveBanner = async () => {
	if (!headerFile.value) return

	uploadingHeader.value = true

	try {
		console.log('Начинаем загрузку шапки...')

		const result = await FileUploadService.uploadHeader(headerFile.value)

		if (result.link) {
			savedHeaderLink.value = result.link
			localStorage.setItem('userHeader', result.link)

			const savedUser = localStorage.getItem('currentUser')
			if (savedUser) {
				const user = JSON.parse(savedUser)
				user.headerLink = result.link
				localStorage.setItem('currentUser', JSON.stringify(user))
			}

			showBannerEditor.value = false
			headerFile.value = null
			headerPreview.value = null
			emit('header-updated', result.link)

			alert('Шапка профиля успешно обновлена!')
		} else {
			throw new Error('Неверный ответ от сервера')
		}
	} catch (error) {
		console.error('Ошибка загрузки шапки:', error)
		alert('Ошибка загрузки шапки: ' + error.message)
	} finally {
		uploadingHeader.value = false
	}
}
</script>
