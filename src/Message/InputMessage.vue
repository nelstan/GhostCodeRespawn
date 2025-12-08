<script setup>
import VectorD from '/src/assets/VectorD.png'

const emit = defineEmits(['send'])

const sendMessage = () => {
  emit('send')
}
</script>

<template>
  <div class="relative w-full max-w-[1060px] mx-auto">
    <input 
      type="text"
      placeholder="Сообщение..."
      class="w-full h-[60px] md:h-[85px] bg-[#202020] rounded-[10px] outline-none text-[#FFFFFF] font-exo text-[16px] md:text-[19px] pl-4 pr-16"
    >
    <button @click="sendMessage" class="absolute right-4 top-1/2 transform -translate-y-1/2">
      <img 
        :src="VectorD" 
        alt="VectorD"
        class="w-6 h-6 md:w-8 md:h-8 cursor-pointer"
      >
    </button>
  </div>
</template>