<template>
  <div class="create-post-container">
    <div class="w-[1052px] rounded-[25px] border border-[#819723] bg-[#191919] p-6 ml-[400px] mt-[10px] ">
      <div class="text-white font-exo text-xl mb-6 ml-[380px]">Создать новый пост</div>
      
      <PostName @title-update="updateTitle" />
      
      <PostInside @content-update="updateContent" />
      
      <PostHashtags @hashtags-update="updateHashtags" />
      
      <PostPublic 
        :isLoading="isLoading" 
        :disabled="!isFormValid"
        @post-submit="handleSubmit"
      />
    </div>
  </div>
</template>

<script setup>
import PostHashtags from '@/components/Posts/PostHashtags.vue'
import PostInside from '@/components/Posts/PostInside.vue'
import PostName from '@/components/Posts/PostName.vue'
import PostPublic from '@/components/Posts/PostPublic.vue'
import { ref, watch } from 'vue'

const title = ref('')
const content = ref('')
const hashtags = ref('')
const isLoading = ref(false)

const emit = defineEmits(['post-created'])

const updateTitle = (newTitle) => {
    title.value = newTitle
}

const updateContent = (newContent) => {
    content.value = newContent
}

const updateHashtags = (newHashtags) => {
    hashtags.value = newHashtags
}

const isFormValid = ref(false)

watch([title, content], () => {
    isFormValid.value = title.value.trim().length > 0 && content.value.trim().length > 0
})

const handleSubmit = async () => {
    if (isFormValid.value && !isLoading.value) {
        isLoading.value = true
        
        try {
            const token = localStorage.getItem('accessToken')
            if (!token) {
                throw new Error('Требуется авторизация')
            }
            
            const postData = {
                title: title.value,
                body: content.value
            }
            
            const response = await fetch('/api/posts/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(postData)
            })
            
            if (!response.ok) {
                throw new Error('Ошибка при создании поста')
            }
            
            const createdPost = await response.json()
            
            const finalPostData = {
                id: createdPost.id,
                title: title.value,
                content: content.value,
                hashtags: hashtags.value,
                createdAt: createdPost.createdAt || new Date().toISOString(),
                author: JSON.parse(localStorage.getItem('currentUser')) || { username: 'Аноним' },
                likes: createdPost.likes || 0,
                commentsCount: createdPost.commentsCount || 0,
                authorId: createdPost.authorId
            }
            
            emit('post-created', finalPostData)
            
            title.value = ''
            content.value = ''
            hashtags.value = ''
            
        } catch (error) {
            console.error('Ошибка при создании поста:', error)
            alert('Не удалось создать пост. Проверьте соединение.')
        } finally {
            isLoading.value = false
        }
    }
}
</script>

<style scoped>
.create-post-container {
    margin-bottom: 2rem;
}
</style>