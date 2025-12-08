<template>
  <div class="flex w-full h-[47px] border-b-2 border-[#242627] items-center fixed bg-[#111111] z-10">
    <img :src="logo" alt="logo" class="h-full ml-[250px]">
    
    <div class="flex items-center ml-auto mr-[320px]">
      <div class="relative">
        <input
          type="text"
          placeholder="Что ищете в царстве теней?"
          class="ml-[-550px] font-exo font-[400] text-[14px] w-[262px] h-[29px] bg-[#202020] pl-[35px] rounded-[25px] border border-[#2C2C2C] cursor-pointer outline-none text-[#B6B5B5]"
        >
        <img 
          :src="lupa" 
          alt="search icon" 
          class="absolute ml-[-540px]"
        > 
      </div>
      
      <div class="flex items-center ml-[25px] space-x-[15px]">
        <RouterLink to="/messages">
          <img :src="sms" alt="sms" class="w-[25px] h-[25px] cursor-pointer">
        </RouterLink>
        
        <div class="relative">
          <img :src="notifaction" alt="notifaction" class="w-[40px] h-[40px] cursor-pointer">
          <span class="absolute -top-0.5 -right-2 bg-gradient-to-r from-[#FF0000] to-[#990000] text-white font-bold px-1 py-0.5 rounded-full text-[10px] min-w-[20px] text-center">
            99+
          </span>
        </div>
        
        <RouterLink to="/profile" class="flex items-center space-x-2">
          <img :src="avatar" alt="avatar" class="w-[30px] h-[30px] cursor-pointer rounded-full">
          <div v-if="userRole" class="flex flex-col items-start">
            <span class="text-white text-sm font-exo font-[600]">
              {{ currentUser?.username || 'Пользователь' }}
            </span>
            <span :class="['text-xs font-exo font-[500]', getRoleColor(userRole)]">
              {{ getRoleDisplayName(userRole) }}
            </span>
          </div>
        </RouterLink>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import logo from '@/assets/лого.png'
import lupa from '@/assets/лупа.png'
import sms from '@/assets/смс.png'
import notifaction from '@/assets/1.png'
import avatar from '@/assets/ава.png'

const currentUser = ref(null)
const userRole = ref('')

const getUserData = () => {
  const userData = localStorage.getItem('currentUser')
  if (userData) {
    currentUser.value = JSON.parse(userData)
    userRole.value = currentUser.value.role || 'Пользователь'
  }
}

const getRoleColor = (role) => {
  const colors = {
    'admin': 'text-red-400',
    'moderator': 'text-blue-400',
    'vip': 'text-purple-400',
    'premium': 'text-yellow-400',
    'user': 'text-green-400'
  }
  return colors[role?.toLowerCase()] || 'text-gray-400'
}

const getRoleDisplayName = (role) => {
  const names = {
    'admin': 'Администратор',
    'moderator': 'Модератор',
    'vip': 'VIP',
    'premium': 'Премиум',
    'user': 'Пользователь'
  }
  return names[role?.toLowerCase()] || role || 'Пользователь'
}

onMounted(() => {
  getUserData()
})
</script>