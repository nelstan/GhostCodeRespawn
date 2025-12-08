<template>
	<!-- Десктоп версия -->
	<div v-if="!mobile">
		<div v-if="activeButton === 0" class="space-y-4">
			<InformationTab :user-data="userData" :current-user="currentUser" />
		</div>

		<div v-if="activeButton === 1" class="text-gray-300">
			<h2 class="text-white text-xl font-bold mb-4">Koнтент</h2>
			<p>Содержимое контента будет здесь...</p>
		</div>

		<div v-if="activeButton === 2" class="text-gray-300">
			<h2 class="text-white text-xl font-bold mb-4">Cтатистика</h2>
			<p>Статистические данные будут здесь...</p>
		</div>

		<div v-if="activeButton === 3">
			<RoleManagement :user-data="userData" :current-user="currentUser" />
		</div>
	</div>

	<!-- Мобильная версия -->
	<div v-else>
		<div v-if="activeButton === 0" class="space-y-4 text-sm">
			<InformationTab
				:user-data="userData"
				:current-user="currentUser"
				mobile
			/>
		</div>

		<div v-if="activeButton === 1" class="text-gray-300 text-sm">
			<h2 class="text-white text-lg font-bold mb-4">Koнтент</h2>
			<p>Содержимое контента будет здесь...</p>
		</div>

		<div v-if="activeButton === 2" class="text-gray-300 text-sm">
			<h2 class="text-white text-lg font-bold mb-4">Cтатистика</h2>
			<p>Статистические данные будут здесь...</p>
		</div>

		<div v-if="activeButton === 3">
			<RoleManagement :user-data="userData" :current-user="currentUser" />
		</div>
	</div>
</template>

<script setup>
import InformationTab from './InformationTab.vue'
import RoleManagement from './RoleManagement.vue'

defineProps({
	activeButton: Number,
	userData: Object,
	currentUser: Object,
	mobile: Boolean,
})
</script>
