<template>
  <div class="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
    <div class="bg-[#1E1E1E] border border-[#D2EE5B] rounded-[20px] p-8 max-w-md w-full mx-4 relative">
      <button
        @click="$emit('close')"
        class="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
      >
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
        </svg>
      </button>

      <div class="text-center mb-6">
        <h2 class="text-2xl font-bold text-white font-exo mb-2">Ваш Recovery Code</h2>
        <p class="text-gray-400 text-sm">Сохраните этот код в надежном месте</p>
      </div>

      <div class="bg-[#2A2A2A] border border-[#3A3A3A] rounded-[15px] p-4 mb-6">
        <div class="flex items-center justify-between">
          <code class="text-[#D2EE5B] font-mono text-lg font-bold tracking-wider break-all">
            {{ recoveryCode }}
          </code>
          <button
            @click="copyToClipboard"
            class="ml-3 p-2 bg-[#D2EE5B] bg-opacity-20 rounded-lg hover:bg-opacity-30 transition-all"
            title="Скопировать"
          >
            <svg class="w-5 h-5 text-[#D2EE5B]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
            </svg>
          </button>
        </div>
      </div>

      <div class="bg-yellow-500 bg-opacity-10 border border-yellow-500 border-opacity-30 rounded-[10px] p-3 mb-6">
        <p class="text-yellow-400 text-xs text-center">
          ⚠️ Этот код можно увидеть только один раз. Не забудьте его сохранить!
        </p>
      </div>

      <button
        @click="$emit('close')"
        class="w-full bg-[#D2EE5B] text-black font-exo font-bold py-3 rounded-[15px] hover:bg-[#c5e34a] transition-colors"
      >
        Понятно
      </button>
    </div>
  </div>
</template>

<script setup>
import { defineEmits, defineProps } from 'vue'

const props = defineProps({
  recoveryCode: {
    type: String,
    required: true
  }
})

const emit = defineEmits(['close'])

const copyToClipboard = () => {
  navigator.clipboard
    .writeText(props.recoveryCode)
    .then(() => {
      alert('Код скопирован в буфер обмена!')
    })
    .catch(err => {
      console.error('Ошибка копирования: ', err)
    })
}
</script>