<script setup>
import avatarNaily from '/src/assets/avatarNaily.jpg'
import settingsIcon from '/src/assets/Vector.png'
</script>

<template>
        <div class="w-[479px] h-[85px] bg-[#161616] border border-[#242627] mt-[485px] rounded-[10px]">
            <div>
                <img 
                :src="avatarNaily" 
                alt="avatarNaily"
                class="w-[55px] h-[55px] ml-[26px] mt-[12px] cursor-pointer"
                >
            </div>
            <div>
                <div class="flex items-center gap-2 mt-[-55px] ml-[90px]">
                <p class="text-white font-exo font-[300]">Naily</p>
                <span class="text-[#E92929] font-exo font-[300]">#Front-End developer</span>
                </div>
            </div>
            <div>
                <p class="text-[#CCCCCC] text-[15px] mt-[5px] ml-[90px]">Люблю когда идет все по маслу</p>
            </div>
            <div>
                <img
                :src="settingsIcon" 
                alt="settingsIcon" 
                class="absolute mt-[-35px] ml-[420px] cursor-pointer"
                >
            </div>
        </div>
</template>