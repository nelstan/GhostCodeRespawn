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

			const response = await fetch('http://ghostcode.byxesh-dev.space/api/tokens/refresh', {
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
		let token = localStorage.getItem('accessToken')

		const isFormData = options.body instanceof FormData

		const config = {
			...options,
			headers: {
				...(isFormData ? {} : { 'Content-Type': 'application/json' }),
				...options.headers,
			},
			credentials: 'include',
		}

		if (token) {
			config.headers['Authorization'] = `Bearer ${token}`
		}

		let response = await fetch(url, config)

		if (response.status === 401) {
			const newToken = await refreshAccessToken()
			if (newToken) {
				config.headers['Authorization'] = `Bearer ${newToken}`
				response = await fetch(url, config)
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