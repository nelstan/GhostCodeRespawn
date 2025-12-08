<template>
    <Transition name="slide-fade">
        <div
            v-if="notification"
            class="fixed top-4 right-4 z-[9999] w-80"
        >
            <div
                class="rounded-lg border p-4 shadow-lg backdrop-blur-sm bg-[#1E1E1E] border-[#D2EE5B] border-opacity-50"
            >
                <div class="flex items-start justify-between">
                    <div class="flex items-start space-x-3">
                        <span class="text-lg">{{ getTypeIcon(notification.type) }}</span>
                        <div class="flex-1">
                            <h4 class="font-exo font-semibold text-white">
                                {{ notification.title }}
                            </h4>
                            <p class="mt-1 text-sm text-gray-200">
                                {{ notification.message }}
                            </p>
                            <p class="mt-2 text-xs text-gray-300">
                                {{ formatTime(notification.timestamp) }}
                            </p>
                        </div>
                    </div>
                    <button
                        @click="close"
                        class="ml-2 text-gray-300 hover:text-white"
                    >
                        ✕
                    </button>
                </div>
            </div>
        </div>
    </Transition>
</template>

<script setup>
import { onMounted, onUnmounted, ref } from 'vue'

const notification = ref(null)
const timer = ref(null)

const getTypeIcon = (type) => {
    const icons = {
        info: 'ℹ️',
        warning: '⚠️',
        danger: '🚨',
        success: '✅',
        error: '❌'
    }
    return icons[type] || '📢'
}

const formatTime = (timestamp) => {
    if (!timestamp) return ''
    const date = new Date(timestamp)
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

const close = () => {
    notification.value = null
    if (timer.value) {
        clearTimeout(timer.value)
    }
}

const handleNotification = (event) => {
    notification.value = event.detail
    if (timer.value) {
        clearTimeout(timer.value)
    }
    timer.value = setTimeout(close, 5000)
}

onMounted(() => {
    window.addEventListener('show-notification-toast', handleNotification)
})

onUnmounted(() => {
    window.removeEventListener('show-notification-toast', handleNotification)
    if (timer.value) {
        clearTimeout(timer.value)
    }
})
</script>

<style scoped>
.slide-fade-enter-active {
    transition: all 0.3s ease-out;
}

.slide-fade-leave-active {
    transition: all 0.3s cubic-bezier(1, 0.5, 0.8, 1);
}

.slide-fade-enter-from,
.slide-fade-leave-to {
    transform: translateX(20px);
    opacity: 0;
}
</style>