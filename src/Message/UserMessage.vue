<script setup>
import avatarByxesh from '/src/assets/avatarByxesh.jpg'
</script>
<template>
          <div class="w-[479px] h-[71px] bg-[#242627] mt-[-800px] flex items-center gap-3 px-4 cursor-pointer">
        <img 
          :src="avatarByxesh" 
          alt="avatarByxesh" 
          class="w-[47px] h-[47px]"
        >
        <div class="flex items-center gap-2 mt-[-32px]">
          <p class="text-white font-exo font-[600]">Byxesh</p>
          <span class="text-[#E92929] font-exo font-[600]">#Back-End developer</span>
        </div>
        <div>
            <p class="font-exo text-[13px] text-[#FFFFFF] absolute ml-[-234px]">Я написал логику переписок используя ASP.NET а, у теб..</p>
        </div>
      </div>
</template>