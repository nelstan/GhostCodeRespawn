import { ref, computed } from 'vue'

export function useUser() {
  const currentUser = ref(null)
  const userData = ref(null)


  const fetchUserData = async () => {
  
    userData.value = { 
      name: 'Nelstan', 
      role: 'Admin',
      avatarLink: null,
      headerLink: null
    }
    currentUser.value = { 
      username: 'Nelstan', 
      role: 'Developer',
      avatarLink: null,
      headerLink: null
    }
    
  
    localStorage.setItem('currentUser', JSON.stringify(currentUser.value))
  }

  const isAdmin = computed(() => {
    const role = (userData.value?.role || currentUser.value?.role || '').toString().toLowerCase().trim()
    return role === 'admin'
  })

  const isDeveloper = computed(() => {
    const role = (userData.value?.role || currentUser.value?.role || '').toString().toLowerCase().trim()
    return role === 'developer' || role === 'admin'
  })

  return {
    currentUser,
    userData,
    fetchUserData,
    isAdmin,
    isDeveloper
  }
}