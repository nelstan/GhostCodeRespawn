<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div class="bg-[#2A2A2A] rounded-xl p-6 w-[500px] max-w-[90vw]">
      <div class="flex justify-between items-center mb-4">
        <h3 class="font-exo text-white text-lg">Редактировать комментарий</h3>
        <button @click="$emit('close')" class="text-gray-400 hover:text-white">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      
      <textarea
        v-model="editText"
        placeholder="Редактируйте комментарий..."
        class="w-full bg-[#1A1A1A] rounded-xl p-4 font-exo text-white text-[14px] resize-none focus:outline-none focus:ring-2 focus:ring-[#D2EE5B] whitespace-pre-wrap"
        rows="4"
        :maxlength="maxChars"
      ></textarea>
      
      <div class="flex justify-between items-center mt-2">
        <span
          class="font-exo text-[13px]"
          :class="editText.length > maxChars - 50 ? 'text-red-500' : 'text-[#878787]'"
        >
          {{ editText.length }}/{{ maxChars }}
        </span>
        
        <div class="flex gap-2">
          <button
            @click="$emit('close')"
            class="bg-[#484848] text-white font-exo text-[14px] px-4 py-2 rounded-xl hover:bg-[#5a5a5a]"
          >
            Отмена
          </button>
          <button
            @click="saveEdit"
            :disabled="!editText.trim() || editText === originalText || loading"
            class="bg-[#D2EE5B] text-black font-exo font-[600] text-[14px] px-6 py-2 rounded-xl hover:bg-[#c5e04a] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {{ loading ? 'Сохранение...' : 'Сохранить' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'

const props = defineProps({
  commentText: {
    type: String,
    default: ''
  },
  commentId: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['save', 'close'])

const editText = ref('')
const originalText = ref('')
const loading = ref(false)
const maxChars = 500

onMounted(() => {
  editText.value = props.commentText
  originalText.value = props.commentText
})

const saveEdit = async () => {
  loading.value = true
  emit('save', {
    id: props.commentId,
    text: editText.value
  })
  loading.value = false
}
</script>