<template>
  <RouterLink to="/Profile" class="flex items-center space-x-2">
    <img
      :src="getUserAvatar()"
      alt="avatar"
      class="w-[30px] h-[30px] cursor-pointer rounded-full"
    />
    <div v-if="userRole" class="flex flex-col items-start">
      <span class="text-white text-sm font-exo font-[600]">
        {{ globalState.currentUser?.username || 'Пользователь' }}
      </span>
      <span
        :class="[
          'text-xs font-exo font-[500]',
          getRoleColor(userRole),
        ]"
      >
        {{ getRoleDisplayName(userRole) }}
      </span>
    </div>
  </RouterLink>
</template>

<script setup>
import avatar from '@/assets/ава.png'
import { useGlobalStore } from '@/composables/useGlobalStore'
import { onMounted, onUnmounted, ref } from 'vue'
import { RouterLink } from 'vue-router'

const { globalState, initializeFromStorage } = useGlobalStore()
const userRole = ref('')

const getUserData = () => {
  if (globalState.currentUser) {
    userRole.value = globalState.currentUser.role || 'Пользователь'
  }
}

const getRoleColor = (role) => {
  const colors = {
    admin: 'text-red-400',
    moderator: 'text-blue-400',
    vip: 'text-purple-400',
    premium: 'text-yellow-400',
    user: 'text-green-400',
  }
  return colors[role?.toLowerCase()] || 'text-gray-400'
}

const getRoleDisplayName = (role) => {
  const names = {
    admin: 'Администратор',
    moderator: 'Модератор',
    vip: 'VIP',
    premium: 'Премиум',
    user: 'Пользователь',
  }
  return names[role?.toLowerCase()] || role || 'Пользователь'
}

const getUserAvatar = () => {
  if (globalState.currentUser?.avatarLink) {
    return `/api/content/link/avatars/${globalState.currentUser.avatarLink}`
  }
  return avatar
}

onMounted(() => {
  initializeFromStorage()
  getUserData()
  window.addEventListener('avatarUpdated', getUserData)
})

onUnmounted(() => {
  window.removeEventListener('avatarUpdated', getUserData)
})
</script>