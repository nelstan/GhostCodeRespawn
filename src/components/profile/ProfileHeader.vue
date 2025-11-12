<template>
  <header class="sm:block hidden">
    <div class="w-[1905px] h-[47px] border border-[#242627] rounded-b-lg">
      <div class="relative">
        <router-link to='/GhostCode'>
          <img :src="logo" alt="logo" class="ml-[250px] absolute mt-[7px] w-[35px] h-[35px]"/>
        </router-link>
      </div>
      <div>
        <input class="w-[250px] text-center ml-[315px] mt-[9px] bg-[#202020] font-exo rounded-[25px] outline-none" type="text" placeholder="Что ищите в царстве теней?"/>
      </div>
      <div>
        <button class="absolute">
          <img :src="messageItem" alt="messageItem" class="w-[25px] h-[25px] ml-[1541px] mt-[-22px]"/>
        </button>
        <router-link to="/enigma">
          <button class="absolute text-[#FFFFFF] mt-[-25px] w-[120px] h-[30px] bg-[#015101] border-[#017a01] border-[1px] rounded-[5px] ml-[1400px]">
            Купить Enigma
          </button>
        </router-link>
      </div>
      <div>
        <button class="absolute">
          <img :src="notificationItem" alt="notificationItem" class="w-[40px] h-[40px] ml-[1571px] mt-[-28px]"/>
        </button>
      </div>
      <button>
        <img :src="currentAvatarUrl" alt="userAvatar" class="absolute w-[29px] h-[29px] ml-[1630px] mt-[-42px]"/>
      </button>
    </div>
  </header>

  
  <header class="sm:hidden block bg-[#0F0F0F] border-b border-[#242627]">
    <div class="flex items-center justify-between p-4">
      <router-link to='/GhostCode'>
        <img :src="logo" alt="logo" class="w-[30px] h-[30px]"/>
      </router-link>
      
      <div class="flex items-center space-x-3">
        <router-link to="/enigma">
          <button class="text-[#FFFFFF] px-3 py-1 bg-[#015101] border-[#017a01] border-[1px] rounded-[5px] text-xs">
            Enigma
          </button>
        </router-link>
        <button>
          <img :src="currentAvatarUrl" alt="userAvatar" class="w-[25px] h-[25px] rounded-full"/>
        </button>
      </div>
    </div>
  </header>
</template>

<script setup>
import logo from '/src/assets/лого.png'
import messageItem from '/src/assets/смс.png'
import notificationItem from '/src/assets/1.png'
import defaultAvatar from '/src/assets/авапрофиль.png'
import { ref, computed, onMounted, watch } from 'vue'

const avatarLink = ref('')

const loadAvatarFromStorage = () => {
  const savedAvatar = localStorage.getItem('userAvatar')
  if (savedAvatar) {
    avatarLink.value = savedAvatar
  }
}

const currentAvatarUrl = computed(() => {
  if (avatarLink.value) {
    return `/api/content/link/avatars/${avatarLink.value}?t=${Date.now()}`
  }
  return defaultAvatar
})

watch(() => localStorage.getItem('userAvatar'), (newAvatar) => {
  avatarLink.value = newAvatar || ''
})

onMounted(() => {
  loadAvatarFromStorage()
})
</script>