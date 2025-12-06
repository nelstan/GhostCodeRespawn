import { ref } from 'vue'

export function useNotifications() {
    const notifications = ref([])
    const unreadCount = ref(0)
    const isModalOpen = ref(false)

    const addNotification = (notification) => {
        const newNotification = {
            ...notification,
            id: Date.now() + Math.random(),
            timestamp: new Date(),
            read: false
        }
        
        notifications.value.unshift(newNotification)
        unreadCount.value++
        
        if (notifications.value.length > 50) {
            notifications.value = notifications.value.slice(0, 50)
        }
        
        localStorage.setItem('notifications', JSON.stringify(notifications.value))
        
        showToast(newNotification)
    }

    const showToast = (notification) => {
        const event = new CustomEvent('show-notification-toast', {
            detail: notification
        })
        window.dispatchEvent(event)
    }

    const markAsRead = (id) => {
        const notification = notifications.value.find(n => n.id === id)
        if (notification && !notification.read) {
            notification.read = true
            unreadCount.value = Math.max(0, unreadCount.value - 1)
            localStorage.setItem('notifications', JSON.stringify(notifications.value))
        }
    }

    const markAllAsRead = () => {
        notifications.value.forEach(notification => {
            if (!notification.read) {
                notification.read = true
            }
        })
        unreadCount.value = 0
        localStorage.setItem('notifications', JSON.stringify(notifications.value))
    }

    const deleteNotification = (id) => {
        const index = notifications.value.findIndex(n => n.id === id)
        if (index !== -1) {
            if (!notifications.value[index].read) {
                unreadCount.value = Math.max(0, unreadCount.value - 1)
            }
            notifications.value.splice(index, 1)
            localStorage.setItem('notifications', JSON.stringify(notifications.value))
        }
    }

    const clearAllNotifications = () => {
        notifications.value = []
        unreadCount.value = 0
        localStorage.removeItem('notifications')
    }

    const loadNotifications = () => {
        const saved = localStorage.getItem('notifications')
        if (saved) {
            notifications.value = JSON.parse(saved)
            unreadCount.value = notifications.value.filter(n => !n.read).length
        }
    }

    const openModal = () => {
        isModalOpen.value = true
        markAllAsRead()
    }

    const closeModal = () => {
        isModalOpen.value = false
    }

    const toggleModal = () => {
        if (isModalOpen.value) {
            closeModal()
        } else {
            openModal()
        }
    }

    loadNotifications()

    return {
        notifications,
        unreadCount,
        isModalOpen,
        addNotification,
        markAsRead,
        markAllAsRead,
        deleteNotification,
        clearAllNotifications,
        loadNotifications,
        openModal,
        closeModal,
        toggleModal
    }
}