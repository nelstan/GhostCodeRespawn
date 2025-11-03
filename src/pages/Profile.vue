<script setup>
import { ref, onMounted, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import notificationItem from '/src/assets/1.png'
import userAvatar from '/src/assets/авапрофиль.png'
import bannerItem from '/src/assets/баннер.png'
import logo from '/src/assets/лого.png'
import messageItem from '/src/assets/смс.png'
import friendsItem from '/src/assets/други.png'

const router = useRouter();
const activeButton = ref(0);
const buttons = ['Информационный', 'Koнтeнт', 'Cтатистика', 'Управление ролями'];
const currentUser = ref(null);
const userData = ref(null);
const roleManagement = ref({
  searchUsername: '',
  selectedRole: 'user',
  availableRoles: [
    { value: 'user', label: 'Обычный юзер' },
    { value: 'premium', label: 'Премиум-юзер' },
    { value: 'beta-tester', label: 'Бета-тестер' },
    { value: 'developer', label: 'Разработчик' },
    { value: 'admin', label: 'Админ' }
  ],
  searchResult: null,
  loading: false,
  message: ''
});

const avatarFile = ref(null);
const headerFile = ref(null);
const avatarPreview = ref(null);
const headerPreview = ref(null);
const uploadingAvatar = ref(false);
const uploadingHeader = ref(false);

const isAdmin = computed(() => {
  const role = (userData.value?.role || currentUser.value?.role || '').toString().toLowerCase().trim();
  return role === 'admin';
});

const isDeveloper = computed(() => {
  const role = (userData.value?.role || currentUser.value?.role || '').toString().toLowerCase().trim();
  return role === 'developer' || role === 'admin';
});

watch([userData, currentUser], () => {
  console.log('User data updated:', {
    userData: userData.value,
    currentUser: currentUser.value,
    isAdmin: isAdmin.value,
    isDeveloper: isDeveloper.value
  });
}, { deep: true, immediate: true });

const saveAuthData = (token, refreshToken, userData) => {
  localStorage.setItem('accessToken', token);
  if (refreshToken) {
    localStorage.setItem('refreshToken', refreshToken);
  }
  localStorage.setItem('currentUser', JSON.stringify(userData));
};

const refreshAccessToken = async () => {
  try {
    const refreshToken = localStorage.getItem('refreshToken');
    if (!refreshToken) {
      throw new Error('No refresh token');
    }

    const response = await fetch('/api/tokens/refresh', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ token: refreshToken })
    });

    if (!response.ok) {
      throw new Error('Token refresh failed');
    }

    const data = await response.json();
    localStorage.setItem('accessToken', data.newJwt);
    localStorage.setItem('refreshToken', data.newRefresh);
    return data.newJwt;
  } catch (err) {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('currentUser');
    router.push('/login');
    return null;
  }
};

const apiRequest = async (url, options = {}) => {
  let token = localStorage.getItem('accessToken');
  
  const config = {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    credentials: 'include'
  };

  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }

  let response = await fetch(url, config);

  if (response.status === 401) {
    const newToken = await refreshAccessToken();
    if (newToken) {
      config.headers['Authorization'] = `Bearer ${newToken}`;
      response = await fetch(url, config);
    }
  }

  return response;
};

const fetchUserData = async (userId = null) => {
  try {
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      currentUser.value = JSON.parse(storedUser);
    }

    if (!userId) {
      if (currentUser.value?.name) {
        userData.value = currentUser.value;
      }
      return;
    }

    const encodedUserId = encodeURIComponent(userId);
    const response = await apiRequest(`/api/accounts/getData/${encodedUserId}`);
    
    if (response.ok) {
      const data = await response.json();
      if (!userId) {
        currentUser.value = {
          ...currentUser.value,
          ...data.data
        };
        localStorage.setItem('currentUser', JSON.stringify(currentUser.value));
      }
      userData.value = data.data;
    } else {
      console.warn('User not found or error fetching user data:', response.status);
    }
  } catch (error) {
    console.error('Error fetching user data:', error);
  }
};

const searchUser = async () => {
  if (!roleManagement.value.searchUsername.trim()) return;

  roleManagement.value.loading = true;
  roleManagement.value.message = '';
  roleManagement.value.searchResult = null;

  try {
    const encodedUsername = encodeURIComponent(roleManagement.value.searchUsername);
    const response = await apiRequest(`/api/accounts/getData/${encodedUsername}`);
    
    if (response.ok) {
      const data = await response.json();
      roleManagement.value.searchResult = {
        username: roleManagement.value.searchUsername,
        ...data.data
      };
      roleManagement.value.message = 'Пользователь найден';
    } else {
      roleManagement.value.message = 'Пользователь не найден';
    }
  } catch (error) {
    roleManagement.value.message = 'Ошибка поиска пользователя';
    console.error('Search error:', error);
  } finally {
    roleManagement.value.loading = false;
  }
};

const updateUserRole = async () => {
  if (!roleManagement.value.searchResult) return;

  roleManagement.value.loading = true;
  roleManagement.value.message = '';

  try {
    const response = await apiRequest('/api/accounts/updateRole', {
      method: 'POST',
      body: JSON.stringify({
        targetUsername: roleManagement.value.searchResult.username,
        newRole: roleManagement.value.selectedRole
      })
    });

    if (response.ok) {
      const data = await response.json();
      roleManagement.value.message = 'Роль успешно обновлена';
      roleManagement.value.searchResult.role = roleManagement.value.selectedRole;
    } else {
      roleManagement.value.message = 'Ошибка обновления роли';
    }
  } catch (error) {
    roleManagement.value.message = 'Ошибка обновления роли';
    console.error('Role update error:', error);
  } finally {
    roleManagement.value.loading = false;
  }
};

const handleAvatarSelect = (event) => {
  const file = event.target.files[0];
  if (file) {
    if (file.size > 5 * 1024 * 1024) {
      alert('Файл слишком большой. Максимальный размер: 5MB');
      return;
    }
    if (!file.type.startsWith('image/')) {
      alert('Пожалуйста, выберите изображение');
      return;
    }
    
    avatarFile.value = file;
    const reader = new FileReader();
    reader.onload = (e) => {
      avatarPreview.value = e.target.result;
    };
    reader.readAsDataURL(file);
  }
};

const handleHeaderSelect = (event) => {
  const file = event.target.files[0];
  if (file) {
    if (file.size > 5 * 1024 * 1024) {
      alert('Файл слишком большой. Максимальный размер: 5MB');
      return;
    }
    if (!file.type.startsWith('image/')) {
      alert('Пожалуйста, выберите изображение');
      return;
    }
    
    headerFile.value = file;
    const reader = new FileReader();
    reader.onload = (e) => {
      headerPreview.value = e.target.result;
    };
    reader.readAsDataURL(file);
  }
};

const uploadAvatar = async () => {
  if (!avatarFile.value) return;

  uploadingAvatar.value = true;
  try {
    const formData = new FormData();
    formData.append("file", avatarFile.value);

    const token = localStorage.getItem('accessToken');
    const response = await fetch('/api/content/uploadAvatar', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: formData
    });

    if (response.ok) {
      const data = await response.json();
      userData.value.avatarLink = data.link;
      if (currentUser.value) {
        currentUser.value.avatarLink = data.link;
        localStorage.setItem('currentUser', JSON.stringify(currentUser.value));
      }
      avatarFile.value = null;
      avatarPreview.value = null;
      alert('Аватар успешно обновлен!');
    } else {
      const errorText = await response.text();
      console.error('Avatar upload failed:', response.status, errorText);
      alert('Ошибка загрузки аватара. Попробуйте еще раз.');
    }
  } catch (error) {
    console.error('Avatar upload error:', error);
    alert('Ошибка загрузки аватара. Проверьте соединение.');
  } finally {
    uploadingAvatar.value = false;
  }
};

const uploadHeader = async () => {
  if (!headerFile.value) return;

  uploadingHeader.value = true;
  try {
    const formData = new FormData();
    formData.append("file", headerFile.value);

    const token = localStorage.getItem('accessToken');
    const response = await fetch('/api/content/uploadHeader', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: formData
    });

    if (response.ok) {
      const data = await response.json();
      userData.value.headerLink = data.link;
      if (currentUser.value) {
        currentUser.value.headerLink = data.link;
        localStorage.setItem('currentUser', JSON.stringify(currentUser.value));
      }
      headerFile.value = null;
      headerPreview.value = null;
      alert('Шапка профиля успешно обновлена!');
    } else {
      const errorText = await response.text();
      console.error('Header upload failed:', response.status, errorText);
      alert('Ошибка загрузки шапки профиля. Попробуйте еще раз.');
    }
  } catch (error) {
    console.error('Header upload error:', error);
    alert('Ошибка загрузки шапки профиля. Проверьте соединение.');
  } finally {
    uploadingHeader.value = false;
  }
};

const setActiveButton = (index) => {
  activeButton.value = index;
};

onMounted(() => {
  const storedUser = localStorage.getItem('currentUser');
  if (storedUser) {
    currentUser.value = JSON.parse(storedUser);
    userData.value = currentUser.value;
  }
});
</script>

<template>
	<header>
		<div class="w-[1920px] h-[47px] border border-[#242627] rounded-b-lg">
			<div class="relative">
        <router-link to='/GhostCode'>
				<img
					:src="logo"
					alt="logo"
					class="ml-[250px] absolute mt-[7px] w-[35px] h-[35px]"
				/>
        </router-link>
			</div>
			<div>
				<input
					class="w-[250px] text-center ml-[315px] mt-[9px] bg-[#202020] font-exo rounded-[25px] outline-none"
					type="text"
					placeholder="Что ищите в царстве теней?"
				/>
			</div>
			<div>
				<button class="absolute">
					<img
						:src="messageItem"
						alt="messageItem"
						class="w-[25px] h-[25px] ml-[1541px] mt-[-22px]"
					/>
				</button>
			</div>
			<div>
				<button class="absolute">
					<img
						:src="notificationItem"
						alt="notificationItem"
						class="w-[40px] h-[40px] ml-[1571px] mt-[-28px]"
					/>
				</button>
			</div>
			<button>
				<img
					:src="userAvatar"
					alt="userAvatar"
					class="absolute w-[29px] h-[29px] ml-[1630px] mt-[-42px]"
				/>
			</button>
		</div>
	</header>
	<main>
		<div class="relative">
			<img
				v-if="headerPreview || userData?.headerLink"
				:src="headerPreview || (userData?.headerLink ? `/api/content/link/headers/${userData.headerLink}` : bannerItem)"
				alt="bannerItem"
				class="absolute ml-[250px] mt-[45px] rounded-[5px] w-[1420px] h-[200px] object-cover"
			/>
			<img
				v-else
				:src="bannerItem"
				alt="bannerItem"
				class="absolute ml-[250px] mt-[45px] rounded-[5px] w-[1420px] h-[200px]"
			/>
			<input
				type="file"
				accept="image/*"
				@change="handleHeaderSelect"
				class="absolute ml-[250px] mt-[45px] w-[1420px] h-[200px] opacity-0 cursor-pointer"
			/>
			<button
				v-if="headerFile"
				@click="uploadHeader"
				:disabled="uploadingHeader"
				class="absolute ml-[1650px] mt-[220px] bg-[#D2EE5B] text-black px-4 py-2 rounded-lg font-exo font-semibold disabled:opacity-50"
			>
				{{ uploadingHeader ? 'Загрузка...' : 'Сохранить шапку' }}
			</button>
		</div>

		<div class="relative">
			<img
				v-if="avatarPreview || userData?.avatarLink"
				:src="avatarPreview || (userData?.avatarLink ? `/api/content/link/avatars/${userData.avatarLink}` : userAvatar)"
				alt="userAvatar"
				class="absolute w-[130px] h-[130px] ml-[430px] mt-[250px] rounded-full object-cover"
			/>
			<img
				v-else
				:src="userAvatar"
				alt="userAvatar"
				class="absolute w-[130px] h-[130px] ml-[430px] mt-[250px] rounded-full"
			/>
			<input
				type="file"
				accept="image/*"
				@change="handleAvatarSelect"
				class="absolute w-[130px] h-[130px] ml-[430px] mt-[250px] rounded-full opacity-0 cursor-pointer"
			/>
			<button
				v-if="avatarFile"
				@click="uploadAvatar"
				:disabled="uploadingAvatar"
				class="absolute ml-[570px] mt-[350px] bg-[#D2EE5B] text-black px-4 py-2 rounded-lg font-exo font-semibold disabled:opacity-50"
			>
				{{ uploadingAvatar ? 'Загрузка...' : 'Сохранить аватар' }}
			</button>
		</div>

		<div class="relative">
			<p
				class="bg-gradient-to-r from-[#FF7096] to-[#FF8FAB] bg-clip-text text-transparent text-[24px] ml-[589px] font-exo font-semibold mt-[306px] absolute"
			>
				{{ userData?.name || currentUser?.username || 'Nelstan' }}
			</p>
		</div>
    <div>
      <p class='text-[#8B8B8B] font-exo font-semibold text-[14px] absolute ml-[695px] mt-[317px]'>В сети</p>
    </div>
    <div class="bg-[#C50909] rounded-[100px] w-[6px] h-[6px] ml-[745px] mt-[326px] absolute"></div>
		<div>
			<p class="font-exo mt-[351px] ml-[588px] text-[16px] font-semibold absolute">
				<span class="text-[#FFFFFF]">143k</span>
				<span class='text-[#D2EE5B] ml-2'>Фолловеров</span>
			</p>
		</div>
    	<div>
			  <p class="font-exo mt-[351px] ml-[773px] text-[16px] font-semibold absolute">
				<span class="text-[#FFFFFF]">100</span>
				<span class='text-[#D2EE5B] ml-2'>Подписок</span>
			  </p>
		</div>
    <div>
      <p class="font-exo mt-[351px] ml-[900px] text-[16px] font-semibold absolute">
        <span class="text-[#FFFFFF]">{{ userData?.role || currentUser?.role || 'user' }}</span>
        <span class='text-[#D2EE5B] ml-2'>Роль</span>
      </p>
    </div>
    <div>
      <button class='w-[150px] h-[30px] bg-[#D2EE5B] border-[#819723] rounded-[5px] font-exo text-[15px] font-semibold absolute ml-[1283px] mt-[327px]'>Отслеживать</button>
    </div>
    <button>
      <div class='absolute'>
      <img :src="messageItem" 
      alt="messageItem" 
      class='w-[25px] h-[25px] ml-[1452px] mt-[312px]'
      >
      </div>
    </button>
    <button>
      <div class='absolute'>
      <img :src="friendsItem" 
      alt="friendsItem" 
      class='w-[32px] h-[32px] ml-[1485px] mt-[309px]'
      >
      </div>
    </button>

    <div class="absolute ml-[250px] mt-[400px] w-[1420px] bg-[#1A1A1A] rounded-lg p-6 font-exo text-white">
      <div class="flex space-x-8 mb-6">
        <button
          v-for="(button, index) in buttons"
          :key="index"
          @click="setActiveButton(index)"
          :class="[
            'px-6 py-2 rounded-lg transition-all duration-300 font-semibold',
            activeButton === index 
              ? 'bg-[#D2EE5B] text-gray-900'
              : 'bg-[#2A2A2A] text-white hover:bg-[#333333]'
          ]"
        >
          {{ button }}
        </button>
      </div>

      <div v-if="activeButton === 0" class="space-y-4">
        <div>
          <h2 class="text-[#D2EE5B] text-xl font-bold mb-2"># {{ userData?.name || currentUser?.username || 'Nelstan' }}</h2>
          <p class="text-gray-300"><strong class="text-white">Stack</strong>: Vue.js Tailwind TS </p>
          <p class="text-gray-300"><strong class="text-white">Grade</strong>: Junior Front-End Developer</p>
          <p class="text-gray-300"><strong class="text-white">Role</strong>: {{ userData?.role || currentUser?.role || 'user' }}</p>
        </div>
        
        <div class="border-t border-gray-600 pt-4">
          <h3 class="text-white text-lg font-bold mb-3">Кодер</h3>
          <ul class="space-y-2">
            <li class="text-gray-300"><strong class="text-white">Пишу в Visual Studio Code </strong></li>
            <li class="text-gray-300"><strong class="text-white">Разработчик уже около 3-х лет.</strong></li>
          </ul>
        </div>

        <div class="border-t border-gray-600 pt-4">
          <h3 class="text-white text-lg font-bold mb-3">Обозначение</h3>
          <p class="text-gray-300 leading-relaxed">
            Был тип программист. Слесарь, подрабатывал в красном белом.<br>
            В свободное время играл в тетрис, дженгу.<br>
            Детей нет, разведён.
          </p>
        </div>
      </div>

      <div v-if="activeButton === 1" class="text-gray-300">
        <h2 class="text-white text-xl font-bold mb-4">Koнтент</h2>
        <p>Содержимое контента будет здесь...</p>
      </div>

      <div v-if="activeButton === 2" class="text-gray-300">
        <h2 class="text-white text-xl font-bold mb-4">Cтатистика</h2>
        <p>Статистические данные будут здесь...</p>
      </div>

      <div v-if="activeButton === 3 && (isAdmin || isDeveloper)" class="text-gray-300">
        <h2 class="text-white text-xl font-bold mb-4">Управление ролями</h2>
        <p class="text-[#D2EE5B] mb-4">Доступ разрешен (Ваша роль: {{ userData?.role || currentUser?.role }})</p>
        
        <div class="bg-[#2A2A2A] p-4 rounded-lg mb-4">
          <div class="flex items-center space-x-4 mb-4">
            <input
              v-model="roleManagement.searchUsername"
              type="text"
              placeholder="Введите имя пользователя"
              class="bg-[#1A1A1A] text-white px-4 py-2 rounded-lg flex-1 focus:outline-none focus:ring-2 focus:ring-[#D2EE5B]"
              @keyup.enter="searchUser"
            />
            <button
              @click="searchUser"
              :disabled="roleManagement.loading"
              class="bg-[#D2EE5B] text-gray-900 px-6 py-2 rounded-lg font-semibold hover:bg-[#c5e04f] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {{ roleManagement.loading ? 'Поиск...' : 'Найти' }}
            </button>
          </div>

          <div v-if="roleManagement.searchResult" class="bg-[#1A1A1A] p-4 rounded-lg mb-4">
            <h3 class="text-white font-semibold mb-2">Найден пользователь:</h3>
            <p><strong>Имя:</strong> {{ roleManagement.searchResult.name || roleManagement.searchResult.username }}</p>
            <p><strong>Текущая роль:</strong> {{ roleManagement.searchResult.role }}</p>
            
            <div class="flex items-center space-x-4 mt-4">
              <select
                v-model="roleManagement.selectedRole"
                class="bg-[#2A2A2A] text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D2EE5B]"
              >
                <option 
                  v-for="role in roleManagement.availableRoles" 
                  :key="role.value" 
                  :value="role.value"
                  :disabled="role.value === 'admin' && !isAdmin"
                >
                  {{ role.label }}
                </option>
              </select>
              
              <button
                @click="updateUserRole"
                :disabled="roleManagement.loading || roleManagement.searchResult.role === roleManagement.selectedRole"
                class="bg-[#D2EE5B] text-gray-900 px-6 py-2 rounded-lg font-semibold hover:bg-[#c5e04f] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {{ roleManagement.loading ? 'Обновление...' : 'Обновить роль' }}
              </button>
            </div>
          </div>

          <div v-if="roleManagement.message" class="mt-4 p-3 rounded-lg" :class="roleManagement.message.includes('Ошибка') ? 'bg-red-500/20 text-red-300' : 'bg-green-500/20 text-green-300'">
            {{ roleManagement.message }}
          </div>
        </div>

        <div class="bg-[#2A2A2A] p-4 rounded-lg">
          <h3 class="text-white font-semibold mb-3">Доступные роли:</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-2">
            <div v-for="role in roleManagement.availableRoles" :key="role.value" class="flex items-center space-x-2">
              <div class="w-3 h-3 rounded-full" :class="{
                'bg-green-500': role.value === 'user',
                'bg-blue-500': role.value === 'premium', 
                'bg-purple-500': role.value === 'beta-tester',
                'bg-yellow-500': role.value === 'developer',
                'bg-red-500': role.value === 'admin'
              }"></div>
              <span class="text-white">{{ role.label }}</span>
            </div>
          </div>
        </div>
      </div>

      <div v-else-if="activeButton === 3" class="text-center py-8">
        <p class="text-red-400 text-lg">Доступ запрещен</p>
        <p class="text-gray-400 mt-2">У вас недостаточно прав для управления ролями</p>
        <p class="text-gray-400">Ваша роль: {{ userData?.role || currentUser?.role || 'user' }}</p>
        <p class="text-gray-400">Требуется: admin или developer</p>
      </div>
    </div>
      
	</main>
</template>