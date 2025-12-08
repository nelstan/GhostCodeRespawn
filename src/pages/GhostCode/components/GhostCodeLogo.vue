<template>
  <div class='fixed'>
    <div class='w-[350px] h-[57px] bg-[#171717] absolute mt-[-65px] rounded-[10px] 
                shadow-[0_0_20px_5px_#0C4507] shadow-[#0C4507]
                border border-[#0C4507]/30
                backdrop-blur-sm'>
      <p class='font-exo text-[#FFFFFF] text-[40px] font-semibold ml-[90px]'>GhostCode</p>
      <img 
        :src="logo" 
        alt="GhostCode logo"
        class='absolute mt-[-47px] ml-[20px]'
      >
      <img 
        :src="elkalogo"
        alt="elka logo"
        class='absolute mt-[-60px]'
      >
      <img 
        :src="elkalogo"
        alt="elka logo"
        class='absolute mt-[-60px] ml-[120px]'
      >
      <img 
        :src="elkalogo"
        alt="elka logo"
        class='absolute mt-[-60px] ml-[225px] rounded-tr-lg rounded-br-lg'
      >
    </div>
  </div>
</template>

<script setup>
import logo from '@/assets/лого.png'
const elkalogo = new URL('/src/assets/elkalogo.png', import.meta.url).href
</script>