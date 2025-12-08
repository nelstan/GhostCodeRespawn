<template>
  <div class="single-post-page">
    <div class="container mx-auto px-4 py-8">
      <button 
        @click="goBackToFeed"
        class="mb-6 text-[#9AFE81] font-exo flex items-center gap-2 hover:text-[#819723] transition-colors"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        Назад к ленте
      </button>
      
      <div v-if="loading" class="text-white font-exo text-center">
        Загрузка поста...
      </div>
      
      <div v-else-if="post">
        <PostsComponents 
          :post="post" 
          :key="post.id"
        />
      </div>
      
      <div v-else class="text-white font-exo text-center">
        Пост не найден
      </div>
    </div>
  </div>
</template>

<script setup>
import PostsComponents from '@/components/PostsComponents.vue'
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()
const post = ref(null)
const loading = ref(true)

const updatePostInStorage = (updatedPost) => {
  const allPosts = JSON.parse(localStorage.getItem('allPosts') || '[]')
  const postIndex = allPosts.findIndex(p => p.id === updatedPost.id)
  
  if (postIndex !== -1) {
    allPosts[postIndex] = {
      ...allPosts[postIndex],
      ...updatedPost,
      hashtags: updatedPost.hashtags || allPosts[postIndex].hashtags
    }
  } else {
    allPosts.unshift(updatedPost)
  }
  
  localStorage.setItem('allPosts', JSON.stringify(allPosts))
  localStorage.setItem('lastPostUpdate', new Date().toISOString())
}

const formatPostData = (postData) => {
  const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{"username":"Аноним","role":"user"}')
  
  let hashtags = ''
  if (postData.tags && Array.isArray(postData.tags)) {
    hashtags = postData.tags.map(tag => tag.startsWith('#') ? tag : `#${tag}`).join(', ')
  } else if (postData.hashtags) {
    hashtags = postData.hashtags
  }
  
  return {
    id: postData.id,
    title: postData.title || '',
    content: postData.body || postData.content || '',
    hashtags: hashtags,
    createdAt: postData.createdAt,
    author: postData.author || currentUser,
    likes: postData.likes || 0,
    commentsCount: postData.commentsCount || 0,
    authorId: postData.authorId
  }
}

const goBackToFeed = () => {
  router.push('/GhostCode')
}

onMounted(async () => {
  loading.value = true
  const postId = route.params.id
  
  if (!postId) {
    loading.value = false
    return
  }
  
  const allPosts = JSON.parse(localStorage.getItem('allPosts') || '[]')
  const foundPost = allPosts.find(p => p.id === postId)
  
  if (foundPost) {
    post.value = foundPost
    loading.value = false
    return
  }
  
  try {
    const token = localStorage.getItem('accessToken')
    if (!token) {
      router.push('/login')
      loading.value = false
      return
    }
    
    const response = await fetch(`/api/posts/getPost/${postId}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    
    if (response.ok) {
      const backendPost = await response.json()
      const formattedPost = formatPostData(backendPost)
      post.value = formattedPost
      updatePostInStorage(formattedPost)
    }
  } catch (error) {
    console.error('Ошибка:', error)
  }
  
  loading.value = false
})
</script>

<style scoped>
.single-post-page {
  min-height: 100vh;
  background: #0F0F0F;
}
</style>