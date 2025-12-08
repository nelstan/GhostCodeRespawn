import { computed, ref, watch } from 'vue'
import { useAuth } from './useAuth.js'
import { useGlobalStore } from './useGlobalStore.js'

export function useUser() {
	const { apiRequest } = useAuth()
	const { globalState, updateCurrentUser, updateUserAvatar, updateUserHeader } =
		useGlobalStore()

	const currentUser = globalState.currentUser
	const userData = ref(null)
	const loading = ref(false)
	const error = ref(null)

	const fetchUserData = async (userId = null) => {
		loading.value = true
		error.value = null

		try {
			const storedUser = localStorage.getItem('currentUser')
			if (storedUser) {
				updateCurrentUser(JSON.parse(storedUser))
				userData.value = { ...globalState.currentUser }
			}

			if (userId) {
				const response = await apiRequest(
					`/api/accounts/getData/${encodeURIComponent(userId)}`
				)
				if (response.ok) {
					const data = await response.json()
					userData.value = data.data
				} else {
					throw new Error('Пользователь не найден')
				}
			} else {
				const response = await apiRequest('/api/accounts/me')
				if (response.ok) {
					const data = await response.json()
					updateCurrentUser(data.data)
					userData.value = data.data
				} else {
					throw new Error('Не удалось загрузить данные пользователя')
				}
			}
		} catch (err) {
			error.value = err.message
			console.error('Error fetching user data:', err)

			if (!globalState.currentUser) {
				const defaultUser = {
					username: 'User',
					name: 'Пользователь',
					role: 'user',
					avatarLink: null,
					headerLink: null,
				}
				updateCurrentUser(defaultUser)
				userData.value = { ...defaultUser }
			}
		} finally {
			loading.value = false
		}
	}

	const updateUserData = async updateData => {
		try {
			const response = await apiRequest('/api/accounts/update', {
				method: 'POST',
				body: JSON.stringify(updateData),
			})

			if (response.ok) {
				const data = await response.json()
				if (!userData.value?.id) {
					updateCurrentUser({ ...globalState.currentUser, ...data.data })
					userData.value = { ...userData.value, ...data.data }
				}
				return data.data
			} else {
				throw new Error('Ошибка обновления данных')
			}
		} catch (err) {
			error.value = err.message
			throw err
		}
	}

	const isAdmin = computed(() => {
		const role = (userData.value?.role || globalState.currentUser?.role || '')
			.toString()
			.toLowerCase()
			.trim()
		return role === 'admin'
	})

	const isDeveloper = computed(() => {
		const role = (userData.value?.role || globalState.currentUser?.role || '')
			.toString()
			.toLowerCase()
			.trim()
		return role === 'developer' || role === 'admin'
	})

	watch(
		[userData],
		() => {
			console.log('User data updated:', {
				userData: userData.value,
				currentUser: globalState.currentUser,
				isAdmin: isAdmin.value,
				isDeveloper: isDeveloper.value,
			})
		},
		{ deep: true, immediate: true }
	)

	return {
		currentUser,
		userData,
		loading,
		error,
		fetchUserData,
		updateUserData,
		updateUserAvatar,
		updateUserHeader,
		isAdmin,
		isDeveloper,
	}
}
