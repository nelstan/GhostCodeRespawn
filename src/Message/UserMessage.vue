<script setup>
import avatarByxesh from '/src/assets/avatarByxesh.jpg'
</script>

<template>
  <div class="w-full h-[71px] bg-[#242627] flex items-center gap-3 px-4 cursor-pointer hover:bg-[#363636] transition-colors">
    <img 
      :src="avatarByxesh" 
      alt="avatarByxesh" 
      class="w-[47px] h-[47px] rounded-full"
    >
    <div class="flex flex-col">
      <div class="flex items-center gap-2">
        <p class="text-white font-exo font-[600]">Byxesh</p>
        <span class="text-[#E92929] font-exo font-[600] text-sm">#Back-End developer</span>
      </div>
      <p class="font-exo text-[13px] text-[#FFFFFF] mt-1 truncate max-w-[200px]">
        Я написал логику переписок используя ASP.NET а, у теб..
      </p>
    </div>
  </div>
</template>