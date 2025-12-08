<script setup>
import userAvatar from '@/assets/qwerty.png'
import AdminAvatar from '@/assets/ава.png'

import { computed, onMounted, ref } from 'vue'
import EditCommentModal from './EditCommentModal.vue'

const props = defineProps({
  postId: {
    type: String,
    required: true
  }
})

const emit = defineEmits(['comment-added'])

const newComment = ref('')
const commentsHidden = ref(false)
const comments = ref([])
const loading = ref(false)
const currentChunk = ref(0)
const hasMoreComments = ref(true)
const showEditModal = ref(false)
const editingCommentId = ref(null)
const editingCommentText = ref('')
const currentUser = ref(null)

const commentsCount = computed(() => comments.value.length)
const charCount = computed(() => newComment.value.length)
const maxChars = 500

const loadCurrentUser = () => {
  try {
    const userData = localStorage.getItem('currentUser')
    if (userData) {
      currentUser.value = JSON.parse(userData)
    }
  } catch (e) {
    currentUser.value = null
  }
}

const loadComments = async (chunkId = 0) => {
  try {
    loading.value = true
    const token = localStorage.getItem('accessToken')
    if (!token) return

    const response = await fetch(`/api/posts/getComments/${props.postId}/chunk/${chunkId}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    
    if (response.ok) {
      const data = await response.json()
      if (Array.isArray(data)) {
        if (chunkId === 0) {
          comments.value = data.map(formatComment)
        } else {
          comments.value.push(...data.map(formatComment))
        }
        hasMoreComments.value = data.length > 0
        saveCommentsToStorage()
      }
    }
  } catch (error) {
    console.error('Ошибка загрузки комментариев:', error)
  } finally {
    loading.value = false
  }
}

const saveCommentsToStorage = () => {
  const storageKey = `comments_${props.postId}`
  localStorage.setItem(storageKey, JSON.stringify(comments.value))
}

const loadCommentsFromStorage = () => {
  const storageKey = `comments_${props.postId}`
  try {
    const savedComments = localStorage.getItem(storageKey)
    if (savedComments) {
      comments.value = JSON.parse(savedComments)
    }
  } catch (e) {
    comments.value = []
  }
}

const formatComment = (comment) => {
  const isCurrentUser = comment.authorId === currentUser.value?.id
  
  return {
    id: comment.id || Date.now() + Math.random(),
    avatar: isCurrentUser ? AdminAvatar : userAvatar,
    username: comment.author?.username || (isCurrentUser ? currentUser.value?.username : 'Аноним'),
    time: formatTime(comment.createdAt),
    text: comment.content || comment.text || '',
    isAdmin: comment.author?.role === 'admin' || isCurrentUser,
    authorId: comment.authorId
  }
}

const formatTime = (dateString) => {
  if (!dateString) return 'недавно'
  const date = new Date(dateString)
  if (isNaN(date.getTime())) return 'недавно'
  const now = new Date()
  const diffTime = Math.abs(now - date)
  const diffHours = Math.floor(diffTime / (1000 * 60 * 60))
  
  if (diffHours < 1) return 'только что'
  if (diffHours === 1) return '1 час назад'
  if (diffHours < 24) return `${diffHours} часа назад`
  
  const diffDays = Math.floor(diffHours / 24)
  if (diffDays === 1) return 'вчера'
  if (diffDays < 7) return `${diffDays} дня назад`
  
  return date.toLocaleDateString('ru-RU')
}

const addComment = async () => {
  if (!newComment.value.trim()) return

  const token = localStorage.getItem('accessToken')
  if (!token) {
    alert('Требуется авторизация')
    return
  }

  try {
    const response = await fetch('/api/posts/commentPost', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        postId: props.postId,
        content: newComment.value
      })
    })
    
    if (response.ok) {
      const newCommentObj = {
        id: Date.now(),
        avatar: AdminAvatar,
        username: currentUser.value?.username || 'Вы',
        time: 'только что',
        text: newComment.value,
        isAdmin: currentUser.value?.role === 'admin',
        authorId: currentUser.value?.id
      }
      
      comments.value.unshift(newCommentObj)
      saveCommentsToStorage()
      
      newComment.value = ''
      
      const postData = JSON.parse(localStorage.getItem('allPosts') || '[]')
      const postIndex = postData.findIndex(p => p.id === props.postId)
      if (postIndex !== -1) {
        postData[postIndex].commentsCount = (postData[postIndex].commentsCount || 0) + 1
        localStorage.setItem('allPosts', JSON.stringify(postData))
        emit('comment-added')
      }
    } else {
      alert('Ошибка при отправке комментария')
    }
  } catch (error) {
    console.error('Ошибка при отправке комментария:', error)
    alert('Ошибка при отправке комментария')
  }
}

const toggleCommentsVisibility = () => {
  commentsHidden.value = !commentsHidden.value
}

const loadMoreComments = () => {
  if (hasMoreComments.value) {
    currentChunk.value += 1
    loadComments(currentChunk.value)
  }
}

const editComment = (comment) => {
  if (comment.authorId === currentUser.value?.id) {
    editingCommentId.value = comment.id
    editingCommentText.value = comment.text
    showEditModal.value = true
  }
}

const saveEditedComment = ({ id, text }) => {
  const commentIndex = comments.value.findIndex(c => c.id === id)
  if (commentIndex !== -1) {
    comments.value[commentIndex].text = text
    comments.value[commentIndex].time = 'только что (изменено)'
    saveCommentsToStorage()
  }
  showEditModal.value = false
  editingCommentId.value = null
  editingCommentText.value = ''
}

const deleteComment = (comment) => {
  if (comment.authorId === currentUser.value?.id) {
    if (confirm('Удалить комментарий?')) {
      const commentIndex = comments.value.findIndex(c => c.id === comment.id)
      if (commentIndex !== -1) {
        comments.value.splice(commentIndex, 1)
        saveCommentsToStorage()
        
        const postData = JSON.parse(localStorage.getItem('allPosts') || '[]')
        const postIndex = postData.findIndex(p => p.id === props.postId)
        if (postIndex !== -1 && postData[postIndex].commentsCount > 0) {
          postData[postIndex].commentsCount -= 1
          localStorage.setItem('allPosts', JSON.stringify(postData))
          emit('comment-added')
        }
      }
    }
  }
}

const isUserComment = (comment) => {
  return comment.authorId === currentUser.value?.id
}

onMounted(() => {
  loadCurrentUser()
  loadCommentsFromStorage()
  loadComments(0)
})
</script>

<template>
	<div class="w-[1052px] bg-[#191919] rounded-[20px] p-4 mt-[0px] ml-[377px]">

    <EditCommentModal
      v-if="showEditModal"
      :comment-id="editingCommentId"
      :comment-text="editingCommentText"
      @save="saveEditedComment"
      @close="showEditModal = false"
    />
    

		<div class="flex justify-between items-center mb-4">
			<div class="flex items-center">
				<h3 class="font-exo text-white font-[600] text-[16px]">Комментарии</h3>
				<span class="font-exo text-[#878787] text-[14px] ml-2">
					({{ commentsCount }})
				</span>
			</div>

			<button
				@click="toggleCommentsVisibility"
				class="font-exo text-[#D2EE5B] text-[14px] hover:underline flex items-center"
			>
				<span v-if="commentsHidden">Показать комментарии</span>
				<span v-else>Скрыть комментарии</span>
			</button>
		</div>

		<div v-if="!commentsHidden">

      <div v-if="loading && comments.length === 0" class="text-center py-8">
        <p class="font-exo text-[#878787] text-[14px]">Загрузка комментариев...</p>
      </div>

			<div
				v-for="comment in comments"
				:key="comment.id"
				class="mt-[20px] first:mt-0 group relative"

			>
				<img
					:src="comment.avatar"
					alt="avatar"
					class="w-[30px] h-[30px] ml-[20px] mt-[14px] absolute"
					:class="{ 'w-[33px] h-[33px]': comment.isAdmin }"
				/>
				<p
					class="font-exo text-white font-[600] text-[14px] ml-[60px] pt-[10px]"
				>
					{{ comment.username }}
				</p>
				<p
					class="font-exo font-[600] text-[#878787] text-[13px] ml-[140px] -mt-[20px]"
				>
					· {{ comment.time }}
				</p>
				<p
					class="font-exo font-[400] text-white text-[14px] ml-[60px] -mt-[2px] whitespace-pre-wrap break-words"
				>
					{{ comment.text }}
				</p>

        
        <div v-if="isUserComment(comment)" class="absolute right-4 top-4 opacity-0 group-hover:opacity-100 transition-opacity">
          <div class="flex gap-2">
            <button
              @click="editComment(comment)"
              class="text-[#0095FF] text-xs hover:text-[#006EBD]"
            >
              Редактировать
            </button>
            <button
              @click="deleteComment(comment)"
              class="text-red-500 text-xs hover:text-red-600 ml-2"
            >
              Удалить
            </button>
          </div>
        </div>

			</div>

			<div class="mt-6">
				<textarea
					v-model="newComment"
					placeholder="Напишите комментарий..."
					class="w-full bg-[#2A2A2A] rounded-xl p-4 font-exo text-white text-[14px] resize-none focus:outline-none focus:ring-2 focus:ring-[#D2EE5B] whitespace-pre-wrap"
					rows="4"
					:maxlength="maxChars"
				></textarea>

				<div class="flex justify-between items-center mt-2">
					<span
						class="font-exo text-[13px]"
						:class="
							charCount > maxChars - 50 ? 'text-red-500' : 'text-[#878787]'
						"
					>
						{{ charCount }}/{{ maxChars }}
					</span>

					<button
						@click="addComment"
						:disabled="!newComment.trim() || loading"
						class="bg-[#D2EE5B] text-black font-exo font-[600] text-[14px] px-6 py-2 rounded-xl hover:bg-[#c5e04a] disabled:opacity-50 disabled:cursor-not-allowed"
					>
						{{ loading ? 'Отправка...' : 'Отправить' }}
					</button>
				</div>
			</div>
		</div>

		<div v-else class="text-center py-8">
			<p class="font-exo text-[#878787] text-[14px]">Комментарии скрыты</p>
			<button
				@click="toggleCommentsVisibility"
				class="font-exo text-[#D2EE5B] text-[14px] mt-2 hover:underline"
			>
				Показать комментарии
			</button>
		</div>

		<button
			v-if="!commentsHidden && hasMoreComments"
			@click="loadMoreComments"
			class="font-exo font-[400] text-[14px] text-[#D2EE5B] flex justify-center mt-[20px] cursor-pointer hover:underline mx-auto"
			:disabled="loading"
		>
			{{ loading ? 'Загрузка...' : 'Показать еще' }}
		</button>
	</div>
</template>