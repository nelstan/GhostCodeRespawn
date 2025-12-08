// Утилита для работы с черновиками постов

const DRAFT_KEY = 'draftPost'

export const draftStorage = {
    // Сохранить черновик
    saveDraft(data) {
        const draftData = {
            ...data,
            savedAt: new Date().toISOString()
        }
        sessionStorage.setItem(DRAFT_KEY, JSON.stringify(draftData))
        return draftData
    },
    
    // Получить черновик
    getDraft() {
        const draft = sessionStorage.getItem(DRAFT_KEY)
        return draft ? JSON.parse(draft) : null
    },
    
    // Очистить черновик
    clearDraft() {
        sessionStorage.removeItem(DRAFT_KEY)
    },
    
    // Проверить наличие черновика
    hasDraft() {
        const draft = this.getDraft()
        return !!(draft && (draft.title || draft.content || draft.hashtags))
    },
    
    // Получить время сохранения черновика
    getDraftTime() {
        const draft = this.getDraft()
        return draft ? new Date(draft.savedAt) : null
    },
    
    // Форматировать время сохранения
    formatDraftTime() {
        const time = this.getDraftTime()
        if (!time) return ''
        
        const now = new Date()
        const diffMs = now - time
        const diffMins = Math.floor(diffMs / 60000)
        
        if (diffMins < 1) return 'только что'
        if (diffMins < 60) return `${diffMins} мин назад`
        
        const diffHours = Math.floor(diffMins / 60)
        if (diffHours < 24) return `${diffHours} ч назад`
        
        return time.toLocaleDateString()
    }
}