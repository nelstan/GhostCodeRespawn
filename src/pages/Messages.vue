<script setup>
import ProfileMessage from '@/Message/ProfileMessage.vue';
import HeaderGhostCode from './HeaderGhostCode.vue';
import UserMessage from '@/Message/UserMessage.vue';
import avatarByxesh from '/src/assets/avatarByxesh.jpg';
import VectorL from '/src/assets/VectorL.png';
import VectorT from '/src/assets/VectorT.png'
import HeaderMessage from '@/Message/HeaderMessage.vue';
import VectorD from '/src/assets/VectorD.png'
import InputMessage from '@/Message/InputMessage.vue';
</script>

<template>
  <HeaderGhostCode/>

  <div class="flex items-center justify-center min-h-screen pt-[50px]">
    <div class="w-[1538px] h-[842px] bg-[#161616] border border-[#242627] rounded-[10px]">
      <div class="w-[479px] h-[50px] bg-[#111111] border border-[#242627] rounded-[10px]">
        <p class="text-[#FFFFFF] font-exo flex items-center justify-center mt-[7px] text-[20px]">GhostCode Welcome</p>
      </div>
      
      <div class="w-[479px] h-[842px] bg-[#111111] border border-[#242627] mt-[-50px] rounded-[10px]"></div>
      
      <div class="space-y-0 mt-4">
        <UserMessage/>
        <UserMessage/>
        <UserMessage/>
      </div> 
      <ProfileMessage/>
    </div>
    <HeaderMessage/>
    <InputMessage/>
  </div>
</template>

