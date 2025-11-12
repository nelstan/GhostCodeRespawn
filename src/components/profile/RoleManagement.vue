<template>
  <div v-if="isAdmin || isDeveloper" class="text-gray-300">
    <h2 class="text-white text-lg md:text-xl font-bold mb-4">Управление ролями</h2>
    <p class="text-[#D2EE5B] mb-4 text-sm md:text-base">Доступ разрешен (Ваша роль: {{ userData?.role || currentUser?.role }})</p>
    
    <div class="bg-[#2A2A2A] p-3 md:p-4 rounded-lg mb-4">
      <div class="flex flex-col sm:flex-row items-center space-y-3 sm:space-y-0 sm:space-x-4 mb-4">
        <input
          v-model="searchUsername"
          type="text"
          placeholder="Введите имя пользователя"
          class="bg-[#1A1A1A] text-white px-3 md:px-4 py-2 rounded-lg flex-1 w-full focus:outline-none focus:ring-2 focus:ring-[#D2EE5B] text-sm md:text-base"
          @keyup.enter="searchUser"
        />
        <button
          @click="searchUser"
          :disabled="loading"
          class="bg-[#D2EE5B] text-gray-900 px-4 md:px-6 py-2 rounded-lg font-semibold hover:bg-[#c5e04f] disabled:opacity-50 disabled:cursor-not-allowed w-full sm:w-auto text-sm md:text-base"
        >
          {{ loading ? 'Поиск...' : 'Найти' }}
        </button>
      </div>

      <div v-if="searchResult" class="bg-[#1A1A1A] p-3 md:p-4 rounded-lg mb-4">
        <h3 class="text-white font-semibold mb-2 text-sm md:text-base">Найден пользователь:</h3>
        <p class="text-sm md:text-base"><strong>Имя:</strong> {{ searchResult.name || searchResult.username }}</p>
        <p class="text-sm md:text-base"><strong>Текущая роль:</strong> {{ searchResult.role }}</p>
        
        <div class="flex flex-col sm:flex-row items-center space-y-3 sm:space-y-0 sm:space-x-4 mt-4">
          <select
            v-model="selectedRole"
            class="bg-[#2A2A2A] text-white px-3 md:px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D2EE5B] w-full sm:w-auto text-sm md:text-base"
          >
            <option 
              v-for="role in availableRoles" 
              :key="role.value" 
              :value="role.value"
              :disabled="role.value === 'admin' && !isAdmin"
            >
              {{ role.label }}
            </option>
          </select>
          
          <button
            @click="updateUserRole"
            :disabled="loading || searchResult.role === selectedRole"
            class="bg-[#D2EE5B] text-gray-900 px-4 md:px-6 py-2 rounded-lg font-semibold hover:bg-[#c5e04f] disabled:opacity-50 disabled:cursor-not-allowed w-full sm:w-auto text-sm md:text-base"
          >
            {{ loading ? 'Обновление...' : 'Обновить роль' }}
          </button>
        </div>
      </div>

      <div v-if="message" class="mt-4 p-3 rounded-lg text-sm md:text-base" :class="message.includes('Ошибка') ? 'bg-red-500/20 text-red-300' : 'bg-green-500/20 text-green-300'">
        {{ message }}
      </div>
    </div>

    <div class="bg-[#2A2A2A] p-3 md:p-4 rounded-lg">
      <h3 class="text-white font-semibold mb-3 text-sm md:text-base">Доступные роли:</h3>
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
        <div v-for="role in availableRoles" :key="role.value" class="flex items-center space-x-2">
          <div class="w-3 h-3 rounded-full" :class="roleColors[role.value]"></div>
          <span class="text-white text-sm md:text-base">{{ role.label }}</span>
        </div>
      </div>
    </div>
  </div>

  <div v-else class="text-center py-6 md:py-8">
    <p class="text-red-400 text-base md:text-lg">Доступ запрещен</p>
    <p class="text-gray-400 mt-2 text-sm md:text-base">У вас недостаточно прав для управления ролями</p>
    <p class="text-gray-400 text-sm md:text-base">Ваша роль: {{ userData?.role || currentUser?.role || 'user' }}</p>
    <p class="text-gray-400 text-sm md:text-base">Требуется: admin или developer</p>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  userData: Object,
  currentUser: Object,
  isAdmin: Boolean,
  isDeveloper: Boolean
})

const searchUsername = ref('')
const selectedRole = ref('user')
const searchResult = ref(null)
const loading = ref(false)
const message = ref('')

const availableRoles = [
  { value: 'user', label: 'Пользователь' },
  { value: 'premium', label: 'Премиум' },
  { value: 'beta-tester', label: 'Бета-тестер' },
  { value: 'developer', label: 'Разработчик' },
  { value: 'admin', label: 'Администратор' }
]

const roleColors = {
  'user': 'bg-green-500',
  'premium': 'bg-blue-500',
  'beta-tester': 'bg-purple-500',
  'developer': 'bg-yellow-500',
  'admin': 'bg-red-500'
}

const searchUser = async () => {
  if (!searchUsername.value.trim()) {
    message.value = 'Введите имя пользователя'
    return
  }

  loading.value = true
  message.value = ''

  try {
    // Здесь должна быть реальная логика поиска пользователя
    // Временно используем моковые данные
    setTimeout(() => {
      searchResult.value = {
        name: searchUsername.value,
        username: searchUsername.value,
        role: 'user'
      }
      selectedRole.value = 'user'
      loading.value = false
    }, 1000)
  } catch (error) {
    message.value = 'Ошибка при поиске пользователя'
    loading.value = false
  }
}

const updateUserRole = async () => {
  if (!searchResult.value) return

  loading.value = true

  try {
    // Здесь должна быть реальная логика обновления роли
    setTimeout(() => {
      searchResult.value.role = selectedRole.value
      message.value = `Роль пользователя ${searchResult.value.name} успешно обновлена на ${selectedRole.value}`
      loading.value = false
    }, 1000)
  } catch (error) {
    message.value = 'Ошибка при обновлении роли'
    loading.value = false
  }
}
</script>