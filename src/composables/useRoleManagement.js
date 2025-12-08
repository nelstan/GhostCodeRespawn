import { ref } from 'vue'
import { useAuth } from './useAuth.js'

export function useRoleManagement() {
	const { apiRequest } = useAuth()

	const searchUsername = ref('')
	const selectedRole = ref('user')
	const availableRoles = ref([
		{ value: 'user', label: 'Обычный юзер' },
		{ value: 'premium', label: 'Премиум-юзер' },
		{ value: 'beta-tester', label: 'Бета-тестер' },
		{ value: 'developer', label: 'Разработчик' },
		{ value: 'admin', label: 'Админ' },
	])
	const searchResult = ref(null)
	const loading = ref(false)
	const message = ref('')

	const searchUser = async () => {
		if (!searchUsername.value.trim()) {
			message.value = 'Введите имя пользователя'
			return
		}

		loading.value = true
		message.value = ''
		searchResult.value = null

		try {
			const encodedUsername = encodeURIComponent(searchUsername.value)
			const response = await apiRequest(
				`/api/accounts/getData/${encodedUsername}`
			)

			if (response.ok) {
				const data = await response.json()
				searchResult.value = {
					username: searchUsername.value,
					...data.data,
				}
				selectedRole.value = data.data.role || 'user'
				message.value = 'Пользователь найден'
			} else if (response.status === 404) {
				message.value = 'Пользователь не найден'
			} else {
				message.value = 'Ошибка поиска пользователя'
			}
		} catch (error) {
			message.value = 'Ошибка поиска пользователя'
			console.error('Search error:', error)
		} finally {
			loading.value = false
		}
	}

	const updateUserRole = async () => {
		if (!searchResult.value) {
			message.value = 'Сначала найдите пользователя'
			return
		}

		loading.value = true
		message.value = ''

		try {
			const response = await apiRequest('/api/accounts/updateRole', {
				method: 'POST',
				body: JSON.stringify({
					targetUsername: searchResult.value.username,
					newRole: selectedRole.value,
				}),
			})

			if (response.ok) {
				const data = await response.json()
				message.value = 'Роль успешно обновлена'
				searchResult.value.role = selectedRole.value
			} else {
				const errorData = await response.json()
				message.value = errorData.message || 'Ошибка обновления роли'
			}
		} catch (error) {
			message.value = 'Ошибка обновления роли'
			console.error('Role update error:', error)
		} finally {
			loading.value = false
		}
	}

	const reset = () => {
		searchUsername.value = ''
		selectedRole.value = 'user'
		searchResult.value = null
		message.value = ''
	}

	return {
		searchUsername,
		selectedRole,
		availableRoles,
		searchResult,
		loading,
		message,
		searchUser,
		updateUserRole,
		reset,
	}
}
