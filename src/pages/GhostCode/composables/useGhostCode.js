import { useGlobalStore } from '@/composables/useGlobalStore'
import { useNotificationStore } from '@/stores/notificationStore'
import { onMounted, onUnmounted, ref } from 'vue'
import { useRouter } from 'vue-router'

export function useGhostCode() {
  const { globalState, initializeFromStorage } = useGlobalStore()
  const notificationStore = useNotificationStore()
  const router = useRouter()

  const showContent = ref(false)
  const showRecoveryCode = ref(false)
  const recoveryCode = ref('')
  const userRole = ref('')
  const posts = ref([])
  const loading = ref(false)

  const loadPostsFromStorage = () => {
    const savedPosts = JSON.parse(localStorage.getItem('allPosts') || '[]')
    if (savedPosts.length > 0) {
      posts.value = savedPosts
    }
  }

  const loadPosts = async () => {
    try {
      loading.value = true
      const token = localStorage.getItem('accessToken')
      
      if (!token) {
        router.push('/login')
        return
      }

      const response = await fetch('/api/posts/getPosts/0/10', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      
      if (response.status === 401) {
        localStorage.removeItem('accessToken')
        localStorage.removeItem('refreshToken')
        localStorage.removeItem('currentUser')
        router.push('/login')
        return
      }

      if (!response.ok) {
        throw new Error(`Ошибка загрузки постов: ${response.status}`)
      }

      const data = await response.json()
      
      if (data.posts && Array.isArray(data.posts)) {
        const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}')
        
        const formattedPosts = data.posts.map(post => {
          let author = { username: 'Аноним', role: 'user' }
          
          if (post.authorId === currentUser.id) {
            author = currentUser
          } else if (post.author) {
            author = post.author
          }
          
          let hashtagsString = ''
          if (post.tags && Array.isArray(post.tags)) {
            hashtagsString = post.tags.map(tag => tag.startsWith('#') ? tag : `#${tag}`).join(', ')
          }
          
          return {
            id: post.id,
            title: post.title,
            content: post.body || post.content,
            hashtags: hashtagsString,
            createdAt: post.createdAt,
            author: author,
            likes: post.likes || 0,
            commentsCount: post.commentsCount || 0,
            authorId: post.authorId
          }
        })
        
        const mergedPosts = [...posts.value]
        formattedPosts.forEach(newPost => {
          const existingIndex = mergedPosts.findIndex(p => p.id === newPost.id)
          if (existingIndex === -1) {
            mergedPosts.unshift(newPost)
          } else {
            mergedPosts[existingIndex] = {
              ...mergedPosts[existingIndex],
              ...newPost,
              hashtags: newPost.hashtags || mergedPosts[existingIndex].hashtags
            }
          }
        })
        
        posts.value = mergedPosts.sort((a, b) => {
          return new Date(b.createdAt) - new Date(a.createdAt)
        })
        
        localStorage.setItem('allPosts', JSON.stringify(posts.value))
        localStorage.setItem('lastPostUpdate', new Date().toISOString())
      }
    } catch (error) {
      console.error('Ошибка загрузки постов:', error)
    } finally {
      loading.value = false
    }
  }

  const handlePostCreated = (newPost) => {
    const existingIndex = posts.value.findIndex(p => p.id === newPost.id)
    if (existingIndex !== -1) {
      posts.value[existingIndex] = newPost
    } else {
      posts.value.unshift(newPost)
    }
    
    localStorage.setItem('allPosts', JSON.stringify(posts.value))
    localStorage.setItem('lastPostUpdate', new Date().toISOString())
  }

  const checkRecoveryCode = () => {
    const storedRecoveryCode = localStorage.getItem('recoveryCode')
    if (storedRecoveryCode) {
      recoveryCode.value = storedRecoveryCode
      showRecoveryCode.value = true
      localStorage.removeItem('recoveryCode')
    }
  }

  const getUserData = () => {
    if (globalState.currentUser) {
      userRole.value = globalState.currentUser.role || 'Пользователь'
    }
  }

  const updatePosts = () => {
    loadPostsFromStorage()
  }

  const closeRecoveryCode = () => {
    showRecoveryCode.value = false
  }

  const handleLikePost = (postId) => {
    const post = posts.value.find(p => p.id === postId)
    if (post) {
      post.likes = (post.likes || 0) + 1
      localStorage.setItem('allPosts', JSON.stringify(posts.value))
    }
  }

  const handleCommentPost = ({ postId }) => {
    const post = posts.value.find(p => p.id === postId)
    if (post) {
      post.commentsCount = (post.commentsCount || 0) + 1
      localStorage.setItem('allPosts', JSON.stringify(posts.value))
    }
  }

  onMounted(() => {
    initializeFromStorage()
    
    loadPostsFromStorage()
    
    setTimeout(() => {
      showContent.value = true
      loadPosts()
    }, 100)

    checkRecoveryCode()
    getUserData()

    window.addEventListener('storage', updatePosts)
    window.addEventListener('avatarUpdated', getUserData)
    window.addEventListener('focus', () => {
      const lastUpdate = localStorage.getItem('lastPostUpdate')
      if (lastUpdate) {
        const updateTime = new Date(lastUpdate)
        const now = new Date()
        const diffMinutes = (now - updateTime) / (1000 * 60)
        if (diffMinutes > 1) {
          loadPosts()
        }
      }
    })
  })

  onUnmounted(() => {
    window.removeEventListener('storage', updatePosts)
    window.removeEventListener('avatarUpdated', getUserData)
    window.removeEventListener('focus', () => {})
  })

  return {
    showContent,
    showRecoveryCode,
    recoveryCode,
    userRole,
    posts,
    loading,
    notificationStore,
    handlePostCreated,
    handleLikePost,
    handleCommentPost,
    closeRecoveryCode
  }
}