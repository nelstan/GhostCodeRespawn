<script setup>
    import avatarUser from '@/assets/avatarUser.jpg'
    import lineUser from '@/assets/lineUser.png'
</script>

<template>
    <div>
        <img
        :src="avatarUser"
        alt=""
        class="ml-[20px] absolute w-[35px] h-[35px]"
        >
        <p class="text-white font-exo font-[600] ml-[65px] mt-[19px] pt-[3px] relative">
        Ferlin
        </p>
        <p class="ml-[227px] absolute text-[#D5D5D5] text-[13px] font-exo -mt-[21px]">
        7 дней назад
        </p>
        <p class="font-exo font-[400] text-white text-[14px] ml-[64px] mt-[16px] relative">
        Zapret 3.5.2 pre-realease
        </p>
        <img 
        :src="lineUser" 
        alt="line"
        class="ml-[20px] mt-[16px]"
        >
  </div>
</template>

