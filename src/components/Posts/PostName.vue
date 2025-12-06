<script setup>
import { ref, watch } from 'vue'

const title = ref('')

const emit = defineEmits(['title-update'])

watch(title, newTitle => {
	emit('title-update', newTitle)
})
</script>

<template>
	<div>
		<input
			v-model="title"
			type="text"
			placeholder="Придумайте анонимное название..."
			class="w-[420px] h-[61px] bg-[#2F2F2F] border border-[#9AFE81] ml-[270px] mt-[0px] pl-[38px] outline-none text-[#FFFFFF] font-exo rounded-[10px]"
		/>
	</div>
</template>