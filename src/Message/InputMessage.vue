<script setup>

import VectorD from '/src/assets/VectorD.png'
</script>


<template>
            <input 
        type="text"
        placeholder="Сообщение..."
        class="custom-input w-[1060px] h-[85px] bg-[#202020] absolute mt-[755px] ml-[480px] rounded-[10px] outline-none text-[#FFFFFF] font-exo text-[19px]"
        >
        <img 
        :src="VectorD" 
        alt="VectorD"
        class="absolute mt-[755px] ml-[-500px] cursor pointer"
        >
</template>