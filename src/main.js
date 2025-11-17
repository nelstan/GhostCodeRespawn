import { createApp } from 'vue'
import App from './App.vue'
import './assets/main.css'
import router from './router'

// Глобальная конфигурация fetch для работы с API
const originalFetch = window.fetch
window.fetch = async function (...args) {
	const [url, options = {}] = args

	// Добавляем базовые заголовки для API запросов
	if (typeof url === 'string' && url.startsWith('/api')) {
		// Определяем, является ли body FormData
		const isFormData = options.body instanceof FormData

		const config = {
			...options,
			headers: {
				// Устанавливаем Content-Type только если это НЕ FormData
				...(isFormData ? {} : { 'Content-Type': 'application/json' }),
				...options.headers,
			},
			credentials: 'include', // Важно для работы с куками и сессиями
		}

		// Добавляем токен авторизации если есть
		const token =
			localStorage.getItem('accessToken') || localStorage.getItem('jwt_token')
		if (token && token !== 'undefined' && token !== 'null') {
			config.headers['Authorization'] = `Bearer ${token}`
		}

		try {
			console.log('🔄 API Request:', {
				url,
				method: config.method,
				headers: config.headers,
			})
			const response = await originalFetch(url, config)
			console.log('✅ API Response:', { status: response.status, url })

			// Обрабатываем 401 ошибку (неавторизован)
			if (response.status === 401) {
				console.log('🔑 Token expired, trying to refresh...')
				// Пробуем обновить токен
				try {
					const refreshToken = localStorage.getItem('refreshToken')
					if (refreshToken) {
						const refreshResponse = await originalFetch('/api/tokens/refresh', {
							method: 'POST',
							headers: { 'Content-Type': 'application/json' },
							body: JSON.stringify({ token: refreshToken }),
						})

						if (refreshResponse.ok) {
							const tokenData = await refreshResponse.json()
							localStorage.setItem('accessToken', tokenData.newJwt)
							localStorage.setItem('refreshToken', tokenData.newRefresh)

							// Повторяем исходный запрос с новым токеном
							config.headers['Authorization'] = `Bearer ${tokenData.newJwt}`
							return await originalFetch(url, config)
						}
					}
				} catch (refreshError) {
					console.error('❌ Token refresh failed:', refreshError)
				}

				// Если не удалось обновить токен - разлогиниваем
				localStorage.removeItem('accessToken')
				localStorage.removeItem('refreshToken')
				localStorage.removeItem('currentUser')
				localStorage.removeItem('jwt_token')

				// Перенаправляем на страницу логина если мы не на ней
				if (!window.location.pathname.includes('/login')) {
					window.location.href = '/login'
				}
			}

			return response
		} catch (error) {
			console.error('❌ Fetch error:', error)
			throw error
		}
	}

	return originalFetch(...args)
}

// Глобальный обработчик ошибок Vue
const app = createApp(App)

app.config.errorHandler = (err, instance, info) => {
	console.error('Vue error:', err)
	console.error('Component:', instance)
	console.error('Info:', info)
}

app.use(router).mount('#app')

// Глобальный обработчик необработанных ошибок
window.addEventListener('error', event => {
	console.error('Global error:', event.error)
})

window.addEventListener('unhandledrejection', event => {
	console.error('Unhandled promise rejection:', event.reason)
})
