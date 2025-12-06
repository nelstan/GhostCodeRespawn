<script setup>
import avatarByxesh from '/src/assets/avatarByxesh.jpg'
import VectorL from '/src/assets/VectorL.png'
import VectorT from '/src/assets/VectorT.png'
</script>

<template>
  <div class="w-full h-[62px] bg-[#202020] rounded-[10px] mx-auto max-w-[1060px]">
    <button class="absolute right-24 top-4">
      <img 
        :src="VectorL" 
        alt="VectorL" 
        class="w-6 h-6"
      >
    </button>
    <button class="absolute right-4 top-4">
      <img 
        :src="VectorT" 
        alt="VectorT" 
        class="w-6 h-6"
      >
    </button>
    <img 
      :src="avatarByxesh" 
      alt="avatarByxesh" 
      class="absolute w-[38px] h-[38px] left-4 top-3"
    >
    <div class="ml-[100px] flex items-center gap-2 py-3">
      <p class="text-white font-exo font-[400]">Byxesh</p>
      <span class="text-[#E92929] font-exo font-[400]">#Back-End developer</span>
    </div>
  </div>
</template>