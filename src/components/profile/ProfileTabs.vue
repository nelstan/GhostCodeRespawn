<template>
  <div class="absolute ml-[250px] mt-[400px] w-[1350px] bg-[#1A1A1A] rounded-lg p-6 font-exo text-white sm:block hidden">
    <div class="flex space-x-8 mb-6">
      <button
        v-for="(button, index) in buttons"
        :key="index"
        @click="$emit('set-active-button', index)"
        :class="[
          'px-6 py-2 rounded-lg transition-all duration-300 font-semibold',
          activeButton === index 
            ? 'bg-[#D2EE5B] text-gray-900'
            : 'bg-[#2A2A2A] text-white hover:bg-[#333333]'
        ]"
      >
        {{ button }}
      </button>
    </div>

    <div v-if="activeButton === 0" class="space-y-4">
      <div>
        <h2 class="text-[#D2EE5B] text-xl font-bold mb-2"># {{ userData?.name || currentUser?.username || 'Nelstan' }}</h2>
        <p class="text-gray-300"><strong class="text-white">Stack</strong>: Vue.js Tailwind TS </p>
        <p class="text-gray-300"><strong class="text-white">Grade</strong>: Junior Front-End Developer</p>
        <p class="text-gray-300"><strong class="text-white">Role</strong>: {{ userData?.role || currentUser?.role || 'user' }}</p>
      </div>
      
      <div class="border-t border-gray-600 pt-4">
        <h3 class="text-white text-lg font-bold mb-3">Кодер</h3>
        <ul class="space-y-2">
          <li class="text-gray-300"><strong class="text-white">Пишу в Visual Studio Code </strong></li>
          <li class="text-gray-300"><strong class="text-white">Разработчик уже около 3-х лет.</strong></li>
        </ul>
      </div>

      <div class="border-t border-gray-600 pt-4">
        <h3 class="text-white text-lg font-bold mb-3">Обозначение</h3>
        <p class="text-gray-300 leading-relaxed">
          Был тип программист. Слесарь, подрабатывал в красном белом.<br>
          В свободное время играл в тетрис, дженгу.<br>
          Детей нет, разведён.
        </p>
      </div>
    </div>

    <div v-if="activeButton === 1" class="text-gray-300">
      <h2 class="text-white text-xl font-bold mb-4">Koнтент</h2>
      <p>Содержимое контента будет здесь...</p>
    </div>

    <div v-if="activeButton === 2" class="text-gray-300">
      <h2 class="text-white text-xl font-bold mb-4">Cтатистика</h2>
      <p>Статистические данные будут здесь...</p>
    </div>

    <div v-if="activeButton === 3">
      <RoleManagement 
        :user-data="userData"
        :current-user="currentUser"
        :is-admin="isAdmin"
        :is-developer="isDeveloper"
      />
    </div>
  </div>

  <!-- Мобильная версия табов -->
  <div class="sm:hidden block mx-4 mt-[10px] bg-[#1A1A1A] rounded-lg p-4 font-exo text-white">
    <div class="flex overflow-x-auto space-x-4 mb-4 pb-2">
      <button
        v-for="(button, index) in buttons"
        :key="index"
        @click="$emit('set-active-button', index)"
        :class="[
          'px-4 py-2 rounded-lg transition-all duration-300 font-semibold whitespace-nowrap text-sm',
          activeButton === index 
            ? 'bg-[#D2EE5B] text-gray-900'
            : 'bg-[#2A2A2A] text-white hover:bg-[#333333]'
        ]"
      >
        {{ button }}
      </button>
    </div>

    <div v-if="activeButton === 0" class="space-y-4 text-sm">
      <div>
        <h2 class="text-[#D2EE5B] text-lg font-bold mb-2"># {{ userData?.name || currentUser?.username || 'Nelstan' }}</h2>
        <p class="text-gray-300"><strong class="text-white">Stack</strong>: Vue.js Tailwind TS </p>
        <p class="text-gray-300"><strong class="text-white">Grade</strong>: Junior Front-End Developer</p>
        <p class="text-gray-300"><strong class="text-white">Role</strong>: {{ userData?.role || currentUser?.role || 'user' }}</p>
      </div>
      
      <div class="border-t border-gray-600 pt-4">
        <h3 class="text-white font-bold mb-3">Кодер</h3>
        <ul class="space-y-2">
          <li class="text-gray-300"><strong class="text-white">Пишу в Visual Studio Code </strong></li>
          <li class="text-gray-300"><strong class="text-white">Разработчик уже около 3-х лет.</strong></li>
        </ul>
      </div>

      <div class="border-t border-gray-600 pt-4">
        <h3 class="text-white font-bold mb-3">Обозначение</h3>
        <p class="text-gray-300 leading-relaxed text-xs">
          Был тип программист. Слесарь, подрабатывал в красном белом.<br>
          В свободное время играл в тетрис, дженгу.<br>
          Детей нет, разведён.
        </p>
      </div>
    </div>

    <div v-if="activeButton === 1" class="text-gray-300 text-sm">
      <h2 class="text-white text-lg font-bold mb-4">Koнтент</h2>
      <p>Содержимое контента будет здесь...</p>
    </div>

    <div v-if="activeButton === 2" class="text-gray-300 text-sm">
      <h2 class="text-white text-lg font-bold mb-4">Cтатистика</h2>
      <p>Статистические данные будут здесь...</p>
    </div>

    <div v-if="activeButton === 3">
      <RoleManagement 
        :user-data="userData"
        :current-user="currentUser"
        :is-admin="isAdmin"
        :is-developer="isDeveloper"
      />
    </div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits, computed } from 'vue'
import RoleManagement from './RoleManagement.vue'

const props = defineProps({
  activeButton: Number,
  userData: Object,
  currentUser: Object
})

defineEmits(['set-active-button'])

const buttons = ['Информационный', 'Koнтeнт', 'Cтатистика', 'Управление ролями']

const isAdmin = computed(() => {
  const role = props.userData?.role || props.currentUser?.role
  return role === 'admin'
})

const isDeveloper = computed(() => {
  const role = props.userData?.role || props.currentUser?.role
  return role === 'developer'
})
</script>