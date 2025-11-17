<script setup>
const props = defineProps({
	isLoading: {
		type: Boolean,
		default: false,
	},
	disabled: {
		type: Boolean,
		default: false,
	},
})

const emit = defineEmits(['post-submit'])

const handleClick = () => {
	if (!props.disabled && !props.isLoading) {
		emit('post-submit')
	}
}
</script>

<template>
	<button
		@click="handleClick"
		:disabled="props.disabled || props.isLoading"
		:class="[
			'w-[347px] h-[59px] ml-[264px] mt-[50px] rounded-[10px] text-[#FFFFFF] font-exo text-[20px] font-[300] border transition-colors',
			props.disabled || props.isLoading
				? 'bg-[#484848] border-[#676666] cursor-not-allowed opacity-50'
				: 'bg-[#484848] border-[#9AFE81] hover:bg-[#5a5a5a]',
		]"
	>
		{{ props.isLoading ? 'Публикация...' : 'Опубликовать' }}
	</button>
</template>
