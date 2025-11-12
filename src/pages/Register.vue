<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const username = ref('')
const password = ref('')
const error = ref('')
const showWelcome = ref(false)

const saveAuthData = (token, refreshToken, userData) => {
  localStorage.setItem('accessToken', token)
  if (refreshToken) localStorage.setItem('refreshToken', refreshToken)
  localStorage.setItem('currentUser', JSON.stringify(userData))
}

const refreshAccessToken = async () => {
  try {
    const refreshToken = localStorage.getItem('refreshToken')
    if (!refreshToken) throw new Error('No refresh token')

    const response = await fetch('/api/tokens/refresh', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token: refreshToken })
    })

    if (!response.ok) throw new Error('Token refresh failed')

    const data = await response.json()
    localStorage.setItem('accessToken', data.newJwt)
    localStorage.setItem('refreshToken', data.newRefresh)
    return data.newJwt
  } catch (err) {
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
    localStorage.removeItem('currentUser')
    router.push('/login')
    return null
  }
}

const apiRequest = async (url, options = {}) => {
  const token = localStorage.getItem('accessToken')
  const config = {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    credentials: 'include'
  }

  if (token) config.headers.Authorization = `Bearer ${token}`

  let response = await fetch(url, config)

  if (response.status === 401) {
    const newToken = await refreshAccessToken()
    if (newToken) {
      config.headers.Authorization = `Bearer ${newToken}`
      response = await fetch(url, config)
    }
  }

  return response
}

const handleRegister = async () => {
  try {
    error.value = ''

    const response = await apiRequest('/api/accounts/register', {
      method: 'POST',
      body: JSON.stringify({
        login: username.value,
        password: password.value
      })
    })

    const contentType = response.headers.get('content-type')
    let data = {}

    if (contentType?.includes('application/json')) {
      data = await response.json()
    } else {
      const text = await response.text()
      if (!response.ok) {
        error.value = `Ошибка сервера: ${response.status}`
        return
      }
    }

    if (!response.ok) {
      error.value = data.message || data.error || `Ошибка регистрации: ${response.status}`
      return
    }

    if (data.refreshToken) {
      saveAuthData(
        data.newJwt || data.token,
        data.refreshToken,
        {
          username: username.value,
          role: data.data?.role || 'user'
        }
      )
    }

    if (data.recoveryCode) {
      localStorage.setItem('recoveryCode', data.recoveryCode)
    }

    showWelcome.value = true
    setTimeout(() => router.push('/GhostCode'), 1000)
  } catch (err) {
    error.value = err.name === 'SyntaxError' 
      ? "Сервер вернул некорректный ответ" 
      : "Ошибка соединения с сервером"
  }
}
</script>

<template>
  <div class="bg-[#111111] min-h-screen flex items-center justify-center">
    <div class="w-[590px] h-[530px] border-[#1F1F1F] border-2 rounded-[15px] bg-[#111111] flex flex-col items-center">
      <span class="text-white text-[26px] mt-[56px]">Зарегистрироваться в GhostCode</span>
      
      <div v-if="error" class="text-red-500 mt-4 text-center max-w-[376px]">{{ error }}</div>
      
      <div class="mt-[48px] w-[376px]">
        <div class="relative border-[#323436] border-2 rounded-t-[10px] bg-[#212224]">
          <img 
            src="@/assets/лого ник.png"
            alt=""
            class="h-[31px] w-[31px] absolute left-[13px] top-1/2 transform -translate-y-1/2"
          >
          <input 
            v-model="username"
            type="text"
            placeholder="Введите свой никнейм"
            class="bg-[#212224] text-[#707070] w-full h-[48px] font-[400] pl-[57px] focus:outline-none rounded-t-[10px]"
          >
        </div>
        
        <div class="relative border-[#323436] border-l-2 border-r-2 border-b-2 rounded-b-[10px] bg-[#212224]">
          <img 
            src="@/assets/лого пароль.png"
            alt=""
            class="h-[31px] w-[31px] absolute left-[13px] top-1/2 transform -translate-y-1/2"
          >
          <img 
            src="@/assets/скрыть пароль.png"
            alt=""
            class="h-[23px] w-[23px] absolute right-[13px] top-1/2 transform -translate-y-1/2"
          >
          <input 
            v-model="password"
            type="password"
            placeholder="Введите свой пароль"
            class="bg-[#212224] text-[#707070] w-full h-[48px] font-[400] pl-[57px] focus:outline-none rounded-b-[10px]"
          >
        </div>
      </div>
      
      <router-link to="GhostCode">
      <button 
        @click="handleRegister"
        class="w-[376px] h-[40px] bg-[#D2EE5B] border-[#819723] border-[1.5px] rounded-[10px] mt-[44px] cursor-pointer hover:bg-[#c5e04f] transition-colors"
      >
        Зарегистрироваться
      </button>
      </router-link>
      
      
      <div class="text-white flex justify-center items-center mt-[133px]">
        <router-link to="/Login" class="flex items-center">
          У вас уже есть аккаунт? 
          <span class="border-b border-[#D2EE5B] pb-1 ml-1">Войти</span>
        </router-link>
      </div>
    </div>
  </div>
</template>