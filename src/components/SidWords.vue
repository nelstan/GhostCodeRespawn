<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div class="w-[1061px] h-[474px] bg-[#1F1F1F] p-6 rounded-lg border border-transparent" 
         style="border-image: linear-gradient(to right, #D2EE5B, #565B42) 1">
      <!-- Заголовок -->
      <div class="flex items-center justify-center text-white font-montserrat font-[600] text-[24px] mb-6">
        СИД-СЛОВА
      </div>
      
      <!-- Информационный текст -->
      <div class="text-center text-[#D2EE5BF4] mb-5">
        <p class="font-medium -mt-[10px]">Сохраните сид-фразу в надёжном месте!</p>
        <p>Она нужна для восстановления пароля, без неё доступ будет утерян навсегда!</p>
      </div>

      <!-- 4 колонки по 3 слова -->
      <div class="grid grid-cols-4 gap-10 ml-[55px]">
        <div 
          v-for="(item, index) in seedPhrases" 
          :key="index"
          class="bg-[#424242] border border-[#D2EE5B] rounded flex items-center justify-center w-[150px] h-[30px]"
          style="border-width: 1px"
        >
          <span class="text-white font-medium text-[14px] truncate px-1">
            {{ index + 1 }}. {{ item.word }}
          </span>
        </div>
      </div>
      <div>
        <button 
          @click="closeModal"
          class="inline-flex items-center justify-center h-[30px] w-[150px] bg-[#D2EE5B] border border-[#819723] text-[#1F1F1F] font-exo rounded mx-auto mt-[50px] ml-[430px] cursor-pointer hover:bg-[#c5e04f] transition-colors"
        >
          Принять
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineEmits } from 'vue';

const emit = defineEmits(['close']);

// 12 элементов для 4 колонок по 3 слова
const seedPhrases = Array(12).fill().map(() => ({
  word: 'snow'
}));

const closeModal = () => {
  emit('close');
};

</script>



