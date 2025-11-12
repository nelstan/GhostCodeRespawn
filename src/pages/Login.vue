<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const username = ref('')
const password = ref('')
const error = ref('')
const showWelcome = ref(false)
const showPassword = ref(false)
const loading = ref(false)

const handleLogin = async () => {
  try {
    error.value = ''
    loading.value = true

    const loginResponse = await fetch('/api/accounts/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        login: username.value,
        password: password.value
      })
    })

    if (!loginResponse.ok) {
      error.value = 'Неверный логин или пароль'
      return
    }

    const loginData = await loginResponse.json()

    if (!loginData.refreshToken) {
      error.value = 'Ошибка входа'
      return
    }

    const tokenResponse = await fetch('/api/tokens/refresh', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        token: loginData.refreshToken
      })
    })

    if (!tokenResponse.ok) {
      error.value = 'Ошибка получения токена'
      return
    }

    const tokenData = await tokenResponse.json()

    if (!tokenData.newJwt || tokenData.newJwt === 'undefined') {
      error.value = 'Ошибка входа'
      return
    }

    localStorage.setItem('accessToken', tokenData.newJwt)
    localStorage.setItem('refreshToken', tokenData.newRefresh || loginData.refreshToken)

    // Получаем данные пользователя после успешного входа
    const userDataResponse = await fetch('/api/accounts/getData/' + (loginData.data?.id || ''), {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${tokenData.newJwt}`
      }
    })

const userData = {
  username: username.value, // меняем эту строку
  role: loginData.data?.role || 'user',
  avatarLink: loginData.data?.avatarLink || '',
  headerLink: loginData.data?.headerLink || ''
}

    if (userDataResponse.ok) {
      const userDataResult = await userDataResponse.json()
      userData.avatarLink = userDataResult.data?.avatarLink || ''
      userData.headerLink = userDataResult.data?.headerLink || ''
    }

    localStorage.setItem('currentUser', JSON.stringify(userData))

    if (loginData.recoveryCode) {
      localStorage.setItem('recoveryCode', loginData.recoveryCode)
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
      <div class="w-[590px] h-[530px] border-[#1F1F1F] border-2 rounded-[15px] bg-[#111111]">
        <span class="text-white flex justify-center mt-[56px] text-[26px]">Войдите в GhostCode</span>
        
        <div v-if="error" class="text-red-500 text-[15px] text-center mt-4 font-exo">
          {{ error }}
        </div>

        <div class="flex justify-center mt-[48px]">
          <div class="relative border-[#323436] border-2 rounded-t-[10px] bg-[#212224]">
            <img 
              src="@/assets/лого ник.png"
              alt=""
              class="h-[31px] w-[31px] absolute left-[13px] top-1/2 transform -translate-y-1/2"
            >
            <input 
              v-model="username"
              @input="error = ''"
              type="text"
              placeholder="Введите свой никнейм"
              class="bg-transparent text-white w-[376px] h-[48px] font-[400] pl-[57px] focus:outline-none rounded-t-[10px]"
            >
          </div>
        </div>

        <div class="flex justify-center">
          <div class="relative border-[#323436] border-l-2 border-r-2 border-b-2 rounded-b-[10px] bg-[#212224]">
            <img 
              src="@/assets/лого пароль.png"
              alt=""
              class="h-[31px] w-[31px] absolute left-[13px] top-1/2 transform -translate-y-1/2"
            >
            <img 
              src="@/assets/скрыть пароль.png"
              alt=""
              class="h-[23px] w-[23px] absolute right-[13px] top-1/2 transform -translate-y-1/2 cursor-pointer"
              @click="showPassword = !showPassword"
            >
            <input 
              v-model="password"
              @input="error = ''"
              :type="showPassword ? 'text' : 'password'"
              placeholder="Введите свой пароль"
              class="bg-transparent text-white w-[376px] h-[48px] font-[400] pl-[57px] focus:outline-none rounded-b-[10px]"
            >
          </div>
        </div>

        <div class="flex justify-center mt-[8px]">
          <router-link to="/forgetPassword" class="font-[400] text-[#D2EE5B] text-[14px] cursor-pointer">
            Забыли пароль?
          </router-link>
        </div>

        <div class="flex justify-center">
          <button 
            @click="handleLogin"
            :disabled="loading"
            class="w-[376px] h-[40px] bg-[#D2EE5B] border-[#819723] border-[1.5px] rounded-[10px] mt-[8px] cursor-pointer hover:bg-[#c5e04f] disabled:opacity-50 transition-colors"
          >
            {{ loading ? 'Вход...' : 'Войти' }}
          </button>
        </div>

        <div class="text-white flex justify-center items-center mt-[133px]">
          <router-link to="/Register" class="flex items-center">
            У вас нет аккаунта? 
            <span class="border-b border-[#D2EE5B] pb-1 ml-1">Зарегистрироваться</span>
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