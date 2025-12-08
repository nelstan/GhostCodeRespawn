<template>
    <div
        v-if="isModalOpen"
        class="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50"
        @click.self="closeModal"
    >
        <div class="flex min-h-full items-center justify-center p-4">
            <div
                class="relative w-full max-w-md transform rounded-2xl bg-[#1E1E1E] border border-[#D2EE5B] p-6 shadow-xl"
            >
                <div class="flex items-center justify-between mb-6">
                    <h3 class="text-xl font-exo font-bold text-white">
                        Уведомления
                        <span
                            v-if="unreadCount > 0"
                            class="ml-2 inline-flex items-center justify-center w-6 h-6 text-xs font-bold text-black bg-[#D2EE5B] rounded-full"
                        >
                            {{ unreadCount }}
                        </span>
                    </h3>
                    <div class="flex items-center space-x-2">
                        <button
                            v-if="notifications.length > 0"
                            @click="clearAllNotifications"
                            class="text-sm text-gray-400 hover:text-white transition-colors"
                        >
                            Очистить все
                        </button>
                        <button
                            @click="closeModal"
                            class="text-gray-400 hover:text-white transition-colors"
                        >
                            ✕
                        </button>
                    </div>
                </div>

                <div
                    v-if="notifications.length === 0"
                    class="text-center py-8"
                >
                    <div class="text-gray-400 mb-4">📭</div>
                    <p class="text-gray-400 font-exo">Нет уведомлений</p>
                </div>

                <div
                    v-else
                    class="space-y-4 max-h-[60vh] overflow-y-auto pr-2"
                >
                    <div
                        v-for="notification in notifications"
                        :key="notification.id"
                        :class="[
                            'rounded-lg p-4 border transition-all hover:bg-[#2A2A2A]',
                            notification.read ? 'border-gray-800' : 'border-[#D2EE5B] border-opacity-30 bg-[#2A2A2A]'
                        ]"
                    >
                        <div class="flex items-start justify-between">
                            <div class="flex items-start space-x-3 flex-1">
                                <span class="text-xl mt-1">{{ getTypeIcon(notification.type) }}</span>
                                <div class="flex-1">
                                    <div class="flex items-center justify-between">
                                        <h4
                                            :class="[
                                                'font-exo font-semibold',
                                                notification.read ? 'text-gray-300' : 'text-white'
                                            ]"
                                        >
                                            {{ notification.title }}
                                        </h4>
                                        <span class="text-xs text-gray-500">
                                            {{ formatTime(notification.timestamp) }}
                                        </span>
                                    </div>
                                    <p class="mt-2 text-sm text-gray-400">
                                        {{ notification.message }}
                                    </p>
                                    <div class="mt-3 flex items-center space-x-3">
                                        <button
                                            v-if="!notification.read"
                                            @click.stop="markAsRead(notification.id)"
                                            class="text-xs text-[#D2EE5B] hover:text-[#c5e34a] transition-colors"
                                        >
                                            Отметить прочитанным
                                        </button>
                                        <button
                                            @click.stop="deleteNotification(notification.id)"
                                            class="text-xs text-gray-500 hover:text-red-400 transition-colors"
                                        >
                                            Удалить
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div
                    v-if="notifications.length > 0"
                    class="mt-6 pt-6 border-t border-gray-800"
                >
                    <button
                        @click="markAllAsRead"
                        class="w-full py-2 bg-[#2A2A2A] text-gray-300 rounded-lg hover:bg-[#3A3A3A] transition-colors font-exo"
                    >
                        Отметить все как прочитанные
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { useNotificationStore } from '@/stores/notificationStore'

const store = useNotificationStore()

// Доступ к реактивному состоянию
const notifications = store.notifications
const unreadCount = store.unreadCount
const isModalOpen = store.isModalOpen

// Методы
const closeModal = store.closeModal
const markAsRead = store.markAsRead
const markAllAsRead = store.markAllAsRead
const deleteNotification = store.deleteNotification
const clearAllNotifications = store.clearAllNotifications

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
    const now = new Date()
    const diff = now - date
    
    if (diff < 60000) return 'только что'
    if (diff < 3600000) return `${Math.floor(diff / 60000)} мин назад`
    if (diff < 86400000) return `${Math.floor(diff / 3600000)} ч назад`
    
    return date.toLocaleDateString()
}
</script>

<style scoped>
::-webkit-scrollbar {
    width: 6px;
}

::-webkit-scrollbar-track {
    background: #2A2A2A;
    border-radius: 3px;
}

::-webkit-scrollbar-thumb {
    background: #D2EE5B;
    border-radius: 3px;
}
</style>