<template>
  <div class="relative">
    <!-- Десктоп версия -->
    <div class="sm:block hidden">
      <div 
        class="absolute w-[130px] h-[130px] ml-[430px] mt-[250px] rounded-full cursor-pointer overflow-hidden border-2 border-transparent hover:border-[#D2EE5B] transition-all duration-300"
        @click="triggerAvatarInput"
      >
        <div class="relative w-full h-full overflow-hidden">
          <img
            :src="currentAvatarUrl"
            alt="userAvatar"
            class="w-full h-full object-cover transition-transform duration-300"
            :style="{
              transform: `scale(${zoom}) translate(${position.x}%, ${position.y}%)`
            }"
          />
          <div class="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center">
            <span class="text-white text-xs text-center opacity-0 hover:opacity-100 font-exo font-semibold">Нажмите чтобы изменить аватар</span>
          </div>
        </div>
      </div>
      
      <button
        v-if="avatarFile && !showAvatarEditor"
        @click="showAvatarEditor = true"
        class="absolute ml-[570px] mt-[350px] bg-[#D2EE5B] text-black px-4 py-2 rounded-lg font-exo font-semibold z-10"
      >
        Настроить аватар
      </button>
    </div>

    <!-- Мобильная версия -->
    <div class="sm:hidden block">
      <div 
        class="mx-auto w-[100px] h-[100px] mt-[-25px] rounded-full cursor-pointer overflow-hidden border-2 border-transparent hover:border-[#D2EE5B] transition-all duration-300"
        @click="triggerAvatarInput"
      >
        <div class="relative w-full h-full overflow-hidden">
          <img
            :src="currentAvatarUrl"
            alt="userAvatar"
            class="w-full h-full object-cover transition-transform duration-300"
            :style="{
              transform: `scale(${zoom}) translate(${position.x}%, ${position.y}%)`
            }"
          />
          <div class="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center">
            <span class="text-white text-[10px] text-center opacity-0 hover:opacity-100 font-exo font-semibold px-1">Нажмите чтобы изменить</span>
          </div>
        </div>
      </div>
      
      <button
        v-if="avatarFile && !showAvatarEditor"
        @click="showAvatarEditor = true"
        class="mx-auto mt-4 bg-[#D2EE5B] text-black px-4 py-2 rounded-lg font-exo font-semibold z-10 block"
      >
        Настроить аватар
      </button>
    </div>

    <input
      ref="avatarInput"
      type="file"
      accept="image/*"
      @change="handleAvatarSelect"
      class="hidden"
    />

    <!-- Редактор (общий для обеих версий) -->
    <div v-if="showAvatarEditor" class="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div class="bg-[#1A1A1A] rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <h3 class="text-white text-xl font-exo font-bold mb-4">Настройка аватара</h3>
        
        <div class="flex flex-col lg:flex-row gap-6">
          <div class="flex-1">
            <div class="relative w-64 h-64 mx-auto border-2 border-[#D2EE5B] rounded-full overflow-hidden">
              <img
                ref="avatarEditor"
                :src="avatarPreview"
                alt="avatar edit"
                class="w-full h-full object-cover transition-transform duration-150"
                :style="{
                  transform: `scale(${zoom}) translate(${position.x}%, ${position.y}%)`
                }"
              />
              <div class="absolute inset-0 border-2 border-white border-dashed pointer-events-none"></div>
            </div>
            
            <div class="mt-4">
              <label class="text-white font-exo block mb-2">Масштаб: {{ Math.round(zoom * 100) }}%</label>
              <input
                v-model="zoom"
                type="range"
                min="1"
                max="3"
                step="0.1"
                class="w-full h-2 bg-[#2A2A2A] rounded-lg appearance-none cursor-pointer"
              />
            </div>
          </div>

          <div class="flex-1">
            <div class="grid grid-cols-3 gap-2 mb-4">
              <button
                v-for="dir in positionPresets"
                :key="dir.key"
                @click="setPosition(dir.x, dir.y)"
                class="bg-[#2A2A2A] text-white p-2 rounded hover:bg-[#333333] transition-colors text-sm"
              >
                {{ dir.label }}
              </button>
            </div>

            <div class="space-y-2">
              <label class="text-white font-exo block">Положение по X: {{ position.x }}%</label>
              <input
                v-model="position.x"
                type="range"
                min="-50"
                max="50"
                step="1"
                class="w-full"
              />

              <label class="text-white font-exo block">Положение по Y: {{ position.y }}%</label>
              <input
                v-model="position.y"
                type="range"
                min="-50"
                max="50"
                step="1"
                class="w-full"
              />
            </div>
          </div>
        </div>

        <div class="flex gap-3 justify-end mt-6">
          <button
            @click="cancelAvatarEdit"
            class="bg-[#2A2A2A] text-white px-6 py-2 rounded-lg font-exo font-semibold hover:bg-[#333333] transition-colors"
          >
            Отмена
          </button>
          <button
            @click="saveAvatar"
            :disabled="uploadingAvatar"
            class="bg-[#D2EE5B] text-black px-6 py-2 rounded-lg font-exo font-semibold hover:bg-[#c5e04f] disabled:opacity-50 transition-colors"
          >
            {{ uploadingAvatar ? 'Сохранение...' : 'Сохранить аватар' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import userAvatar from '/src/assets/авапрофиль.png'

const props = defineProps({
  userData: Object,
  currentUser: Object
})

const emit = defineEmits(['avatar-updated'])

const avatarFile = ref(null)
const avatarPreview = ref(null)
const uploadingAvatar = ref(false)
const avatarInput = ref(null)
const showAvatarEditor = ref(false)

const zoom = ref(1)
const position = ref({ x: 0, y: 0 })
const savedAvatarLink = ref('')

const positionPresets = [
  { key: 'center', label: 'По центру', x: 0, y: 0 },
  { key: 'top', label: 'Вверх', x: 0, y: -25 },
  { key: 'bottom', label: 'Вниз', x: 0, y: 25 },
  { key: 'left', label: 'Влево', x: -25, y: 0 },
  { key: 'right', label: 'Вправо', x: 25, y: 0 },
  { key: 'top-left', label: 'Вверх-влево', x: -25, y: -25 }
]

onMounted(() => {
  loadAvatarFromStorage()
})

const loadAvatarFromStorage = () => {
  const savedAvatar = localStorage.getItem('userAvatar')
  if (savedAvatar) {
    savedAvatarLink.value = savedAvatar
  }
}

const currentAvatarUrl = computed(() => {
  if (avatarPreview.value) return avatarPreview.value
  if (savedAvatarLink.value) {
    return `/api/content/link/avatars/${savedAvatarLink.value}?t=${Date.now()}`
  }
  return userAvatar
})

const triggerAvatarInput = () => {
  avatarInput.value?.click()
}

const handleAvatarSelect = (event) => {
  const file = event.target.files[0]
  if (file && validateFile(file)) {
    avatarFile.value = file
    const reader = new FileReader()
    reader.onload = (e) => {
      avatarPreview.value = e.target.result
      showAvatarEditor.value = true
    }
    reader.readAsDataURL(file)
  }
}

const validateFile = (file) => {
  if (file.size > 5 * 1024 * 1024) {
    alert('Файл слишком большой. Максимальный размер: 5MB')
    return false
  }
  if (!file.type.startsWith('image/')) {
    alert('Пожалуйста, выберите изображение')
    return false
  }
  return true
}

const setPosition = (x, y) => {
  position.value = { x, y }
}

const cancelAvatarEdit = () => {
  showAvatarEditor.value = false
  avatarFile.value = null
  avatarPreview.value = null
}

const saveAvatar = async () => {
  if (!avatarFile.value) return

  uploadingAvatar.value = true

  try {
    const accessToken = localStorage.getItem('accessToken')
    if (!accessToken || accessToken === 'undefined' || accessToken === 'null') {
      throw new Error('Токен не найден')
    }

    const formData = new FormData()
    formData.append('file', avatarFile.value)

    const response = await fetch('/api/content/uploadAvatar', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`
      },
      body: formData
    })

    if (!response.ok) {
      throw new Error(`Ошибка сервера: ${response.status}`)
    }

    const result = await response.json()
    
    if (result.link) {
      savedAvatarLink.value = result.link
      localStorage.setItem('userAvatar', result.link)
      
      const savedUser = localStorage.getItem('currentUser')
      if (savedUser) {
        const user = JSON.parse(savedUser)
        user.avatarLink = result.link
        localStorage.setItem('currentUser', JSON.stringify(user))
      }
      
      showAvatarEditor.value = false
      avatarFile.value = null
      avatarPreview.value = null
      emit('avatar-updated', result.link)
    } else {
      throw new Error('Неверный ответ от сервера')
    }
  } catch (error) {
    console.error('Ошибка загрузки аватара:', error)
    alert('Ошибка загрузки аватара: ' + error.message)
  } finally {
    uploadingAvatar.value = false
  }
}
</script>