<script setup>
import avatarUser from '@/assets/ава.png'
import zakrep from '@/assets/закреп.png'
import comment from '@/assets/коммент.png'
import repost from '@/assets/репосты.png'
import tritoki from '@/assets/три токи.png'
import { computed, onMounted, ref } from 'vue'

const props = defineProps({
  post: {
    type: Object,
    default: () => ({}),
  },
  isUserPost: {
    type: Boolean,
    default: false,
  },
})

const currentUser = ref(null)
const isLiked = ref(false)
const showPulse = ref(false)
const showComments = ref(false)
const newComment = ref('')
const comments = ref([])
const isExpanded = ref(false)

const toggleLiked = () => {
  isLiked.value = !isLiked.value
  if (isLiked.value) {
    showPulse.value = true
    setTimeout(() => {
      showPulse.value = false
    }, 600)
  }
}

const toggleComments = () => {
  showComments.value = !showComments.value
}

const toggleExpand = () => {
  isExpanded.value = !isExpanded.value
}

const addComment = () => {
  if (!newComment.value.trim()) return

  const commentData = {
    id: Date.now(),
    text: newComment.value,
    author: {
      username: currentUser.value?.username || 'Аноним',
      avatar: avatarUser,
    },
    createdAt: new Date().toISOString(),
    isAdmin: currentUser.value?.role === 'admin',
  }

  comments.value.push(commentData)
  newComment.value = ''
  saveCommentsToStorage()
}

const saveCommentsToStorage = () => {
  if (props.post.id) {
    const postComments = JSON.parse(localStorage.getItem('postComments') || '{}')
    postComments[props.post.id] = comments.value
    localStorage.setItem('postComments', JSON.stringify(postComments))
  }
}

const loadCommentsFromStorage = () => {
  if (props.post.id) {
    const postComments = JSON.parse(localStorage.getItem('postComments') || '{}')
    comments.value = postComments[props.post.id] || []
  }
}

onMounted(() => {
  const userData = localStorage.getItem('currentUser')
  if (userData) {
    currentUser.value = JSON.parse(userData)
  }
  loadCommentsFromStorage()
})

const displayRole = computed(() => {
  const userRole = props.post.author?.role || currentUser.value?.role || 'user'
  const roles = [
    { value: 'user', label: 'Пользователь' },
    { value: 'premium', label: 'Премиум' },
    { value: 'admin', label: 'Админ' },
  ]
  const roleConfig = roles.find(role => role.value === userRole)
  return roleConfig?.label || 'Пользователь'
})

const formatDate = dateString => {
  const date = new Date(dateString)
  const now = new Date()
  const diffTime = Math.abs(now - date)
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

  if (diffDays === 1) return 'сегодня'
  if (diffDays === 2) return 'вчера'
  if (diffDays <= 7) return `${diffDays - 1} день назад`

  return date.toLocaleDateString('ru-RU')
}

const authorName = computed(() => {
  return props.post.author?.username || currentUser.value?.username
})

const commentsCount = computed(() => comments.value.length)

const postContent = computed(() => {
  return props.post.content === null || props.post.content === undefined
    ? 'Революционная платформа для анонимного размещения и совместной работы над кодом. Поддерживает все популярные языки программирования, имеет встроенную систему ревью кода и возможность создания анонимных форков проектов...'
    : props.post.content
})

const displayContent = computed(() => {
  const content = postContent.value
  const shouldTruncate = content.length > 200 && !isExpanded.value
  return shouldTruncate ? content.slice(0, 200) + '...' : content
})

const showReadMoreButton = computed(() => {
  return postContent.value.length > 200
})

const postHeight = computed(() => {
  return isExpanded.value ? 'auto' : 'min-h-[290px]'
})
</script>

<template>
  <div :class="['w-full', { 'mt-8': isUserPost }]">
    <!-- Основной контейнер поста -->
    <div 
      :class="['w-[1052px] rounded-[25px] border border-[#819723] p-5 bg-transparent relative ml-[400px]', postHeight]"
    >
      <!-- Шапка поста -->
      <div class="flex items-start justify-between mb-4">
        <div class="flex items-start gap-4">
          <img 
            :src="avatarUser" 
            alt="Аватар пользователя" 
            class="w-10 h-10 flex-shrink-0"
          />
          <div class="flex flex-col">
            <div class="flex items-baseline gap-2">
              <p class="text-base font-exo font-semibold bg-clip-text text-transparent bg-gradient-to-r from-[#FF7096] to-[#FF8FAB]">
                {{ authorName }}
              </p>
              <p class="text-sm text-[#878787] font-bold">
                · {{ formatDate(post.createdAt || new Date()) }}
              </p>
            </div>
            <p class="text-sm text-[#D2EE5B] font-exo mt-1">
              {{ displayRole }}
            </p>
          </div>
        </div>

        <div class="flex items-center gap-4">
          <button class="w-36 h-9 rounded-full bg-[#D2EE5B] flex items-center justify-center font-exo text-sm hover:bg-[#c5e04a] transition-colors">
            Вы подписаны
          </button>
          <div class="flex items-center gap-2">
            <img :src="zakrep" alt="Закреплено" class="w-5 h-5" />
            <img :src="tritoki" alt="Меню" class="w-[3px] h-[11px]" />
          </div>
        </div>
      </div>

      <!-- Контент поста -->
      <div class="px-2">
        <h3 class="text-white font-bold text-xl mb-3">
          {{ post.title || 'GhostCode - платформа анонимного кода' }}
        </h3>
        <p class="text-white font-exo text-base whitespace-pre-line leading-relaxed mb-4">
          {{ displayContent }}
        </p>
        
        <!-- Кнопка "Читать все" -->
        <button 
          v-if="showReadMoreButton"
          @click="toggleExpand"
          class="text-[#0095FF] font-exo text-sm hover:text-[#006EBD] transition-colors mb-4"
        >
          {{ isExpanded ? 'Свернуть' : 'Читать все' }}
        </button>

        <!-- Хештег - теперь вне контента -->
        <button 
          v-if="post.hashtags"
          class="bg-clip-text text-transparent bg-gradient-to-r from-[#0095FF] to-[#006EBD] border border-[#0095FF] rounded-[15px] px-5 py-1 text-sm mt-2 mb-4"
        >
          {{ post.hashtags }}
        </button>

        <!-- Действия с постом -->
        <div class="flex items-center gap-8 mt-4">
          <button 
            @click="toggleLiked"
            class="relative transition-all duration-300 hover:scale-110"
            :class="{ 'text-red-500': isLiked, 'text-gray-400': !isLiked }"
          >
            <div 
              v-if="showPulse"
              class="absolute inset-0 bg-red-500 rounded-full animate-ping opacity-60"
            ></div>
            <svg
              class="w-7 h-7 transition-all duration-300"
              :class="[
                isLiked ? 'fill-current scale-110' : 'fill-none stroke-current stroke-2'
              ]"
              viewBox="0 0 24 24"
            >
              <path
                d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
              />
            </svg>
          </button>

          <button 
            @click="toggleComments"
            class="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
          >
            <img :src="comment" alt="Комментарии" class="w-7 h-7" />
            <span class="font-exo text-base">{{ commentsCount }}</span>
          </button>

          <button class="text-gray-400 hover:text-white transition-colors">
            <img :src="repost" alt="Репост" class="w-7 h-7" />
          </button>
        </div>
      </div>
    </div>

    <!-- Секция комментариев -->
    <div 
      v-if="post.id && showComments"
      class="w-[1052px] bg-[#191919] rounded-[20px] p-6 mt-4 ml-[400px]" 
    >
      <div class="mb-4">
        <h3 class="font-exo text-white font-semibold text-lg">
          Комментарии ({{ commentsCount }})
        </h3>
      </div>

      <!-- Список комментариев -->
      <div v-if="comments.length > 0" class="space-y-4 mb-6">
        <div 
          v-for="comment in comments"
          :key="comment.id"
          class="flex items-start space-x-4"
        >
          <img
            :src="comment.author.avatar"
            alt="Аватар"
            class="w-10 h-10 rounded-full flex-shrink-0"
          />
          <div class="flex-1 min-w-0">
            <div class="flex items-baseline gap-2">
              <p class="font-exo text-white font-semibold text-base truncate">
                {{ comment.author.username }}
              </p>
              <p class="font-exo text-[#878787] text-sm whitespace-nowrap">
                · {{ formatDate(comment.createdAt) }}
              </p>
            </div>
            <p class="font-exo text-white text-base mt-1 whitespace-pre-wrap break-words">
              {{ comment.text }}
            </p>
          </div>
        </div>
      </div>

      <!-- Форма нового комментария -->
      <div class="mt-4">
        <textarea
          v-model="newComment"
          placeholder="Напишите комментарий..."
          class="w-full bg-[#2A2A2A] rounded-xl p-4 font-exo text-white text-base resize-none focus:outline-none focus:ring-2 focus:ring-[#D2EE5B]"
          rows="3"
          maxlength="500"
        ></textarea>

        <div class="flex justify-between items-center mt-3">
          <span class="font-exo text-sm text-[#878787]">
            {{ newComment.length }}/500
          </span>

          <button
            @click="addComment"
            :disabled="!newComment.trim()"
            class="bg-[#D2EE5B] text-black font-exo font-semibold text-base px-6 py-2 rounded-xl hover:bg-[#c5e04a] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Отправить
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.font-exo {
  font-family: 'Exo', sans-serif;
}

@keyframes ping {
  0% {
    transform: scale(0.8);
    opacity: 1;
  }
  100% {
    transform: scale(1.4);
    opacity: 0;
  }
}
</style>