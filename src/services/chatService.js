import { HubConnectionBuilder } from '@microsoft/signalr'

class ChatService {
  constructor() {
    this.connection = null
    this.isConnected = false
    this.messageCallbacks = []
    this.chatCallbacks = []
  }

  async connect() {
    try {
      const token = localStorage.getItem('accessToken')
      if (!token || token === 'undefined') return
      
      this.connection = new HubConnectionBuilder()
        .withUrl('https://ghostcode.byxesh-dev.space/chat', {
          accessTokenFactory: () => token
        })
        .withAutomaticReconnect()
        .build()

      this.connection.on('MessageReceive', (message) => {
        this.messageCallbacks.forEach(callback => callback(message))
      })

      this.connection.on('ChatCreatedSuccessfully', (chat) => {
        this.chatCallbacks.forEach(callback => callback(chat))
      })

      await this.connection.start()
      this.isConnected = true
    } catch (error) {
      this.isConnected = false
    }
  }

  onMessage(callback) {
    this.messageCallbacks.push(callback)
  }

  onChatCreated(callback) {
    this.chatCallbacks.push(callback)
  }

  async sendMessage(chatId, message) {
    if (!this.connection || !this.isConnected) return false
    
    try {
      await this.connection.invoke('SendMessage', {
        chatId: chatId,
        replyTo: '',
        message: message
      })
      return true
    } catch (error) {
      return false
    }
  }

  async createChat(userId) {
    if (!this.connection || !this.isConnected) return null
    
    try {
      await this.connection.invoke('CreateChat', {
        aliceId: userId
      })
    } catch (error) {
    }
  }
}

export default new ChatService()