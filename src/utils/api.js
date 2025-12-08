// src/utils/api.js

export class ApiService {
	static async request(url, options = {}) {
		const token =
			localStorage.getItem('jwt_token') || localStorage.getItem('accessToken')

		// Определяем, является ли body FormData
		const isFormData = options.body instanceof FormData

		const defaultOptions = {
			headers: {
				// Устанавливаем Content-Type только если это НЕ FormData
				...(isFormData ? {} : { 'Content-Type': 'application/json' }),
				...(token && { Authorization: `Bearer ${token}` }),
			},
		}

		const config = {
			...defaultOptions,
			...options,
			headers: {
				...defaultOptions.headers,
				...options.headers,
			},
		}

		try {
			const response = await fetch(url, config)

			if (response.status === 401) {
				// Попробуем обновить токен
				const newToken = await this.refreshToken()
				if (newToken) {
					config.headers.Authorization = `Bearer ${newToken}`
					return await fetch(url, config)
				} else {
					localStorage.removeItem('jwt_token')
					localStorage.removeItem('refresh_token')
					localStorage.removeItem('accessToken')
					localStorage.removeItem('refreshToken')
					window.location.href = '/login'
					return
				}
			}

			return response
		} catch (error) {
			throw new Error(`Network error: ${error.message}`)
		}
	}

	static async refreshToken() {
		const refreshToken =
			localStorage.getItem('refresh_token') ||
			localStorage.getItem('refreshToken')

		if (!refreshToken) {
			throw new Error('No refresh token available')
		}

		try {
			const response = await fetch('/api/tokens/refresh', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ token: refreshToken }),
			})

			if (response.ok) {
				const data = await response.json()
				localStorage.setItem('jwt_token', data.newJwt)
				localStorage.setItem('accessToken', data.newJwt)
				localStorage.setItem('refresh_token', data.newRefresh)
				localStorage.setItem('refreshToken', data.newRefresh)
				return data.newJwt
			} else {
				throw new Error('Token refresh failed')
			}
		} catch (error) {
			console.error('Token refresh error:', error)
			return null
		}
	}
}
