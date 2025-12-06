<script setup>
import notifaction from '@/assets/1.png'
import avatar from '@/assets/ава.png'
import logo from '@/assets/лого.png'
import lupa from '@/assets/лупа.png'
import sms from '@/assets/смс.png'
import NotificationModal from '@/components/NotificationModal.vue'
import NotificationToast from '@/components/NotificationToast.vue'
import PostsComponents from '@/components/PostsComponents.vue'
import userLeftMain from '@/components/userLeftMain.vue'
import { useGlobalStore } from '@/composables/useGlobalStore'
import CreatePost from '@/pages/CreatePost.vue'
import { useNotificationStore } from '@/stores/notificationStore'
import { computed, onMounted, onUnmounted, ref } from 'vue'
import elkalogo from '/src/assets/elkalogo.png'

const { globalState, initializeFromStorage } = useGlobalStore()
const notificationStore = useNotificationStore()

const showContent = ref(false)
const showRecoveryCode = ref(false)
const recoveryCode = ref('')
const userRole = ref('')
const userPosts = ref([])
const posts = ref([])
const loading = ref(false)

const loadPosts = async () => {
    try {
        loading.value = true
        const token = localStorage.getItem('accessToken')
        if (!token) return
        
        const response = await fetch('/api/posts/getPosts/0/10', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        
        if (response.ok) {
            const data = await response.json()
            posts.value = data.posts || []
        }
    } catch (error) {
        console.error('Ошибка загрузки постов:', error)
    } finally {
        loading.value = false
    }
}

const handlePostCreated = (newPost) => {
    posts.value.unshift(newPost)
    
    const storedPosts = JSON.parse(localStorage.getItem('userPosts') || '[]')
    storedPosts.unshift(newPost)
    localStorage.setItem('userPosts', JSON.stringify(storedPosts))
    
    userPosts.value = storedPosts
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

const loadUserPosts = () => {
    const storedPosts = localStorage.getItem('userPosts')
    if (storedPosts) {
        userPosts.value = JSON.parse(storedPosts)
    }
}

const updatePosts = () => {
    loadUserPosts()
}

onMounted(() => {
    initializeFromStorage()
    
    setTimeout(() => {
        showContent.value = true
        loadPosts()
    }, 100)

    checkRecoveryCode()
    getUserData()
    loadUserPosts()

    window.addEventListener('storage', updatePosts)
    window.addEventListener('avatarUpdated', getUserData)
})

onUnmounted(() => {
    window.removeEventListener('storage', updatePosts)
    window.removeEventListener('avatarUpdated', getUserData)
})

const closeRecoveryCode = () => {
    showRecoveryCode.value = false
}

const copyToClipboard = () => {
    navigator.clipboard
        .writeText(recoveryCode.value)
        .then(() => {
            alert('Код скопирован в буфер обмена!')
        })
        .catch(err => {
            console.error('Ошибка копирования: ', err)
        })
}

const getRoleColor = role => {
    const colors = {
        admin: 'text-red-400',
        moderator: 'text-blue-400',
        vip: 'text-purple-400',
        premium: 'text-yellow-400',
        user: 'text-green-400',
    }
    return colors[role?.toLowerCase()] || 'text-gray-400'
}

const getRoleDisplayName = role => {
    const names = {
        admin: 'Администратор',
        moderator: 'Модератор',
        vip: 'VIP',
        premium: 'Премиум',
        user: 'Пользователь',
    }
    return names[role?.toLowerCase()] || role || 'Пользователь'
}

const hasPosts = computed(() => {
    return userPosts.value.length > 0
})

const getUserAvatar = () => {
    if (globalState.currentUser?.avatarLink) {
        return `/api/content/link/avatars/${globalState.currentUser.avatarLink}`
    }
    return avatar
}

const handleLikePost = (postId) => {
    const post = posts.value.find(p => p.id === postId)
    if (post) {
        post.likes = (post.likes || 0) + 1
    }
}

const handleCommentPost = ({ postId }) => {
    const post = posts.value.find(p => p.id === postId)
    if (post) {
        post.commentsCount = (post.commentsCount || 0) + 1
    }
}
</script>

<template>
    <div class="snow-container">
        <div class="snowflake"></div>
        <div class="snowflake"></div>
        <div class="snowflake"></div>
        <div class="snowflake"></div>
        <div class="snowflake"></div>
        <div class="snowflake"></div>
        <div class="snowflake"></div>
        <div class="snowflake"></div>
        <div class="snowflake"></div>
        <div class="snowflake"></div>
        <div class="snowflake"></div>
        <div class="snowflake"></div>
        <div class="snowflake"></div>
        <div class="snowflake"></div>
        <div class="snowflake"></div>
        <div class="snowflake"></div>
        <div class="snowflake"></div>
        <div class="snowflake"></div>
        <div class="snowflake"></div>
        <div class="snowflake"></div>
        <div class="snowflake"></div>
        <div class="snowflake"></div>
        <div class="snowflake"></div>
        <div class="snowflake"></div>
        <div class="snowflake"></div>
        <div class="snowflake"></div>
        <div class="snowflake"></div>
        <div class="snowflake"></div>
        <div class="snowflake"></div>
        <div class="snowflake"></div>
    </div>

    <div
        v-if="showRecoveryCode"
        class="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50"
    >
        <div
            class="bg-[#1E1E1E] border border-[#D2EE5B] rounded-[20px] p-8 max-w-md w-full mx-4 relative"
        >
            <button
                @click="closeRecoveryCode"
                class="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
            >
                <svg
                    class="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M6 18L18 6M6 6l12 12"
                    ></path>
                </svg>
            </button>

            <div class="text-center mb-6">
                <h2 class="text-2xl font-bold text-white font-exo mb-2">
                    Ваш Recovery Code
                </h2>
                <p class="text-gray-400 text-sm">Сохраните этот код в надежном месте</p>
            </div>

            <div class="bg-[#2A2A2A] border border-[#3A3A3A] rounded-[15px] p-4 mb-6">
                <div class="flex items-center justify-between">
                    <code
                        class="text-[#D2EE5B] font-mono text-lg font-bold tracking-wider break-all"
                    >
                        {{ recoveryCode }}
                    </code>
                    <button
                        @click="copyToClipboard"
                        class="ml-3 p-2 bg-[#D2EE5B] bg-opacity-20 rounded-lg hover:bg-opacity-30 transition-all"
                        title="Скопировать"
                    >
                        <svg
                            class="w-5 h-5 text-[#D2EE5B]"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke-width="2"
                                d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                            ></path>
                        </svg>
                    </button>
                </div>
            </div>

            <div
                class="bg-yellow-500 bg-opacity-10 border border-yellow-500 border-opacity-30 rounded-[10px] p-3 mb-6"
            >
                <p class="text-yellow-400 text-xs text-center">
                    ⚠️ Этот код можно увидеть только один раз. Не забудьте его сохранить!
                </p>
            </div>

            <button
                @click="closeRecoveryCode"
                class="w-full bg-[#D2EE5B] text-black font-exo font-bold py-3 rounded-[15px] hover:bg-[#c5e34a] transition-colors"
            >
                Понятно
            </button>
        </div>
    </div>
    
    <NotificationModal />
    <NotificationToast />
    
    <transition name="fade">
        <div v-if="showContent" class="bg-[#111111] min-h-screen">
            <div
                class="flex w-full h-[47px] border-b-2 border-[#242627] items-center fixed bg-[#111111] z-10"
            >
                <img :src="logo" alt="logo" class="h-full ml-[250px]" />

                <div class="flex items-center ml-auto mr-[250px]">
                    <div class="relative">
                        <input
                            type="text"
                            placeholder="Что ищете в царстве теней?"
                            class="ml-[-550px] font-exo font-[400] text-[14px] w-[262px] h-[29px] bg-[#202020] pl-[35px] rounded-[25px] border border-[#2C2C2C] cursor-pointer outline-none text-[#B6B5B5]"
                        />
                    </div>
                    <img :src="lupa" alt="search icon" class="absolute ml-[-540px]" />

                    <div class="flex items-center ml-[25px] space-x-[15px]">
                        <img
                            :src="sms"
                            alt="sms"
                            class="w-[25px] h-[25px] cursor-pointer"
                        />

                        <div class="relative">
                            <img
                                :src="notifaction"
                                alt="notifaction"
                                class="w-[40px] h-[40px] cursor-pointer "
                                @click="notificationStore.toggleModal()"
                            />
                            <span
                                v-if="notificationStore.unreadCount > 0"
                                class="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white"
                            >
                                {{ notificationStore.unreadCount }}
                            </span>
                        </div>

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
                    </div>
                </div>
            </div>

            <div class="pt-[60px] flex justify-between px-[250px]">
                <div class="w-[800px] mt-[80px] ">
                            <div class='fixed'>
                                <div class='w-[350px] h-[57px] bg-[#171717] absolute mt-[-65px] rounded-[10px] 
                                                        shadow-[0_0_20px_5px_#0C4507] shadow-[#0C4507]
                                                        border border-[#0C4507]/30
                                                        backdrop-blur-sm'>
                                        <p class='font-exo text-[#FFFFFF] text-[40px] font-semibold ml-[90px]'>GhostCode</p>
                                        <img 
                                                :src="logo" 
                                                alt=""
                                                class='absolute mt-[-47px] ml-[20px]'
                                        >
                                        <img 
                                                :src="elkalogo"
                                                alt="elkalogo"
                                                class='absolute mt-[-60px]'
                                        >
                                        <img 
                                                :src="elkalogo"
                                                alt="elkalogo"
                                                class='absolute mt-[-60px] ml-[120px]'
                                        >
                                        <img 
                                                :src="elkalogo"
                                                alt="elkalogo"
                                                class='absolute mt-[-60px] ml-[225px] rounded-tr-lg rounded-br-lg'
                                        >
                                </div>
                        </div>
                    
                    <CreatePost @post-created="handlePostCreated" />
                    
                    <div>
                        <PostsComponents
                            v-for="post in posts"
                            :key="post.id"
                            :post="post"
                            @like-post="handleLikePost"
                            @comment-post="handleCommentPost"
                        />
                        
                        <div v-if="hasPosts" class="space-y-8">
                            <PostsComponents
                                v-for="post in userPosts"
                                :key="post.id"
                                :post="post"
                                @like-post="handleLikePost"
                                @comment-post="handleCommentPost"
                            />
                        </div>
                    </div>
                </div>

                        <userLeftMain />
            </div>
        </div>
    </transition>
</template>

<style>
.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.5s ease;
}
.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}

.snow-container {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    z-index: 20;
    overflow: hidden;
}

.snowflake {
    position: absolute;
    background: white;
    border-radius: 50%;
    opacity: 0.8;
    animation-name: snowfall;
    animation-timing-function: linear;
    animation-iteration-count: infinite;
}

.snowflake:nth-child(1) {
    width: 10px;
    height: 10px;
    left: 10%;
    animation-duration: 12s;
    animation-delay: 0s;
}
.snowflake:nth-child(2) {
    width: 8px;
    height: 8px;
    left: 20%;
    animation-duration: 14s;
    animation-delay: 1s;
}
.snowflake:nth-child(3) {
    width: 12px;
    height: 12px;
    left: 30%;
    animation-duration: 16s;
    animation-delay: 2s;
}
.snowflake:nth-child(4) {
    width: 6px;
    height: 6px;
    left: 40%;
    animation-duration: 13s;
    animation-delay: 3s;
}
.snowflake:nth-child(5) {
    width: 9px;
    height: 9px;
    left: 50%;
    animation-duration: 15s;
    animation-delay: 4s;
}
.snowflake:nth-child(6) {
    width: 7px;
    height: 7px;
    left: 60%;
    animation-duration: 11s;
    animation-delay: 5s;
}
.snowflake:nth-child(7) {
    width: 11px;
    height: 11px;
    left: 70%;
    animation-duration: 17s;
    animation-delay: 6s;
}
.snowflake:nth-child(8) {
    width: 5px;
    height: 5px;
    left: 80%;
    animation-duration: 10s;
    animation-delay: 7s;
}
.snowflake:nth-child(9) {
    width: 8px;
    height: 8px;
    left: 90%;
    animation-duration: 14s;
    animation-delay: 8s;
}
.snowflake:nth-child(10) {
    width: 10px;
    height: 10px;
    left: 5%;
    animation-duration: 13s;
    animation-delay: 9s;
}
.snowflake:nth-child(11) {
    width: 6px;
    height: 6px;
    left: 15%;
    animation-duration: 12s;
    animation-delay: 10s;
}
.snowflake:nth-child(12) {
    width: 9px;
    height: 9px;
    left: 25%;
    animation-duration: 15s;
    animation-delay: 11s;
}
.snowflake:nth-child(13) {
    width: 7px;
    height: 7px;
    left: 35%;
    animation-duration: 14s;
    animation-delay: 12s;
}
.snowflake:nth-child(14) {
    width: 11px;
    height: 11px;
    left: 45%;
    animation-duration: 16s;
    animation-delay: 13s;
}
.snowflake:nth-child(15) {
    width: 8px;
    height: 8px;
    left: 55%;
    animation-duration: 13s;
    animation-delay: 14s;
}
.snowflake:nth-child(16) {
    width: 10px;
    height: 10px;
    left: 65%;
    animation-duration: 12s;
    animation-delay: 15s;
}
.snowflake:nth-child(17) {
    width: 6px;
    height: 6px;
    left: 75%;
    animation-duration: 11s;
    animation-delay: 16s;
}
.snowflake:nth-child(18) {
    width: 9px;
    height: 9px;
    left: 85%;
    animation-duration: 14s;
    animation-delay: 17s;
}
.snowflake:nth-child(19) {
    width: 7px;
    height: 7px;
    left: 95%;
    animation-duration: 13s;
    animation-delay: 18s;
}
.snowflake:nth-child(20) {
    width: 12px;
    height: 12px;
    left: 3%;
    animation-duration: 17s;
    animation-delay: 19s;
}
.snowflake:nth-child(21) {
    width: 5px;
    height: 5px;
    left: 13%;
    animation-duration: 10s;
    animation-delay: 20s;
}
.snowflake:nth-child(22) {
    width: 8px;
    height: 8px;
    left: 23%;
    animation-duration: 14s;
    animation-delay: 21s;
}
.snowflake:nth-child(23) {
    width: 6px;
    height: 6px;
    left: 33%;
    animation-duration: 12s;
    animation-delay: 22s;
}
.snowflake:nth-child(24) {
    width: 10px;
    height: 10px;
    left: 43%;
    animation-duration: 15s;
    animation-delay: 23s;
}
.snowflake:nth-child(25) {
    width: 7px;
    height: 7px;
    left: 53%;
    animation-duration: 13s;
    animation-delay: 24s;
}
.snowflake:nth-child(26) {
    width: 9px;
    height: 9px;
    left: 63%;
    animation-duration: 16s;
    animation-delay: 25s;
}
.snowflake:nth-child(27) {
    width: 11px;
    height: 11px;
    left: 73%;
    animation-duration: 14s;
    animation-delay: 26s;
}
.snowflake:nth-child(28) {
    width: 8px;
    height: 8px;
    left: 83%;
    animation-duration: 12s;
    animation-delay: 27s;
}
.snowflake:nth-child(29) {
    width: 6px;
    height: 6px;
    left: 93%;
    animation-duration: 11s;
    animation-delay: 28s;
}
.snowflake:nth-child(30) {
    width: 10px;
    height: 10px;
    left: 8%;
    animation-duration: 15s;
    animation-delay: 29s;
}

@keyframes snowfall {
    0% {
        top: -10%;
        transform: translateX(0) rotate(0deg);
        opacity: 0.8;
    }
    25% {
        transform: translateX(25px) rotate(90deg);
    }
    50% {
        transform: translateX(-15px) rotate(180deg);
        opacity: 0.6;
    }
    75% {
        transform: translateX(20px) rotate(270deg);
    }
    100% {
        top: 100%;
        transform: translateX(-10px) rotate(360deg);
        opacity: 0;
    }
}
</style>