<script setup>
import { ref, onMounted } from 'vue'
import { useUser } from '../composables/useUser.js'
import ProfileHeader from '../components/profile/ProfileHeader.vue'
import ProfileBanner from '../components/profile/ProfileBanner.vue'
import ProfileAvatar from '../components/profile/ProfileAvatar.vue'
import ProfileInfo from '../components/profile/ProfileInfo.vue'
import ProfileTabs from '../components/profile/ProfileTabs.vue'

const { currentUser, userData, fetchUserData, isAdmin, isDeveloper } = useUser()
const activeButton = ref(0)

onMounted(() => {
  fetchUserData()
})
</script>

<template>
  <div>
    <ProfileHeader />
    <main>
      <ProfileBanner :user-data="userData" />
      <ProfileAvatar :user-data="userData" />
      <ProfileInfo :user-data="userData" :current-user="currentUser" />
      <ProfileTabs 
        :active-button="activeButton" 
        :user-data="userData" 
        :current-user="currentUser"
        :is-admin="isAdmin"
        :is-developer="isDeveloper"
        @set-active-button="activeButton = $event"
      />
    </main>
  </div>
</template>