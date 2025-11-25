<script setup>
import notifaction from '@/assets/1.png'
import lineAdmin from '@/assets/lineAdmin.png'
import starsAdmin from '@/assets/starsAdmin.png'
import avatar from '@/assets/ава.png'
import logo from '@/assets/лого.png'
import lupa from '@/assets/лупа.png'
import sms from '@/assets/смс.png'
import PostsComponents from '@/components/PostsComponents.vue'
import userLeftMain from '@/components/userLeftMain.vue'
import { useGlobalStore } from '@/composables/useGlobalStore'
import { computed, onMounted, ref } from 'vue'

const { globalState, initializeFromStorage } = useGlobalStore()

const showContent = ref(false)
const showRecoveryCode = ref(false)
const recoveryCode = ref('')
const userRole = ref('')
const userPosts = ref([])

const checkRecoveryCode = () => {
	const storedRecoveryCode = localStorage.getItem('recoveryCode')

	if (storedRecoveryCode) {
		recoveryCode.value = storedRecoveryCode
		showRecoveryCode.value = true
		localStorage.removeItem('recoveryCode')
	}
}

const getUserData = () => {
	if (globalState.currentUser) {
		userRole.value = globalState.currentUser.role || 'Пользователь'
	}
}

const loadUserPosts = () => {
	const storedPosts = localStorage.getItem('userPosts')
	if (storedPosts) {
		userPosts.value = JSON.parse(storedPosts)
	}
}

const updatePosts = () => {
	loadUserPosts()
}

onMounted(() => {
	initializeFromStorage()

	setTimeout(() => {
		showContent.value = true
	}, 100)

	checkRecoveryCode()
	getUserData()
	loadUserPosts()

	window.addEventListener('storage', updatePosts)
	window.addEventListener('avatarUpdated', getUserData)
})

const closeRecoveryCode = () => {
	showRecoveryCode.value = false
}

const copyToClipboard = () => {
	navigator.clipboard
		.writeText(recoveryCode.value)
		.then(() => {
			alert('Код скопирован в буфер обмена!')
		})
		.catch(err => {
			console.error('Ошибка копирования: ', err)
		})
}

const getRoleColor = role => {
	const colors = {
		admin: 'text-red-400',
		moderator: 'text-blue-400',
		vip: 'text-purple-400',
		premium: 'text-yellow-400',
		user: 'text-green-400',
	}
	return colors[role?.toLowerCase()] || 'text-gray-400'
}

const getRoleDisplayName = role => {
	const names = {
		admin: 'Администратор',
		moderator: 'Модератор',
		vip: 'VIP',
		premium: 'Премиум',
		user: 'Пользователь',
	}
	return names[role?.toLowerCase()] || role || 'Пользователь'
}

const hasPosts = computed(() => {
	return userPosts.value.length > 0
})

const getUserAvatar = () => {
	if (globalState.currentUser?.avatarLink) {
		return `/api/content/link/avatars/${globalState.currentUser.avatarLink}`
	}
	return avatar
}
</script>

<template>
	<div
		v-if="showRecoveryCode"
		class="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50"
	>
		<div
			class="bg-[#1E1E1E] border border-[#D2EE5B] rounded-[20px] p-8 max-w-md w-full mx-4 relative"
		>
			<button
				@click="closeRecoveryCode"
				class="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
			>
				<svg
					class="w-6 h-6"
					fill="none"
					stroke="currentColor"
					viewBox="0 0 24 24"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M6 18L18 6M6 6l12 12"
					></path>
				</svg>
			</button>

			<div class="text-center mb-6">
				<h2 class="text-2xl font-bold text-white font-exo mb-2">
					Ваш Recovery Code
				</h2>
				<p class="text-gray-400 text-sm">Сохраните этот код в надежном месте</p>
			</div>

			<div class="bg-[#2A2A2A] border border-[#3A3A3A] rounded-[15px] p-4 mb-6">
				<div class="flex items-center justify-between">
					<code
						class="text-[#D2EE5B] font-mono text-lg font-bold tracking-wider break-all"
					>
						{{ recoveryCode }}
					</code>
					<button
						@click="copyToClipboard"
						class="ml-3 p-2 bg-[#D2EE5B] bg-opacity-20 rounded-lg hover:bg-opacity-30 transition-all"
						title="Скопировать"
					>
						<svg
							class="w-5 h-5 text-[#D2EE5B]"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
							></path>
						</svg>
					</button>
				</div>
			</div>

			<div
				class="bg-yellow-500 bg-opacity-10 border border-yellow-500 border-opacity-30 rounded-[10px] p-3 mb-6"
			>
				<p class="text-yellow-400 text-xs text-center">
					⚠️ Этот код можно увидеть только один раз. Не забудьте его сохранить!
				</p>
			</div>

			<button
				@click="closeRecoveryCode"
				class="w-full bg-[#D2EE5B] text-black font-exo font-bold py-3 rounded-[15px] hover:bg-[#c5e34a] transition-colors"
			>
				Понятно
			</button>
		</div>
	</div>
	<transition name="fade">
		<div v-if="showContent" class="bg-[#111111] min-h-screen">
			<div
				class="flex w-full h-[47px] border-b-2 border-[#242627] items-center fixed bg-[#111111] z-10"
			>
				<img :src="logo" alt="logo" class="h-full ml-[250px]" />

				<div class="flex items-center ml-auto mr-[250px]">
					<div class="relative">
						<input
							type="text"
							placeholder="Что ищете в царстве теней?"
							class="ml-[-550px] font-exo font-[400] text-[14px] w-[262px] h-[29px] bg-[#202020] pl-[35px] rounded-[25px] border border-[#2C2C2C] cursor-pointer outline-none text-[#B6B5B5]"
						/>
					</div>
					<img :src="lupa" alt="search icon" class="absolute ml-[-540px]" />

					<div class="flex items-center ml-[25px] space-x-[15px]">
						<img
							:src="sms"
							alt="sms"
							class="w-[25px] h-[25px] cursor-pointer"
						/>

						<div class="relative">
							<img
								:src="notifaction"
								alt="notifaction"
								class="w-[40px] h-[40px] cursor-pointer"
							/>
							<span
								class="absolute -top-0.5 -right-2 bg-gradient-to-r from-[#FF0000] to-[#990000] text-white font-bold px-1 py-0.5 rounded-full text-[10px] min-w-[20px] text-center"
							>
								99+
							</span>
						</div>

						<RouterLink to="/Profile" class="flex items-center space-x-2">
							<img
								:src="getUserAvatar()"
								alt="avatar"
								class="w-[30px] h-[30px] cursor-pointer rounded-full"
							/>
							<div v-if="userRole" class="flex flex-col items-start">
								<span class="text-white text-sm font-exo font-[600]">
									{{ globalState.currentUser?.username || 'Пользователь' }}
								</span>
								<span
									:class="[
										'text-xs font-exo font-[500]',
										getRoleColor(userRole),
									]"
								>
									{{ getRoleDisplayName(userRole) }}
								</span>
							</div>
						</RouterLink>
					</div>
				</div>
			</div>

			<div class="pt-[60px] flex justify-between px-[250px]">
				<div class="w-[800px] mt-[80px]">
					<router-link
						to="/CreatePost"
						class="w-[350px] h-[30px] bg-[#D2EE5B] flex items-center justify-center rounded-[20px] font-exo text-[13px] font-[600] mt-[-50px] absolute"
					>
						Создать пост
					</router-link>

					<div>
						<PostsComponents />
					</div>

					<div v-if="hasPosts" class="space-y-8">
						<PostsComponents
							v-for="post in userPosts"
							:key="post.id"
							:post="post"
							:is-user-post="true"
						/>
					</div>
				</div>

				<div
					class="w-[350px] h-fit bg-[#161616] border border-[#242627] rounded-[25px] mt-[80px] ml-[px] absolute"
				>
					<div class="relative">
						<img
							:src="starsAdmin"
							alt="stars"
							class="absolute top-3 left-[10px]"
						/>
						<img
							:src="starsAdmin"
							alt="stars"
							class="absolute top-3 right-[10px]"
						/>
					</div>

					<b
						class="flex justify-center text-white font-exo font-[600] text-[18px] py-[9px]"
					>
						Популярное за неделю
					</b>

					<img :src="lineAdmin" alt="divider" class="mx-[32px]" />

					<div class="p-[15px]">
						<div class="flex items-center mb-[10px]">
							<img
								:src="getUserAvatar()"
								alt="avatar"
								class="w-[30px] h-[30px] rounded-full mr-[10px]"
							/>
							<div class="flex-1">
								<div class="flex justify-between items-center">
									<div class="flex items-center space-x-2">
										<p
											class="font-exo font-[600] bg-clip-text text-transparent bg-gradient-to-r from-[#FF7096] to-[#FF8FAB]"
										>
											size
										</p>
										<span
											class="text-blue-400 text-xs font-exo font-[500] bg-blue-400 bg-opacity-10 px-2 py-1 rounded-full"
										>
											Модератор
										</span>
									</div>
									<p class="text-[#D5D5D5] text-[13px] font-exo">4 дня назад</p>
								</div>
								<p class="font-exo font-[400] text-white text-[14px] mt-[5px]">
									GhostCode - анонимный GitHub
								</p>
							</div>
						</div>
					</div>

					<img :src="lineAdmin" alt="divider" class="mx-[32px]" />

					<div class="p-[15px]">
						<userLeftMain />
						<userLeftMain />
						<userLeftMain />
						<userLeftMain />
						<userLeftMain />
					</div>
				</div>
			</div>
		</div>
	</transition>
</template>

<style>
.fade-enter-active,
.fade-leave-active {
	transition: opacity 0.5s ease;
}
.fade-enter-from,
.fade-leave-to {
	opacity: 0;
}
</style>
