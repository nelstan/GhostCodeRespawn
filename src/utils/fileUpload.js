// src/utils/fileUpload.js

export class FileUploadService {
	static async uploadFile(url, file) {
		const token =
			localStorage.getItem('accessToken') || localStorage.getItem('jwt_token')

		if (!token || token === 'undefined' || token === 'null') {
			throw new Error('Токен не найден')
		}

		const formData = new FormData()
		formData.append('file', file)

		console.log('📤 Отправка файла на:', url)
		console.log('🔑 Токен:', token ? 'есть' : 'нет')
		console.log('📁 Размер файла:', file.size, 'тип:', file.type)

		const response = await fetch(url, {
			method: 'POST',
			headers: {
				Authorization: `Bearer ${token}`,
				// НЕ устанавливаем Content-Type - браузер сделает это автоматически
			},
			body: formData,
			credentials: 'include',
		})

		console.log('📥 Статус ответа:', response.status)

		if (!response.ok) {
			const errorText = await response.text()
			console.error('❌ Ошибка загрузки:', errorText)
			throw new Error(
				`HTTP error! status: ${response.status}, message: ${errorText}`
			)
		}

		const result = await response.json()
		console.log('✅ Результат загрузки:', result)
		return result
	}

	static async uploadAvatar(file) {
		return await this.uploadFile('/api/content/uploadAvatar', file)
	}

	static async uploadHeader(file) {
		return await this.uploadFile('/api/content/uploadHeader', file)
	}
}
