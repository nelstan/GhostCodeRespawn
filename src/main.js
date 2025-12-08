import { createApp } from 'vue'
import App from './App.vue'
import './assets/main.css'
import router from './router'

const originalFetch = window.fetch
window.fetch = async function(...args) {
    const [url, options = {}] = args

    if (typeof url === 'string' && url.startsWith('/api')) {
        const isFormData = options.body instanceof FormData

        const config = {
            ...options,
            headers: {
                ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
                ...options.headers,
            },
            credentials: 'include',
        }

        const token = localStorage.getItem('accessToken')
        if (token && token !== 'undefined' && token !== 'null') {
            config.headers['Authorization'] = `Bearer ${token}`
        }

        try {
            const response = await originalFetch(url, config)

            if (response.status === 401) {
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

                            config.headers['Authorization'] = `Bearer ${tokenData.newJwt}`
                            return await originalFetch(url, config)
                        }
                    }
                } catch (refreshError) {}
                localStorage.removeItem('accessToken')
                localStorage.removeItem('refreshToken')
                localStorage.removeItem('currentUser')

                if (!window.location.pathname.includes('/login')) {
                    window.location.href = '/login'
                }
            }

            return response
        } catch (error) {
            throw error
        }
    }

    return originalFetch(...args)
}

const app = createApp(App)
app.use(router).mount('#app')