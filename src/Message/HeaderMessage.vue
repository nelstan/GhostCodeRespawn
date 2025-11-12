<script setup>
    import avatarByxesh from '/src/assets/avatarByxesh.jpg';
import VectorL from '/src/assets/VectorL.png';
import VectorT from '/src/assets/VectorT.png'
</script>

<template>
            <div class="w-[1060px] h-[62px] bg-[#202020] absolute mt-[-780px] ml-[480px] rounded-[10px]">
            <button class="absolute ml-[950px] mt-[20px]">
                <img 
                :src="VectorL" 
                alt="VectorL" 
                class=""
                >
            </button>
            <button class="absolute ml-[1000px] mt-[22px]">
                <img 
                :src="VectorT" 
                alt="VectorT" 
                class=""
                >
            </button>
                <img 
                :src="avatarByxesh" 
                alt="avatarByxesh" 
                class="absolute w-[38px] h-[38px] ml-[45px] mt-[12px]"
                >
            <div class="ml-[100px] flex items-center gap-2 mt-[18px]">
                <p class="text-white font-exo font-[400]">Byxesh</p>
                <span class="text-[#E92929] font-exo font-[400]">#Back-End developer</span>
            </div>
        </div>
</template>