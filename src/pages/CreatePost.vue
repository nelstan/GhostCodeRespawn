<template>
  <div class="create-post-container">
    <div class="w-[1052px] rounded-[25px] border border-[#819723] bg-[#191919] p-6 ml-[400px] mt-[10px] ">
      <div class="text-white font-exo text-xl mb-6 ml-[380px]">Создать новый пост</div>
      
      <PostName @title-update="updateTitle" :initial-title="savedTitle" />
      <PostInside @content-update="updateContent" :initial-content="savedContent" />
      <PostHashtags @hashtags-update="updateHashtags" :initial-hashtags="savedHashtags" />
      
      <div class="flex gap-4 ml-[310px] mt-[50px]">
        <button
          @click="clearDraftAndForm"
          :class="[
            'w-[200px] h-[59px] rounded-[10px] text-[#FFFFFF] font-exo text-[16px] font-[300] border transition-colors flex items-center justify-center gap-2',
            hasDraft 
              ? 'bg-[#484848] border-[#FF6B6B] hover:bg-[#5a5a5a] hover:border-[#FF8585]' 
              : 'bg-[#3a3a3a] border-[#676666] cursor-not-allowed opacity-50'
          ]"
          :disabled="!hasDraft"
        >
          <svg v-if="hasDraft" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
          {{ hasDraft ? 'Очистить черновик' : 'Нет черновика' }}
        </button>
        
        <PostPublic 
          :isLoading="isLoading" 
          :disabled="!isFormValid"
          @post-submit="handleSubmit"
        />
      </div>
      
      <div v-if="generatedLink" class="mt-6 ml-[100px]">
        <div class="flex items-center gap-4">
          <div class="flex-1 bg-[#2F2F2F] border border-[#9AFE81] rounded-[10px] p-3">
            <p class="text-white font-exo text-sm mb-1">Ссылка на пост:</p>
            <p class="text-[#9AFE81] font-exo text-sm truncate">{{ generatedLink }}</p>
          </div>
          <button
            @click="copyLink"
            :class="[
              'w-40 h-12 rounded-[10px] font-exo text-[16px] font-[300] border transition-colors flex items-center justify-center gap-2',
              linkCopied 
                ? 'bg-green-500 border-green-500 text-white' 
                : 'bg-[#484848] border-[#9AFE81] hover:bg-[#5a5a5a] text-white'
            ]"
          >
            <svg v-if="linkCopied" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
            {{ linkCopied ? 'Скопировано!' : 'Скопировать ссылку' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import PostHashtags from '@/components/Posts/PostHashtags.vue'
import PostInside from '@/components/Posts/PostInside.vue'
import PostName from '@/components/Posts/PostName.vue'
import PostPublic from '@/components/Posts/PostPublic.vue'
import { computed, onMounted, ref, watch } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const title = ref('')
const content = ref('')
const hashtags = ref('')
const isLoading = ref(false)
const generatedLink = ref('')
const linkCopied = ref(false)
const createdPostId = ref(null)
const savedTitle = ref('')
const savedContent = ref('')
const savedHashtags = ref('')

const emit = defineEmits(['post-created'])

onMounted(() => {
  const savedData = JSON.parse(sessionStorage.getItem('draftPost') || '{}')
  if (savedData) {
    savedTitle.value = savedData.title || ''
    savedContent.value = savedData.content || ''
    savedHashtags.value = savedData.hashtags || ''
    title.value = savedTitle.value
    content.value = savedContent.value
    hashtags.value = savedHashtags.value
    isFormValid.value = title.value.trim().length > 0 && content.value.trim().length > 0
  }
})

const updateTitle = (newTitle) => {
    title.value = newTitle
    saveDraft()
}

const updateContent = (newContent) => {
    content.value = newContent
    saveDraft()
}

const updateHashtags = (newHashtags) => {
    hashtags.value = newHashtags
    saveDraft()
}

const saveDraft = () => {
    const draftData = {
        title: title.value,
        content: content.value,
        hashtags: hashtags.value,
        savedAt: new Date().toISOString()
    }
    sessionStorage.setItem('draftPost', JSON.stringify(draftData))
}

const hasDraft = computed(() => {
  return !!(title.value.trim() || content.value.trim() || hashtags.value.trim())
})

const isFormValid = ref(false)

watch([title, content], () => {
    isFormValid.value = title.value.trim().length > 0 && content.value.trim().length > 0
    if (isFormValid.value || title.value || content.value || hashtags.value) {
        saveDraft()
    }
})

const copyLink = () => {
  if (generatedLink.value) {
    navigator.clipboard.writeText(generatedLink.value)
      .then(() => {
        linkCopied.value = true
        setTimeout(() => {
          linkCopied.value = false
        }, 3000)
      })
  }
}

const handleSubmit = async () => {
    if (isFormValid.value && !isLoading.value) {
        isLoading.value = true
        
        try {
            const token = localStorage.getItem('accessToken')
            if (!token) {
                router.push('/login')
                return
            }
            
            const currentUser = JSON.parse(localStorage.getItem('currentUser'))
            if (!currentUser) {
                return
            }

            const tagsArray = hashtags.value 
                ? hashtags.value.split(',')
                    .map(tag => tag.trim())
                    .filter(tag => tag.length > 0)
                    .map(tag => tag.startsWith('#') ? tag.substring(1) : tag)
                : []
            
            const postData = {
                title: title.value,
                body: content.value,
                tags: tagsArray
            }
            
            const response = await fetch('/api/posts/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(postData)
            })
            
            if (response.status === 401) {
                localStorage.removeItem('accessToken')
                localStorage.removeItem('refreshToken')
                localStorage.removeItem('currentUser')
                router.push('/login')
                return
            }
            
            if (!response.ok) {
                const errorText = await response.text()
                throw new Error(`Ошибка: ${response.status} - ${errorText}`)
            }
            
            const createdPost = await response.json()
            
            createdPostId.value = createdPost.id
            generatedLink.value = `${window.location.origin}/post/${createdPost.id}`
            
            const finalPostData = {
                id: createdPost.id,
                title: title.value,
                content: content.value,
                hashtags: hashtags.value || '',
                createdAt: createdPost.createdAt || new Date().toISOString(),
                author: {
                    username: currentUser.username,
                    role: currentUser.role || 'user',
                    id: currentUser.id
                },
                likes: createdPost.likes || 0,
                commentsCount: createdPost.commentsCount || 0,
                authorId: createdPost.authorId || currentUser.id
            }
            
            const allPosts = JSON.parse(localStorage.getItem('allPosts') || '[]')
            const existingIndex = allPosts.findIndex(p => p.id === finalPostData.id)
            if (existingIndex !== -1) {
                allPosts[existingIndex] = finalPostData
            } else {
                allPosts.unshift(finalPostData)
            }
            localStorage.setItem('allPosts', JSON.stringify(allPosts))
            
            clearDraft()
            
            emit('post-created', finalPostData)
            
            title.value = ''
            content.value = ''
            hashtags.value = ''
            isFormValid.value = false
            
        } catch (error) {
            alert(`Не удалось создать пост: ${error.message}`)
        } finally {
            isLoading.value = false
        }
    }
}

const clearDraft = () => {
    sessionStorage.removeItem('draftPost')
}

const clearDraftAndForm = () => {
    title.value = ''
    content.value = ''
    hashtags.value = ''
    isFormValid.value = false
    clearDraft()
}

import { onBeforeUnmount } from 'vue'
onBeforeUnmount(() => {
    if (hasDraft.value && !createdPostId.value) {
        saveDraft()
    }
})
</script>

<style scoped>
.create-post-container {
    margin-bottom: 2rem;
}
</style>