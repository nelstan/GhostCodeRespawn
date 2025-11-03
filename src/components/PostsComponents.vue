<script setup>
import avatarUser from '@/assets/ава.png'
import zakrep from '@/assets/закреп.png'
import comment from '@/assets/коммент.png'
import repost from '@/assets/репосты.png'
import tritoki from '@/assets/три токи.png'
import { computed, onMounted, ref } from 'vue'
import CommentsComponents from './CommentsComponents.vue'

const currentUser = ref(null);
const isLiked = ref(false);
const showPulse = ref(false);

const roleManagement = ref({
  searchUsername: '',
  selectedRole: 'user',
  availableRoles: [
    { value: 'user', label: 'Пользователь' },
    { value: 'premium', label: 'Премиум' },
    { value: 'beta-tester', label: 'Бета-тестер' },
    { value: 'developer', label: 'Разработчик' },
    { value: 'admin', label: 'Админ' }
  ],
  searchResult: null,
  loading: false,
  message: ''
});

const toggleLiked = () => {
    isLiked.value = !isLiked.value;
    
    if (isLiked.value) {
        showPulse.value = true;
        setTimeout(() => {
            showPulse.value = false;
        }, 600);
    }
}

onMounted(() => {
  const userData = localStorage.getItem('currentUser');
  if (userData) {
    currentUser.value = JSON.parse(userData);
  }
});

const usernameWidth = computed(() => {
  if (!currentUser.value?.username) return 'auto';
  return `${Math.max(4, currentUser.value.username.length * 0.6)}rem`;
});

// Получаем отображаемое название роли
const displayRole = computed(() => {
  const userRole = currentUser.value?.role || 'user';
  const roleConfig = roleManagement.value.availableRoles.find(role => role.value === userRole);
  return roleConfig?.label || 'Пользователь';
});
</script>

<template>
    <div>
        <!-- Основной пост -->
        <div class="w-[1052px] h-[290px] rounded-[25px] border border-[#819723] ml-[380px] relative">
            <div class="flex items-start pt-[20px] pl-[20px]">
                <img 
                    :src="avatarUser" 
                    alt="avatar"
                    class="w-10 h-10"
                >
                <div class="ml-[15px]">
                    <div class="flex items-baseline">
                        <p class="text-[16px] bg-clip-text text-transparent bg-gradient-to-r from-[#FF7096] to-[#FF8FAB] font-exo font-[600]">
                            {{ currentUser?.username || 'size' }}
                        </p>
                        <p class="text-[#878787] font-bold text-[13px] ml-2">
                            · 16 июля
                        </p>
                    </div>
                    <p class="text-[#D2EE5B] font-exo text-sm">
                        {{ displayRole }}
                    </p>
                </div>
                <div class="ml-auto flex items-center pr-[20px]">
                    <router-link class="w-[140px] h-[34px] rounded-[20px] bg-[#D2EE5B] flex items-center justify-center font-exo text-sm">
                        Вы подписаны
                    </router-link>
                    <div class="flex items-center ml-4">
                        <img 
                            :src="zakrep" 
                            alt="pinned"
                            class="w-5 h-5"
                        >
                        <img 
                            :src="tritoki" 
                            alt="tritoki"
                            class="ml-2 w-[3px] h-[11px]" 
                        >
                    </div>
                </div>
            </div>

            <!-- Контент поста -->
            <div class="mt-1 px-[20px] absolute">
                <h3 class="text-white font-bold">
                    GhostCode - платформа анонимного кода
                </h3>
                <p class="text-white font-exo mt-2">
                    Революционная платформа для анонимного размещения и совместной работы над кодом.<br>
                    Поддерживает все популярные языки программирования, имеет встроенную систему ревью кода и<br>
                    возможность создания анонимных форков проектов...
                </p>
                
                <!-- Тег -->
                <button class="bg-clip-text text-transparent bg-gradient-to-r from-[#0095FF] to-[#006EBD] border border-[#0095FF] rounded-[15px] px-3 py-1 mt-3 text-sm">
                    #TypeScript
                </button>
                
                <!-- Действия -->
                <div class="flex items-center gap-8 mt-4">
                    <!-- Анимированный лайк -->
                    <button 
                        @click="toggleLiked"
                        class="relative transition-all duration-300 hover:scale-110 focus:outline-none flex items-center justify-center"
                        :class="isLiked ? 'text-red-500' : 'text-gray-400'"
                    >
                        <!-- Анимация пульсации -->
                        <div 
                            v-if="showPulse" 
                            class="absolute inset-0 bg-red-500 rounded-full animate-ping opacity-60"
                        ></div>
                        
                        <!-- SVG сердечко -->
                        <svg 
                            class="w-[25px] h-[25px] ml-[5px] transition-all duration-300"
                            :class="[
                                isLiked 
                                    ? 'fill-current scale-110' 
                                    : 'fill-none stroke-current stroke-2'
                            ]"
                            viewBox="0 0 24 24"
                        >
                            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                        </svg>
                    </button>
                    
                    <img :src="comment" alt="comment" class="cursor-pointer w-[25px] h-[25px]">
                    <img :src="repost" alt="repost" class="cursor-pointer w-[25px] h-[25px]">
                </div>
            </div>
        </div>

        <!-- Комментарии -->
        <CommentsComponents class="mt-4 ml-[618px]"/>
    </div>
</template>