import { ref } from 'vue'

const globalState = ref({
	currentUser: null,
})

export function useGlobalStore() {
	const initializeFromStorage = () => {
		const storedUser = localStorage.getItem('currentUser')
		if (storedUser) {
			globalState.value.currentUser = JSON.parse(storedUser)
		}
	}

	const updateCurrentUser = userData => {
		globalState.value.currentUser = userData
		localStorage.setItem('currentUser', JSON.stringify(userData))
		window.dispatchEvent(new CustomEvent('userUpdated'))
	}

	const updateUserAvatar = avatarLink => {
		if (globalState.value.currentUser) {
			globalState.value.currentUser.avatarLink = avatarLink
			localStorage.setItem(
				'currentUser',
				JSON.stringify(globalState.value.currentUser)
			)
			window.dispatchEvent(
				new CustomEvent('avatarUpdated', { detail: { avatarLink } })
			)
		}
	}

	const updateUserHeader = headerLink => {
		if (globalState.value.currentUser) {
			globalState.value.currentUser.headerLink = headerLink
			localStorage.setItem(
				'currentUser',
				JSON.stringify(globalState.value.currentUser)
			)
		}
	}

	return {
		globalState,
		initializeFromStorage,
		updateCurrentUser,
		updateUserAvatar,
		updateUserHeader,
	}
}
