<template>
  <div class="min-h-screen bg-gradient-to-br from-[#0a1f0a] to-[#152515] font-exo">
    <!-- Хедер -->
    <div class="border-b border-[#2d5a2d] border-opacity-40 bg-[#0a1f0a] bg-opacity-90 backdrop-blur-lg sticky top-0 z-50">
      <div class="container mx-auto px-6 py-4">
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-4">
            <div class="text-2xl font-bold">
              <span class="text-[#4ade80]">Ghost</span>
              <span class="text-[#86efac]">Code</span>
            </div>
            <div class="flex space-x-2">
              <router-link to="/" class="px-4 py-2 text-[#a7f3a7] hover:text-[#4ade80] transition-all duration-300 relative">
                Главная
              </router-link>
              <router-link to="/CreatePost" class="px-4 py-2 text-[#4ade80] transition-all duration-300 relative">
                Создать
                <div class="absolute bottom-0 left-2 right-2 h-0.5 bg-[#4ade80] shadow-[0_0_10px_#4ade80]"></div>
              </router-link>
              <router-link to="/Profile" class="px-4 py-2 text-[#a7f3a7] hover:text-[#4ade80] transition-all duration-300 relative">
                Профиль
              </router-link>
            </div>
          </div>
          
          <div class="flex items-center space-x-3">
            <div class="w-10 h-10 rounded-full border border-[#4ade80] border-opacity-50 bg-gradient-to-br from-[#4ade80] to-[#22c55e]"></div>
            <span class="text-[#86efac]">{{ currentUser?.username }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Основной контент -->
    <div class="container mx-auto px-6 py-8">
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Левая колонка - форма -->
        <div class="lg:col-span-2">
          <div class="bg-[#152515] bg-opacity-80 border border-[#4ade80] border-opacity-30 rounded-2xl p-8 backdrop-blur-lg shadow-2xl shadow-[#4ade80]/10">
            <!-- Заголовок -->
            <div class="mb-8">
              <h1 class="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#4ade80] to-[#22c55e]">
                СОЗДАТЬ ПОСТ
              </h1>
              <div class="h-1 w-20 bg-gradient-to-r from-[#4ade80] to-[#22c55e] mt-2 rounded-full"></div>
            </div>

            <!-- Поля формы -->
            <div class="space-y-6">
              <!-- Заголовок поста -->
              <div class="space-y-2">
                <label class="text-[#4ade80] text-sm font-bold uppercase tracking-wider">ЗАГОЛОВОК</label>
                <input 
                  v-model="postTitle"
                  type="text"
                  placeholder="Введите заголовок..."
                  class="w-full bg-[#0a1f0a] border border-[#4ade80] border-opacity-30 rounded-lg px-4 py-3 text-white placeholder-[#a7f3a7] focus:outline-none focus:border-[#4ade80] focus:shadow-[0_0_15px_rgba(74,222,128,0.3)] transition-all duration-300"
                >
              </div>

              <!-- Контент -->
              <div class="space-y-2">
                <label class="text-[#4ade80] text-sm font-bold uppercase tracking-wider">КОНТЕНТ</label>
                <textarea 
                  v-model="postContent"
                  rows="8"
                  placeholder="Напишите ваш код или мысли..."
                  class="w-full bg-[#0a1f0a] border border-[#4ade80] border-opacity-30 rounded-lg px-4 py-3 text-white placeholder-[#a7f3a7] focus:outline-none focus:border-[#4ade80] focus:shadow-[0_0_15px_rgba(74,222,128,0.3)] transition-all duration-300 resize-none"
                ></textarea>
              </div>

              <!-- Выбор языка/тега -->
              <div class="space-y-2">
                <label class="text-[#4ade80] text-sm font-bold uppercase tracking-wider">ЯЗЫК ПРОГРАММИРОВАНИЯ</label>
                <div class="grid grid-cols-4 gap-2 mt-2">
                  <button 
                    v-for="tag in tags" 
                    :key="tag"
                    @click="selectedTag = tag"
                    :class="[
                      'px-3 py-2 bg-[#0a1f0a] border border-[#4ade80] border-opacity-20 rounded-lg text-gray-400 text-sm transition-all duration-300',
                      selectedTag === tag 
                        ? 'bg-[#4ade80] bg-opacity-10 border-[#4ade80] text-[#4ade80] shadow-[0_0_10px_rgba(74,222,128,0.3)]' 
                        : 'hover:border-[#4ade80] hover:text-[#4ade80]'
                    ]"
                  >
                    {{ tag }}
                  </button>
                </div>
              </div>

              <!-- Кнопки действий -->
              <div class="flex space-x-4 pt-4">
                <button 
                  @click="createPost" 
                  class="relative px-6 py-3 bg-[#4ade80] text-[#0a1f0a] rounded-lg font-bold text-sm uppercase tracking-wider transition-all duration-300 hover:bg-[#3bd171] hover:shadow-[0_0_20px_rgba(74,222,128,0.5)]"
                >
                  <div class="absolute inset-0 rounded-lg bg-[#4ade80] opacity-30 blur-md -z-10"></div>
                  ОПУБЛИКОВАТЬ
                </button>
                <button 
                  @click="saveDraft" 
                  class="px-6 py-3 bg-[#0a1f0a] border border-[#4ade80] text-[#4ade80] rounded-lg font-bold text-sm uppercase tracking-wider transition-all duration-300 hover:bg-[#4ade80] hover:bg-opacity-10 hover:shadow-[0_0_15px_rgba(74,222,128,0.3)]"
                >
                  СОХРАНИТЬ ЧЕРНОВИК
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Правая колонка - предпросмотр -->
        <div class="lg:col-span-1">
          <div class="bg-[#152515] bg-opacity-80 border border-[#4ade80] border-opacity-30 rounded-2xl p-6 backdrop-blur-lg shadow-2xl shadow-[#4ade80]/10">
            <h3 class="text-[#4ade80] font-bold mb-4">ПРЕДПРОСМОТР</h3>
            
            <div>
              <div class="flex items-center space-x-3 mb-4">
                <div class="w-8 h-8 rounded-full border border-[#4ade80] border-opacity-50 bg-gradient-to-br from-[#4ade80] to-[#22c55e]"></div>
                <div>
                  <p class="text-[#86efac] text-sm font-bold">{{ currentUser?.username }}</p>
                  <p class="text-[#a7f3a7] text-xs opacity-70">только что</p>
                </div>
              </div>
              
              <h4 class="text-white font-bold mb-2">{{ postTitle || 'Заголовок поста' }}</h4>
              <p class="text-[#d1fae5] text-sm mb-3 leading-relaxed opacity-90">{{ postContent || 'Содержание поста...' }}</p>
              
              <div v-if="selectedTag" class="inline-block px-3 py-1 bg-[#4ade80] bg-opacity-10 border border-[#4ade80] rounded-full text-[#4ade80] text-xs font-bold">
                #{{ selectedTag }}
              </div>
            </div>
          </div>

          <!-- Подсказки -->
          <div class="bg-[#152515] bg-opacity-80 border border-[#4ade80] border-opacity-30 rounded-2xl p-6 mt-6 backdrop-blur-lg shadow-2xl shadow-[#4ade80]/10">
            <h3 class="text-[#4ade80] font-bold mb-4">ПОДСКАЗКИ</h3>
            <div class="space-y-3">
              <div class="flex items-start space-x-2">
                <div class="w-2 h-2 bg-[#4ade80] rounded-full mt-1.5 animate-pulse"></div>
                <p class="text-[#d1fae5] text-sm opacity-90">Используйте Markdown для форматирования</p>
              </div>
              <div class="flex items-start space-x-2">
                <div class="w-2 h-2 bg-[#4ade80] rounded-full mt-1.5 animate-pulse"></div>
                <p class="text-[#d1fae5] text-sm opacity-90">Выделяйте код с помощью ```</p>
              </div>
              <div class="flex items-start space-x-2">
                <div class="w-2 h-2 bg-[#4ade80] rounded-full mt-1.5 animate-pulse"></div>
                <p class="text-[#d1fae5] text-sm opacity-90">Добавляйте теги для лучшего поиска</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const currentUser = ref({ username: 'ForestDev' })
const postTitle = ref('')
const postContent = ref('')
const selectedTag = ref('')

const tags = ['TypeScript', 'JavaScript', 'Python', 'Java', 'C++', 'Go', 'Rust', 'PHP']

const createPost = () => {
  console.log('Создание поста:', {
    title: postTitle.value,
    content: postContent.value,
    tag: selectedTag.value
  })
  router.push('/')
}

const saveDraft = () => {
  console.log('Сохранение черновика')
}
</script>