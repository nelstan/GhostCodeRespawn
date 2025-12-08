<script setup>
import { onMounted, ref, watch } from 'vue'

const props = defineProps({
    initialHashtags: {
        type: String,
        default: ''
    }
})

const hashtags = ref('')

const emit = defineEmits(['hashtags-update'])

onMounted(() => {
    if (props.initialHashtags) {
        hashtags.value = props.initialHashtags
        emit('hashtags-update', hashtags.value)
    }
})

const formatHashtags = input => {
    if (!input.trim()) return ''

    const tags = input
        .split(',')
        .map(tag => tag.trim())
        .filter(tag => tag.length > 0)
        .map(tag => (tag.startsWith('#') ? tag : `#${tag}`))

    return tags.join(', ')
}

watch(hashtags, newHashtags => {
    const formattedHashtags = formatHashtags(newHashtags)
    emit('hashtags-update', formattedHashtags)
})
</script>

<template>
    <input
        v-model="hashtags"
        type="text"
        placeholder="Введите хэштеги через запятую..."
        class="w-[770px] h-[44px] bg-[#2F2F2F] border border-[#9AFE81] rounded-[10px] ml-[96px] mt-[20px] pl-[20px] outline-none text-[#FFFFFF] font-exo"
    />
</template>