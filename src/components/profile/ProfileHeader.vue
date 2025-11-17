<template>
	<header class="sm:block hidden">
		<div class="w-[1905px] h-[47px] border border-[#242627] rounded-b-lg">
			<div class="relative">
				<router-link to="/GhostCode">
					<img
						:src="logo"
						alt="logo"
						class="ml-[250px] absolute mt-[7px] w-[35px] h-[35px]"
					/>
				</router-link>
			</div>
			<div>
				<input
					class="w-[250px] text-center ml-[315px] mt-[9px] bg-[#202020] font-exo rounded-[25px] outline-none"
					type="text"
					placeholder="Что ищите в царстве теней?"
				/>
			</div>
			<div>
				<button class="absolute">
					<img
						:src="messageItem"
						alt="messageItem"
						class="w-[25px] h-[25px] ml-[1541px] mt-[-22px]"
					/>
				</button>
				<router-link to="/enigma">
					<button
						class="absolute text-[#FFFFFF] mt-[-25px] w-[120px] h-[30px] bg-[#015101] border-[#017a01] border-[1px] rounded-[5px] ml-[1400px]"
					>
						Купить Enigma
					</button>
				</router-link>
			</div>
			<div>
				<button class="absolute">
					<img
						:src="notificationItem"
						alt="notificationItem"
						class="w-[40px] h-[40px] ml-[1571px] mt-[-28px]"
					/>
				</button>
			</div>
			<button>
				<img
					:src="currentAvatarUrl"
					alt="userAvatar"
					class="absolute w-[29px] h-[29px] ml-[1630px] mt-[-42px] rounded-full"
					@error="handleAvatarError"
				/>
			</button>
		</div>
	</header>

	<header class="sm:hidden block bg-[#0F0F0F] border-b border-[#242627]">
		<div class="flex items-center justify-between p-4">
			<router-link to="/GhostCode">
				<img :src="logo" alt="logo" class="w-[30px] h-[30px]" />
			</router-link>

			<div class="flex items-center space-x-3">
				<router-link to="/enigma">
					<button
						class="text-[#FFFFFF] px-3 py-1 bg-[#015101] border-[#017a01] border-[1px] rounded-[5px] text-xs"
					>
						Enigma
					</button>
				</router-link>
				<button>
					<img
						:src="currentAvatarUrl"
						alt="userAvatar"
						class="w-[25px] h-[25px] rounded-full"
						@error="handleAvatarError"
					/>
				</button>
			</div>
		</div>
	</header>
</template>

<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import notificationItem from '/src/assets/1.png'
import defaultAvatar from '/src/assets/авапрофиль.png'
import logo from '/src/assets/лого.png'
import messageItem from '/src/assets/смс.png'

const avatarLink = ref('')

const loadAvatarFromStorage = () => {
	const savedAvatar = localStorage.getItem('userAvatar')
	const base64Avatar = localStorage.getItem('avatarBase64')

	console.log('📥 Загружаем аватар для шапки:', {
		savedAvatar,
		hasBase64: !!base64Avatar,
	})

	if (base64Avatar) {
		avatarLink.value = 'base64'
	} else if (savedAvatar) {
		avatarLink.value = savedAvatar
	}
}

const currentAvatarUrl = computed(() => {
	if (avatarLink.value === 'base64') {
		const base64 = localStorage.getItem('avatarBase64')
		console.log('🖼️ Используем base64 аватар в шапке')
		return base64 || defaultAvatar
	}

	if (avatarLink.value) {
		const url = `/api/content/link/avatars/${avatarLink.value}`
		console.log('🔗 Формируем URL аватара для шапки:', url)
		return url
	}

	console.log('🖼️ Используем дефолтный аватар в шапке')
	return defaultAvatar
})

const handleAvatarError = event => {
	console.error('❌ Ошибка загрузки аватара в шапке:', event.target.src)
	event.target.src = defaultAvatar
}

watch(
	() => localStorage.getItem('userAvatar'),
	newAvatar => {
		console.log('🔄 Обновление аватара в шапке')
		avatarLink.value = newAvatar || ''
	}
)

watch(
	() => localStorage.getItem('avatarBase64'),
	newBase64 => {
		if (newBase64) {
			console.log('🔄 Обновление base64 аватара в шапке')
			avatarLink.value = 'base64'
		}
	}
)

onMounted(() => {
	loadAvatarFromStorage()
})
</script>
