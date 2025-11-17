<template>
	<div class="min-h-screen bg-[#0F0F0F]">
		<ProfileHeader />
		<ProfileBanner
			:user-data="userData"
			:current-user="currentUser"
			@header-updated="handleHeaderUpdated"
		/>
		<ProfileAvatar
			:user-data="userData"
			:current-user="currentUser"
			@avatar-updated="handleAvatarUpdated"
		/>
		<ProfileInfo :user-data="userData" :current-user="currentUser" />
		<ProfileTabs :user-data="userData" :current-user="currentUser" />
	</div>
</template>

<script setup>
import ProfileAvatar from '@/components/profile/ProfileAvatar.vue'
import ProfileBanner from '@/components/profile/ProfileBanner.vue'
import ProfileHeader from '@/components/profile/ProfileHeader.vue'
import ProfileInfo from '@/components/profile/ProfileInfo.vue'
import ProfileTabs from '@/components/profile/ProfileTabs.vue'
import { onMounted, ref, watch } from 'vue'

const userData = ref(null)
const currentUser = ref(null)

const handleAvatarUpdated = async avatarLink => {
	if (userData.value) userData.value.avatarLink = avatarLink
	const savedUser = localStorage.getItem('currentUser')
	if (savedUser) {
		const user = JSON.parse(savedUser)
		user.avatarLink = avatarLink
		localStorage.setItem('currentUser', JSON.stringify(user))
		currentUser.value = user
	}
}

const handleHeaderUpdated = async headerLink => {
	if (userData.value) userData.value.headerLink = headerLink
	const savedUser = localStorage.getItem('currentUser')
	if (savedUser) {
		const user = JSON.parse(savedUser)
		user.headerLink = headerLink
		localStorage.setItem('currentUser', JSON.stringify(user))
		currentUser.value = user
	}
}

const loadUserData = async () => {
	const savedUser = localStorage.getItem('currentUser')
	if (savedUser) {
		const user = JSON.parse(savedUser)
		currentUser.value = user
		userData.value = {
			name: user.username || '',
			role: user.role || 'user',
			avatarLink: user.avatarLink || '',
			headerLink: user.headerLink || '',
		}
	}
}

watch(
	() => localStorage.getItem('currentUser'),
	newUser => {
		if (newUser) {
			const user = JSON.parse(newUser)
			currentUser.value = user
			if (userData.value) {
				userData.value.name = user.username || ''
				userData.value.role = user.role || 'user'
				userData.value.avatarLink = user.avatarLink || ''
				userData.value.headerLink = user.headerLink || ''
			}
		}
	}
)

onMounted(() => {
	loadUserData()
})
</script>
