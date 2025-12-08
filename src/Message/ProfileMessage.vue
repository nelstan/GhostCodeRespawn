<script setup>
import avatarNaily from '/src/assets/avatarNaily.jpg'
import settingsIcon from '/src/assets/Vector.png'
</script>

<template>
  <div class="w-full h-[85px] bg-[#161616] border border-[#242627] rounded-[10px] absolute bottom-0 left-0">
    <div class="flex items-center h-full px-4">
      <img 
        :src="avatarNaily" 
        alt="avatarNaily"
        class="w-[55px] h-[55px] cursor-pointer"
      >
      <div class="ml-4 flex-1">
        <div class="flex items-center gap-2">
          <p class="text-white font-exo font-[300]">Naily</p>
          <span class="text-[#E92929] font-exo font-[300]">#Front-End developer</span>
        </div>
        <p class="text-[#CCCCCC] text-[15px] mt-1">Люблю когда идет все по маслу</p>
      </div>
      <img
        :src="settingsIcon" 
        alt="settingsIcon" 
        class="cursor-pointer w-6 h-6"
      >
    </div>
  </div>
</template>