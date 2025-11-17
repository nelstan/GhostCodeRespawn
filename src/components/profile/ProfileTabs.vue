<template>
	<div
		class="absolute ml-[250px] mt-[400px] w-[1350px] bg-[#1A1A1A] rounded-lg p-6 font-exo text-white sm:block hidden"
	>
		<div class="flex space-x-8 mb-6">
			<button
				v-for="(button, index) in buttons"
				:key="index"
				@click="$emit('set-active-button', index)"
				:class="[
					'px-6 py-2 rounded-lg transition-all duration-300 font-semibold',
					activeButton === index
						? 'bg-[#D2EE5B] text-gray-900'
						: 'bg-[#2A2A2A] text-white hover:bg-[#333333]',
				]"
			>
				{{ button }}
			</button>
		</div>

		<TabContent
			:active-button="activeButton"
			:user-data="userData"
			:current-user="currentUser"
		/>
	</div>

	<!-- Мобильная версия -->
	<div
		class="sm:hidden block mx-4 mt-[10px] bg-[#1A1A1A] rounded-lg p-4 font-exo text-white"
	>
		<div class="flex overflow-x-auto space-x-4 mb-4 pb-2">
			<button
				v-for="(button, index) in buttons"
				:key="index"
				@click="$emit('set-active-button', index)"
				:class="[
					'px-4 py-2 rounded-lg transition-all duration-300 font-semibold whitespace-nowrap text-sm',
					activeButton === index
						? 'bg-[#D2EE5B] text-gray-900'
						: 'bg-[#2A2A2A] text-white hover:bg-[#333333]',
				]"
			>
				{{ button }}
			</button>
		</div>

		<TabContent
			:active-button="activeButton"
			:user-data="userData"
			:current-user="currentUser"
			mobile
		/>
	</div>
</template>

<script setup>
import { defineEmits, defineProps } from 'vue'
import TabContent from './TabContent.vue'

defineProps({
	activeButton: Number,
	userData: Object,
	currentUser: Object,
})

defineEmits(['set-active-button'])

const buttons = ['Информационный', 'Koнтeнт', 'Cтатистика', 'Управление ролями']
</script>
