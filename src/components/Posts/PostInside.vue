<script setup>
import { ref, watch } from 'vue'

const content = ref('')

const emit = defineEmits(['content-update'])

watch(content, newContent => {
	emit('content-update', newContent)
})
</script>

<template>
	<textarea
		v-model="content"
		placeholder="Ваша анонимная история..."
		class="w-[765px] h-[425px] bg-[#2F2F2F] border border-[#9AFE81] ml-[100px] mt-[30px] p-4 resize-none text-[#FFFFFF] font-exo outline-none placeholder:text-[#716E6E] rounded-[10px]"
		required
	></textarea>
</template>