<template>
	<div class="relative">
		<!-- Десктоп версия -->
		<div class="sm:block hidden">
			<p
				class="bg-gradient-to-r from-[#FF7096] to-[#FF8FAB] bg-clip-text text-transparent text-[24px] ml-[589px] font-exo font-semibold mt-[306px] absolute"
			>
				{{ displayName }}
			</p>
			<p
				class="text-[#8B8B8B] font-exo font-semibold text-[14px] absolute ml-[695px] mt-[317px]"
			>
				В сети
			</p>
			<div
				class="bg-[#C50909] rounded-[100px] w-[6px] h-[6px] ml-[745px] mt-[326px] absolute"
			></div>
			<p
				class="font-exo mt-[351px] ml-[588px] text-[16px] font-semibold absolute"
			>
				<span class="text-[#FFFFFF]">143k</span>
				<span class="text-[#D2EE5B] ml-2">Фолловеров</span>
			</p>
			<p
				class="font-exo mt-[351px] ml-[773px] text-[16px] font-semibold absolute"
			>
				<span class="text-[#FFFFFF]">100</span>
				<span class="text-[#D2EE5B] ml-2">Подписок</span>
			</p>
			<p
				class="font-exo mt-[351px] ml-[900px] text-[16px] font-semibold absolute"
			>
				<span class="text-[#FFFFFF]">{{ displayRole }}</span>
				<span class="text-[#D2EE5B] ml-2">Роль</span>
			</p>
			<button
				class="w-[150px] h-[30px] bg-[#D2EE5B] border-[#819723] rounded-[5px] font-exo text-[15px] font-semibold absolute ml-[1283px] mt-[327px]"
			>
				Отслеживать
			</button>
			<button>
				<div class="absolute">
					<img
						:src="messageItem"
						alt="messageItem"
						class="w-[25px] h-[25px] ml-[1452px] mt-[312px]"
					/>
				</div>
			</button>
			<button>
				<div class="absolute">
					<img
						:src="friendsItem"
						alt="friendsItem"
						class="w-[32px] h-[32px] ml-[1485px] mt-[309px]"
					/>
				</div>
			</button>
		</div>

		<!-- Мобильная версия -->
		<div class="sm:hidden block text-center mt-4">
			<p
				class="bg-gradient-to-r from-[#FF7096] to-[#FF8FAB] bg-clip-text text-transparent text-xl font-exo font-semibold"
			>
				{{ displayName }}
			</p>

			<div class="flex items-center justify-center space-x-2 mt-1">
				<p class="text-[#8B8B8B] font-exo font-semibold text-xs">В сети</p>
				<div class="bg-[#C50909] rounded-full w-[6px] h-[6px]"></div>
			</div>

			<div class="flex justify-center space-x-6 mt-3">
				<p class="font-exo text-sm font-semibold">
					<span class="text-[#FFFFFF]">143k</span>
					<span class="text-[#D2EE5B] ml-1">Фолловеров</span>
				</p>
				<p class="font-exo text-sm font-semibold">
					<span class="text-[#FFFFFF]">100</span>
					<span class="text-[#D2EE5B] ml-1">Подписок</span>
				</p>
				<p class="font-exo text-sm font-semibold">
					<span class="text-[#FFFFFF]">{{ displayRole }}</span>
					<span class="text-[#D2EE5B] ml-1">Роль</span>
				</p>
			</div>

			<div class="flex justify-center space-x-4 mt-3">
				<button
					class="w-[120px] h-[30px] bg-[#D2EE5B] border-[#819723] rounded-[5px] font-exo text-sm font-semibold"
				>
					Отслеживать
				</button>
			</div>
		</div>
	</div>
</template>

<script setup>
import { computed } from 'vue'
import friendsItem from '/src/assets/други.png'
import messageItem from '/src/assets/смс.png'

const props = defineProps({
	userData: Object,
	currentUser: Object,
})

const displayName = computed(() => {
	if (!props.userData && !props.currentUser) return 'GhostUser'
	const name = props.userData?.name || props.currentUser?.username
	return name || 'GhostUser'
})

const displayRole = computed(() => {
	return props.userData?.role || props.currentUser?.role || 'user'
})
</script>
