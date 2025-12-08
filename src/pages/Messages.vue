<script setup>
import HeaderMessage from '@/Message/HeaderMessage.vue'
import ProfileMessage from '@/Message/ProfileMessage.vue'
import { HubConnectionBuilder } from '@microsoft/signalr'
import { onMounted, onUnmounted, ref } from 'vue'
import HeaderGhostCode from './HeaderGhostCode.vue'
import avatarByxesh from '/src/assets/avatarByxesh.jpg'
import avatarNaily from '/src/assets/avatarNaily.jpg'

const connection = ref(null)
const messages = ref([])
const newMessage = ref('')
const isConnected = ref(false)
const currentUser = ref({})
const currentChat = ref(null)
const connectionError = ref('')
const targetUserId = ref('')
const currentUserId = ref('')

const getToken = () => {
  const token = localStorage.getItem('accessToken')
  if (token && token !== 'undefined' && token !== 'null') {
    return token
  }
  return null
}

const connectToHub = async () => {
  try {
    const token = getToken()
    
    if (!token) {
      connectionError.value = 'No valid JWT token found. Please login again.'
      return
    }

    connection.value = new HubConnectionBuilder()
      .withUrl('https://ghostcode.byxesh-dev.space/chat', {
        accessTokenFactory: () => token
      })
      .withAutomaticReconnect()
      .build()

    connection.value.on('ChatCreatedSuccessfully', (chat) => {
      currentChat.value = chat
      connectionError.value = ''
    })

    connection.value.on('MessageReceive', (message) => {
      messages.value.push({
        ...message,
        isCurrentUser: message.senderId === currentUserId.value
      })
    })

    connection.value.on('SendMessageError', (error) => {
      connectionError.value = `Send error: ${error}`
    })

    connection.value.on('ChatCreationFailed', (error) => {
      connectionError.value = `Chat creation failed: ${error}`
    })

    connection.value.onclose((error) => {
      isConnected.value = false
      connectionError.value = `Connection closed: ${error}`
    })

    await connection.value.start()
    isConnected.value = true
    
  } catch (error) {
    isConnected.value = false
    connectionError.value = `Connection failed: ${error.message}`
  }
}

const createChat = async () => {
  if (!connection.value || !targetUserId.value.trim()) return
  
  try {
    await connection.value.invoke('CreateChat', {
      aliceId: targetUserId.value.trim()
    })
  } catch (error) {
    connectionError.value = `Create chat error: ${error}`
  }
}

const sendMessage = async () => {
  if (!newMessage.value.trim() || !connection.value || !currentChat.value) return
  
  try {
    await connection.value.invoke('SendMessage', {
      chatId: currentChat.value.id,
      replyTo: '',
      message: newMessage.value.trim()
    })
    newMessage.value = ''
  } catch (error) {
    connectionError.value = `Send message error: ${error}`
  }
}

const handleKeyPress = (event) => {
  if (event.key === 'Enter' && !event.shiftKey) {
    event.preventDefault()
    sendMessage()
  }
}

const copyUserId = () => {
  if (currentUserId.value) {
    navigator.clipboard.writeText(currentUserId.value)
    alert('User ID copied to clipboard!')
  }
}

onMounted(async () => {
  const userData = localStorage.getItem('currentUser')
  if (userData) {
    currentUser.value = JSON.parse(userData)
    currentUserId.value = currentUser.value.username
  }
  
  await connectToHub()
})

onUnmounted(() => {
  if (connection.value) {
    connection.value.stop()
  }
})
</script>

<template>
  <HeaderGhostCode/>

  <div class="flex items-center justify-center min-h-screen pt-[50px] px-4">
    <div class="w-full max-w-[1538px] h-[842px] bg-[#161616] border border-[#242627] rounded-[10px] relative">
      <div class="hidden md:block w-[479px] h-full bg-[#111111] border border-[#242627] rounded-[10px] absolute left-0 top-0">
        <div class="w-full h-[50px] bg-[#111111] border border-[#242627] rounded-[10px]">
          <p class="text-[#FFFFFF] font-exo flex items-center justify-center mt-[7px] text-[20px]">GhostCode Welcome</p>
        </div>
        
        <div class="p-4 space-y-4 mt-4">
          <div class="bg-[#202020] rounded-[10px] p-4">
            <div class="flex items-center justify-between mb-2">
              <p class="text-white font-exo">Your ID:</p>
              <button 
                @click="copyUserId"
                class="text-[#E92929] text-sm hover:underline"
                :disabled="!currentUserId"
              >
                Copy
              </button>
            </div>
            <div class="bg-[#161616] rounded px-3 py-2">
              <p class="text-gray-400 text-sm break-all">{{ currentUserId || 'ID not found' }}</p>
            </div>
            <p class="text-gray-500 text-xs mt-1">Username: {{ currentUser.username }}</p>
          </div>

          <div class="bg-[#202020] rounded-[10px] p-4">
            <p class="text-white font-exo mb-2">Create Chat</p>
            <div class="flex gap-2 mb-2">
              <input 
                v-model="targetUserId"
                placeholder="Enter user ID"
                class="flex-1 bg-[#161616] text-white rounded px-3 py-2 outline-none"
              >
              <button 
                @click="createChat"
                class="bg-[#E92929] text-white px-4 py-2 rounded font-exo"
                :disabled="!isConnected"
              >
                Create
              </button>
            </div>
            <p class="text-gray-400 text-xs">Enter the other user's ID (their username)</p>
          </div>

          <div v-if="currentChat" class="bg-[#202020] rounded-[10px] p-4">
            <p class="text-white font-exo">Active Chat</p>
            <p class="text-gray-400 text-sm">ID: {{ currentChat.id }}</p>
            <p class="text-gray-400 text-sm">Members: {{ currentChat.membersIds?.length }}</p>
          </div>

          <div class="bg-[#202020] rounded-[10px] p-4">
            <p class="text-white font-exo mb-2">Connection Status</p>
            <div class="flex items-center gap-2">
              <div class="w-3 h-3 rounded-full" :class="isConnected ? 'bg-green-500' : 'bg-red-500'"></div>
              <span class="text-white text-sm">{{ isConnected ? 'Connected' : 'Disconnected' }}</span>
            </div>
          </div>
        </div>
        
        <ProfileMessage/>
      </div>

      <div class="md:hidden w-full h-[50px] bg-[#111111] border border-[#242627] rounded-[10px]">
        <p class="text-[#FFFFFF] font-exo flex items-center justify-center mt-[7px] text-[20px]">GhostCode</p>
      </div>

      <div class="md:ml-[479px] h-full flex flex-col">
        <HeaderMessage/>
        
        <div class="flex-1 overflow-y-auto p-4 mt-16 space-y-4">
          <div v-if="connectionError" class="text-red-500 text-center p-2 bg-red-100 rounded">
            {{ connectionError }}
          </div>

          <div v-if="isConnected && !currentChat" class="text-center p-4">
            <p class="text-gray-400">Enter user ID and create a chat to start messaging</p>
          </div>
          
          <div v-for="message in messages" :key="message.id" class="flex" :class="message.isCurrentUser ? 'justify-end' : 'justify-start'">
            <div v-if="!message.isCurrentUser" class="flex items-start gap-3 max-w-[80%]">
              <img 
                :src="avatarByxesh" 
                alt="avatar" 
                class="w-[40px] h-[40px] md:w-[50px] md:h-[50px] rounded-full flex-shrink-0"
              >
              <div class="bg-[#202020] rounded-[10px] p-3 md:p-4">
                <p class="font-exo text-[#FFFFFF] text-[16px] md:text-[21px]">{{ message.text }}</p>
              </div>
            </div>
            
            <div v-else class="flex items-start gap-3 max-w-[80%]">
              <div class="bg-[#E92929] rounded-[10px] p-3 md:p-4">
                <p class="font-exo text-[#FFFFFF] text-[16px] md:text-[21px]">{{ message.text }}</p>
              </div>
              <img 
                :src="avatarNaily" 
                alt="avatar" 
                class="w-[40px] h-[40px] md:w-[50px] md:h-[50px] rounded-full flex-shrink-0"
              >
            </div>
          </div>
        </div>

        <div class="p-4">
          <div class="relative">
            <input 
              type="text"
              v-model="newMessage"
              @keypress="handleKeyPress"
              placeholder="Сообщение..."
              :disabled="!currentChat"
              class="w-full h-[60px] md:h-[85px] bg-[#202020] rounded-[10px] outline-none text-[#FFFFFF] font-exo text-[16px] md:text-[19px] pl-4 pr-20 disabled:opacity-50"
            >
            <button 
              @click="sendMessage"
              :disabled="!currentChat"
              class="absolute right-4 top-1/2 transform -translate-y-1/2 bg-[#E92929] text-white px-4 py-2 rounded-lg font-exo disabled:opacity-50"
            >
              Отправить
            </button>
          </div>
        </div>
      </div>

      <div class="absolute top-2 right-2">
        <div class="flex items-center gap-2">
          <div class="w-3 h-3 rounded-full" :class="isConnected ? 'bg-green-500' : 'bg-red-500'"></div>
          <span class="text-white font-exo text-sm">{{ isConnected ? 'Online' : 'Offline' }}</span>
        </div>
      </div>
    </div>
  </div>
</template>