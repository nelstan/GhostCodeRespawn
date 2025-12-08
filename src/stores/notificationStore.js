import { ref } from 'vue'

// Глобальное хранилище уведомлений
const notifications = ref([])
const unreadCount = ref(0)
const isModalOpen = ref(false)

export function useNotificationStore() {
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
        
        // Показываем тост
        const event = new CustomEvent('show-notification-toast', {
            detail: newNotification
        })
        window.dispatchEvent(event)
    }

    // Уведомление о лайке на пост
    const notifyPostLiked = (likerUsername, postTitle, postAuthorUsername) => {
        // Проверяем, что уведомление для автора поста (не для себя)
        const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}')
        if (currentUser.username === likerUsername) return
        
        addNotification({
            title: 'Новый лайк!',
            message: `${likerUsername} поставил(а) лайк вашему посту "${postTitle}"`,
            type: 'success'
        })
    }

    // Уведомление о комментарии
    const notifyCommentAdded = (commenterUsername, postTitle, commentText, postAuthorUsername) => {
        // Проверяем, что уведомление для автора поста (не для себя)
        const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}')
        if (currentUser.username === commenterUsername) return
        
        const truncatedComment = commentText.length > 50 
            ? commentText.substring(0, 50) + '...' 
            : commentText
        
        addNotification({
            title: 'Новый комментарий',
            message: `${commenterUsername} прокомментировал(а) ваш пост "${postTitle}": "${truncatedComment}"`,
            type: 'info'
        })
    }

    // Уведомление о новом подписчике
    const notifyNewFollower = (followerUsername) => {
        addNotification({
            title: 'Новый подписчик',
            message: `${followerUsername} подписался(ась) на вас`,
            type: 'warning'
        })
    }

    // Уведомление об упоминании в комментарии
    const notifyMentionedInComment = (commenterUsername, postTitle, commentText) => {
        const truncatedComment = commentText.length > 50 
            ? commentText.substring(0, 50) + '...' 
            : commentText
        
        addNotification({
            title: 'Вас упомянули',
            message: `${commenterUsername} упомянул(а) вас в комментарии к посту "${postTitle}": "${truncatedComment}"`,
            type: 'info'
        })
    }

    // Уведомление о новом посте от подписки
    const notifyNewPostFromSubscription = (authorUsername, postTitle) => {
        addNotification({
            title: 'Новый пост',
            message: `${authorUsername} опубликовал(а) новый пост: "${postTitle}"`,
            type: 'info'
        })
    }

    // Уведомление о системном событии
    const notifySystemEvent = (title, message, type = 'info') => {
        addNotification({
            title,
            message,
            type
        })
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

    // Загружаем уведомления при инициализации
    loadNotifications()

    return {
        // Состояние
        notifications,
        unreadCount,
        isModalOpen,
        
        // Основные методы
        addNotification,
        markAsRead,
        markAllAsRead,
        deleteNotification,
        clearAllNotifications,
        loadNotifications,
        openModal,
        closeModal,
        toggleModal,
        
        // Специальные методы для уведомлений
        notifyPostLiked,
        notifyCommentAdded,
        notifyNewFollower,
        notifyMentionedInComment,
        notifyNewPostFromSubscription,
        notifySystemEvent
    }
}