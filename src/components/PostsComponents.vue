<script setup>
import avatarUser from '@/assets/ава.png'
import zakrep from '@/assets/закреп.png'
import comment from '@/assets/коммент.png'
import repost from '@/assets/репосты.png'
import tritoki from '@/assets/три токи.png'
import CommentsComponents from '@/components/CommentsComponents.vue'
import { computed, ref } from 'vue'

const props = defineProps({
  post: {
    type: Object,
    required: true,
  },
})

const showMenu = ref(false)
const showReportModal = ref(false)
const reportReason = ref('')
const showCopiedNotification = ref(false)
const showComments = ref(false)
const isExpanded = ref(false)
const isLiked = ref(false)
const showPulse = ref(false)

const toggleMenu = () => {
  showMenu.value = !showMenu.value
}

const copyPostLink = () => {
  const postLink = `${window.location.origin}/post/${props.post.id}`
  navigator.clipboard.writeText(postLink)
    .then(() => {
      showCopiedNotification.value = true
      setTimeout(() => {
        showCopiedNotification.value = false
      }, 2000)
    })
  showMenu.value = false
}

const openReportModal = () => {
  showReportModal.value = true
  showMenu.value = false
}

const submitReport = () => {
  showReportModal.value = false
  reportReason.value = ''
  alert('Жалоба отправлена')
}

const closeReportModal = () => {
  showReportModal.value = false
  reportReason.value = ''
}

const toggleComments = () => {
  showComments.value = !showComments.value
}

const toggleExpand = () => {
  isExpanded.value = !isExpanded.value
}

const toggleLiked = async () => {
  if (isLiked.value) return
  
  const token = localStorage.getItem('accessToken')
  if (!token) {
    alert('Требуется авторизация')
    return
  }
  
  try {
    const response = await fetch('/api/posts/likePost', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        postId: props.post.id
      })
    })
    
    if (response.ok) {
      isLiked.value = true
      showPulse.value = true
      setTimeout(() => {
        showPulse.value = false
      }, 600)
    }
  } catch (error) {
    console.error('Ошибка при лайке:', error)
  }
}

const handleCommentAdded = () => {
  if (props.post.commentsCount !== undefined) {
    props.post.commentsCount += 1
  }
}

const formatDate = dateString => {
  if (!dateString) return 'недавно'
  const date = new Date(dateString)
  if (isNaN(date.getTime())) return 'недавно'
  const now = new Date()
  const diffTime = Math.abs(now - date)
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  if (diffDays === 1) return 'сегодня'
  if (diffDays === 2) return 'вчера'
  if (diffDays <= 7) return `${diffDays - 1} день назад`
  return date.toLocaleDateString('ru-RU')
}

const displayContent = () => {
  const content = props.post.content || ''
  const shouldTruncate = content.length > 200 && !isExpanded.value
  return shouldTruncate ? content.slice(0, 200) + '...' : content
}

const showReadMoreButton = () => {
  return (props.post.content || '').length > 200
}

const hashtagsArray = computed(() => {
  if (props.post.hashtags) {
    return props.post.hashtags
      .split(',')
      .map(tag => tag.trim())
      .filter(tag => tag.length > 0)
      .map(tag => tag.startsWith('#') ? tag : `#${tag}`)
  }
  
  if (props.post.tags && Array.isArray(props.post.tags)) {
    return props.post.tags.map(tag => tag.startsWith('#') ? tag : `#${tag}`)
  }
  
  return []
})

const hasHashtags = computed(() => {
  return hashtagsArray.value.length > 0
})
</script>

<template>
  <div class="w-full relative">
    <div 
      class="w-[1052px] rounded-[25px] border border-[#819723] p-5 bg-transparent relative ml-[400px] min-h-[290px]"
    >
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
                {{ post.author?.username || 'Аноним' }}
              </p>
              <p class="text-sm text-[#878787] font-bold">
                · {{ formatDate(post.createdAt) }}
              </p>
            </div>
            <p class="text-sm text-[#D2EE5B] font-exo mt-1">
              {{ post.author?.role === 'admin' ? 'Админ' : post.author?.role === 'premium' ? 'Премиум' : 'Пользователь' }}
            </p>
          </div>
        </div>

        <div class="flex items-center gap-4">
          <button class="w-36 h-9 rounded-full bg-[#D2EE5B] flex items-center justify-center font-exo text-sm hover:bg-[#c5e04a] transition-colors">
            Вы подписаны
          </button>
          <div class="flex items-center gap-2 relative">
            <img :src="zakrep" alt="Закреплено" class="w-5 h-5" />
            <button @click="toggleMenu" class="menu-button">
              <img :src="tritoki" alt="Меню" class="w-[3px] h-[11px]" />
            </button>
            
            <div v-if="showMenu" class="post-menu absolute top-full right-0 mt-2 w-48 bg-[#2A2A2A] rounded-lg shadow-lg z-50 border border-[#819723]">
              <button 
                @click="copyPostLink"
                class="w-full text-left px-4 py-3 text-white font-exo hover:bg-[#3A3A3A] transition-colors rounded-t-lg flex items-center gap-3"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                Скопировать ссылку
              </button>
              <button 
                @click="openReportModal"
                class="w-full text-left px-4 py-3 text-white font-exo hover:bg-[#3A3A3A] transition-colors rounded-b-lg flex items-center gap-3"
              >
                <svg class="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.67 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
                Пожаловаться
              </button>
            </div>
          </div>
        </div>
      </div>

      <div class="px-2">
        <h3 class="text-white font-bold text-xl mb-3">
          {{ post.title || 'Нет заголовка' }}
        </h3>
        <div class="min-h-[60px]">
          <p class="text-white font-exo text-base whitespace-pre-line leading-relaxed mb-4 break-words overflow-hidden">
            {{ displayContent() }}
          </p>
        </div>
        
        <button 
          v-if="showReadMoreButton()"
          @click="toggleExpand"
          class="text-[#0095FF] font-exo text-sm hover:text-[#006EBD] transition-colors mb-4"
        >
          {{ isExpanded ? 'Свернуть' : 'Читать все' }}
        </button>

        <div v-if="hasHashtags" class="mt-2 mb-4 flex flex-wrap gap-2">
          <span 
            v-for="(hashtag, index) in hashtagsArray" 
            :key="index"
            class="text-[#0095FF] border border-[#0095FF] rounded-[15px] px-4 py-1 text-sm font-exo"
          >
            {{ hashtag }}
          </span>
        </div>

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
            <span class="font-exo text-base">{{ post.commentsCount || 0 }}</span>
          </button>

          <button class="text-gray-400 hover:text-white transition-colors">
            <img :src="repost" alt="Репост" class="w-7 h-7" />
          </button>
        </div>
      </div>
    </div>

    <div v-if="showComments" class="mt-4">
      <CommentsComponents :post-id="post.id" @comment-added="handleCommentAdded" />
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