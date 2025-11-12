<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const username = ref('')
const password = ref('')
const error = ref('')
const showWelcome = ref(false)
const loading = ref(false)

const usernameError = ref('')
const passwordError = ref('')

const validateUsername = (text) => {
  const isValid = /^[A-Za-z0-9]*$/.test(text)
  return isValid ? '' : 'Только латинские символы A-Z'
}

const validatePassword = (password) => {
  if (password.length < 5) {
    return 'Пароль должен содержать не менее 5 символов.'
  }
  if (!/^[A-Za-z0-9!@]*$/.test(password)) {
    return 'Только A-Z, 0-9, ! или @'
  }
  if (!/[!@]/.test(password)) {
    return 'Добавьте ! или @ в пароль'
  }
  return ''
}

const handleUsernameInput = (event) => {
  const text = event.target.value
  usernameError.value = validateUsername(text)
}

const handlePasswordInput = (event) => {
  const password = event.target.value
  passwordError.value = validatePassword(password)
}

const handleRegister = async () => {
  if (usernameError.value || passwordError.value) {
    error.value = 'Исправьте ошибки в форме'
    return
  }

  try {
    error.value = ''
    loading.value = true

    const registerResponse = await fetch('/api/accounts/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        login: username.value,
        password: password.value
      })
    })

    if (!registerResponse.ok) {
      error.value = 'Ошибка регистрации (возможно, логин уже занят)'
      return
    }

    const registerData = await registerResponse.json()

    if (!registerData.refreshToken) {
      error.value = 'Ошибка регистрации'
      return
    }

    const tokenResponse = await fetch('/api/tokens/refresh', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        token: registerData.refreshToken
      })
    })

    if (!tokenResponse.ok) {
      error.value = 'Ошибка получения токена'
      return
    }

    const tokenData = await tokenResponse.json()

    if (!tokenData.newJwt || tokenData.newJwt === 'undefined') {
      error.value = 'Ошибка регистрации'
      return
    }

    localStorage.setItem('accessToken', tokenData.newJwt)
    localStorage.setItem('refreshToken', tokenData.newRefresh || registerData.refreshToken)

    const userData = {
      username: username.value,
      role: 'user',
      avatarLink: '',
      headerLink: ''
    }
    localStorage.setItem('currentUser', JSON.stringify(userData))

    if (registerData.recoveryCode) {
      localStorage.setItem('recoveryCode', registerData.recoveryCode)
    }

    showWelcome.value = true
    setTimeout(() => router.push('/GhostCode'), 1000)

  } catch (err) {
    error.value = "Ошибка соединения с сервером"
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="bg-[#111111] min-h-screen">
    <transition name="fade">
      <div 
        v-if="showWelcome"
        class="fixed inset-0 bg-black bg-opacity-95 flex items-center justify-center z-50"
      >
        <div class="text-[#D2EE5B] text-[60px] font-bold animate-pulse">
          Добро пожаловать в GhostCode
        </div>
      </div>
    </transition>

    <div class="flex items-center justify-center min-h-screen">
      <div class="w-[590px] h-[530px] border-[#1F1F1F] border-2 rounded-[15px] bg-[#111111] flex flex-col items-center">
        <span class="text-white text-[26px] mt-[56px]">Зарегистрироваться в GhostCode</span>
        <div v-if="usernameError" class="text-red-500 text-sm mt-1">
        {{ usernameError }}
        </div>  
        
        <div v-if="passwordError" class="text-red-500 text-sm mt-1">
  {{ passwordError }}
</div>
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
            @input="handleUsernameInput"
            type="text"
            placeholder="Введите свой никнейм"
            class="bg-transparent text-white w-full h-[52px] font-[400] pl-[57px] focus:outline-none rounded-t-[9px] border-[1px]"
            :class="usernameError ? 'border-red-500' : 'border-[#323436]'"
            >
          </div>
          
          <div class="relative border-[#323436] border-l-2 border-r-2 border-b-2 rounded-b-[10px] bg-[#212224]">
            <img 
              src="@/assets/лого пароль.png"
              alt=""
              class="h-[31px] w-[31px] absolute left-[13px] top-1/2 transform -translate-y-1/2"
            >
            <input 
              v-model="password"
              @input="handlePasswordInput"
              type="password"
              placeholder="Введите свой пароль"
              class="bg-transparent text-white w-full h-[48px] font-[400] pl-[57px] focus:outline-none rounded-b-[10px] border-2"
              :class="passwordError ? 'border-red-500' : 'border-[#323436]'"
            >
          </div>
        </div>
        
        <button 
          @click="handleRegister"
          :disabled="loading"
          class="w-[376px] h-[40px] bg-[#D2EE5B] border-[#819723] border-[1.5px] rounded-[10px] mt-[44px] cursor-pointer hover:bg-[#c5e04f] disabled:opacity-50 transition-colors"
        >
          {{ loading ? 'Регистрация...' : 'Зарегистрироваться' }}
        </button>
        
        <div class="text-white flex justify-center items-center mt-[133px]">
          <router-link to="/Login" class="flex items-center">
            У вас уже есть аккаунт? 
            <span class="border-b border-[#D2EE5B] pb-1 ml-1">Войти</span>
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
</style>