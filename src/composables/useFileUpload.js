import { FileUploadService } from '@/utils/fileUpload.js'
import { ref } from 'vue'

export function useFileUpload() {
	const avatarFile = ref(null)
	const headerFile = ref(null)
	const avatarPreview = ref(null)
	const headerPreview = ref(null)
	const uploadingAvatar = ref(false)
	const uploadingHeader = ref(false)
	const uploadError = ref(null)

	const validateFile = file => {
		console.log('🔍 Валидация файла:', {
			name: file.name,
			size: file.size,
			type: file.type,
		})

		if (file.size > 5 * 1024 * 1024) {
			throw new Error('Файл слишком большой. Максимальный размер: 5MB')
		}
		if (!file.type.startsWith('image/')) {
			throw new Error('Пожалуйста, выберите изображение')
		}
		return true
	}

	const handleAvatarSelect = event => {
		const file = event.target.files[0]
		if (file) {
			try {
				validateFile(file)
				avatarFile.value = file
				const reader = new FileReader()
				reader.onload = e => {
					avatarPreview.value = e.target.result
					console.log('📸 Preview аватара создан')
				}
				reader.readAsDataURL(file)
				uploadError.value = null
			} catch (err) {
				uploadError.value = err.message
				console.error('❌ Ошибка выбора аватара:', err)
				alert(err.message)
			}
		}
	}

	const handleHeaderSelect = event => {
		const file = event.target.files[0]
		if (file) {
			try {
				validateFile(file)
				headerFile.value = file
				const reader = new FileReader()
				reader.onload = e => {
					headerPreview.value = e.target.result
					console.log('📸 Preview шапки создан')
				}
				reader.readAsDataURL(file)
				uploadError.value = null
			} catch (err) {
				uploadError.value = err.message
				console.error('❌ Ошибка выбора шапки:', err)
				alert(err.message)
			}
		}
	}

	const uploadAvatar = async () => {
		if (!avatarFile.value) return null

		uploadingAvatar.value = true
		uploadError.value = null

		try {
			console.log('🔄 Начинаем загрузку аватара...')
			const result = await FileUploadService.uploadAvatar(avatarFile.value)
			console.log('✅ Аватар загружен:', result)

			avatarFile.value = null
			avatarPreview.value = null
			return result.link
		} catch (err) {
			console.error('❌ Ошибка загрузки аватара:', err)
			uploadError.value = err.message
			throw err
		} finally {
			uploadingAvatar.value = false
		}
	}

	const uploadHeader = async () => {
		if (!headerFile.value) return null

		uploadingHeader.value = true
		uploadError.value = null

		try {
			console.log('🔄 Начинаем загрузку шапки...')
			const result = await FileUploadService.uploadHeader(headerFile.value)
			console.log('✅ Шапка загружена:', result)

			headerFile.value = null
			headerPreview.value = null
			return result.link
		} catch (err) {
			console.error('❌ Ошибка загрузки шапки:', err)
			uploadError.value = err.message
			throw err
		} finally {
			uploadingHeader.value = false
		}
	}

	const clearFiles = () => {
		avatarFile.value = null
		headerFile.value = null
		avatarPreview.value = null
		headerPreview.value = null
		uploadError.value = null
	}

	return {
		avatarFile,
		headerFile,
		avatarPreview,
		headerPreview,
		uploadingAvatar,
		uploadingHeader,
		uploadError,
		handleAvatarSelect,
		handleHeaderSelect,
		uploadAvatar,
		uploadHeader,
		clearFiles,
	}
}
