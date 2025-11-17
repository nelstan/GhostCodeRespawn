import { useRouter } from 'vue-router'

export function useAuth() {
	const router = useRouter()

	const saveAuthData = (token, refreshToken, userData) => {
		localStorage.setItem('accessToken', token)
		if (refreshToken) {
			localStorage.setItem('refreshToken', refreshToken)
		}
		localStorage.setItem('currentUser', JSON.stringify(userData))
	}

	const refreshAccessToken = async () => {
		try {
			const refreshToken = localStorage.getItem('refreshToken')
			if (!refreshToken) {
				throw new Error('No refresh token')
			}

			console.log('🔄 Обновление токена...')
			const response = await fetch('/api/tokens/refresh', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ token: refreshToken }),
			})

			if (!response.ok) {
				throw new Error('Token refresh failed')
			}

			const data = await response.json()
			localStorage.setItem('accessToken', data.newJwt)
			localStorage.setItem('refreshToken', data.newRefresh)
			console.log('✅ Токен обновлен')
			return data.newJwt
		} catch (err) {
			console.error('❌ Ошибка обновления токена:', err)
			localStorage.removeItem('accessToken')
			localStorage.removeItem('refreshToken')
			localStorage.removeItem('currentUser')
			router.push('/login')
			return null
		}
	}

	const apiRequest = async (url, options = {}) => {
		let token = localStorage.getItem('accessToken')

		// Определяем, является ли body FormData
		const isFormData = options.body instanceof FormData

		const config = {
			...options,
			headers: {
				// Устанавливаем Content-Type только если это НЕ FormData
				...(isFormData ? {} : { 'Content-Type': 'application/json' }),
				...options.headers,
			},
			credentials: 'include',
		}

		if (token) {
			config.headers['Authorization'] = `Bearer ${token}`
		}

		console.log('🔄 API Request:', {
			url,
			method: config.method,
			headers: config.headers,
		})

		let response = await fetch(url, config)

		console.log('📥 API Response:', { status: response.status, url })

		if (response.status === 401) {
			console.log('🔑 Токен истек, пробуем обновить...')
			const newToken = await refreshAccessToken()
			if (newToken) {
				config.headers['Authorization'] = `Bearer ${newToken}`
				response = await fetch(url, config)
				console.log('🔄 Повторный запрос после обновления токена')
			}
		}

		return response
	}

	const logout = () => {
		localStorage.removeItem('accessToken')
		localStorage.removeItem('refreshToken')
		localStorage.removeItem('currentUser')
		localStorage.removeItem('jwt_token')
		router.push('/login')
	}

	return {
		saveAuthData,
		refreshAccessToken,
		apiRequest,
		logout,
	}
}
