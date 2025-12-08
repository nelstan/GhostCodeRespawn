<template>
  <div class="bg-[#111111] min-h-screen">
    <SnowAnimation />
    <RecoveryCodeModal 
      v-if="showRecoveryCode"
      :recoveryCode="recoveryCode"
      @close="closeRecoveryCode"
    />
    
    <NotificationModal />
    <NotificationToast />
    
    <transition name="fade">
      <div v-if="showContent">
        <Header @toggle-notifications="notificationStore.toggleModal()" />
        
        <div class="pt-[60px] flex justify-between px-[250px]">
          <MainContent 
            :posts="posts"
            @post-created="handlePostCreated"
            @like-post="handleLikePost"
            @comment-post="handleCommentPost"
          />
          <userLeftMain />
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import NotificationModal from '@/components/NotificationModal.vue'
import NotificationToast from '@/components/NotificationToast.vue'
import userLeftMain from '@/components/userLeftMain.vue'
import Header from './components/Header.vue'
import MainContent from './components/MainContent.vue'
import RecoveryCodeModal from './components/RecoveryCodeModal.vue'
import SnowAnimation from './components/SnowAnimation.vue'
import { useGhostCode } from './composables/useGhostCode'

const { 
  showContent,
  showRecoveryCode,
  recoveryCode,
  posts,
  notificationStore,
  handlePostCreated,
  handleLikePost,
  handleCommentPost,
  closeRecoveryCode
} = useGhostCode()
</script>

<style>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>