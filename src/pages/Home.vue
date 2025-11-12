<script setup>
  import Header from '@/components/Header.vue';
</script>


<template>

<Header/>

<div class="relative font-custom ">
  <p style="font-family: 'Michroma'" class="text-white text-8xl mt-[622px] ml-[64px] z-[2]  absolute">GhostCode</p>
  <p style="font-family: 'Michroma'" class="text-purple-500  text-8xl mt-[623px] ml-[66px] absolute z-[1] ">GhostCode</p>
  <div class="description mt-[750px] absolute ml-[70px] text-xl">
    <p class="text-white relative ">Пишите код анонимно, а раскрывайтесь лишь тогда, когда захотите. </p>
    <p class="force-break text-white relative ">Персонализируйте профиль, демонстрируйте лучшие работы — ваши правила, ваша анонимность. </p>
  </div>
<div class="mt-[750px] absolute">
  <router-link 
    to="/Register" 
    class="text-white border border-white ml-[1661px] relative py-2 px-4 rounded-2xl hover:bg-white hover:text-black transition"
  >
    Начать +
  </router-link>
</div>
</div>

</template>