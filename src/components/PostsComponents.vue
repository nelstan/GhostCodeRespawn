<script setup>
import avatarUser from '@/assets/ава.png'
import zakrep from '@/assets/закреп.png'
import comment from '@/assets/коммент.png'
import repost from '@/assets/репосты.png'
import tritoki from '@/assets/три токи.png'
import { computed, onMounted, ref } from 'vue'
import CommentsComponents from './CommentsComponents.vue'

const props = defineProps({
	post: {
		type: Object,
		default: () => ({}),
	},
	index: {
		// Добавляем пропс для индекса поста
		type: Number,
		default: 0,
	},
})

const currentUser = ref(null)
const isLiked = ref(false)
const showPulse = ref(false)
const showComments = ref(false)
const newComment = ref('')
const comments = ref([])

// Убираем фиксированные позиции и используем margin для отступов
const postMargin = ref({
	marginTop: 'mt-4', // Отступ между постами
})

const commentPosition = ref({
	left: 'ml-[380px]',
})

const toggleLiked = () => {
	isLiked.value = !isLiked.value

	if (isLiked.value) {
		showPulse.value = true
		setTimeout(() => {
			showPulse.value = false
		}, 600)
	}
}

const toggleComments = () => {
	showComments.value = !showComments.value
}

const addComment = () => {
	if (!newComment.value.trim()) return

	const commentData = {
		id: Date.now(),
		text: newComment.value,
		author: {
			username: currentUser.value?.username || 'Аноним',
			avatar: avatarUser,
		},
		createdAt: new Date().toISOString(),
		isAdmin: currentUser.value?.role === 'admin',
	}

	comments.value.push(commentData)
	newComment.value = ''

	saveCommentsToStorage()
}

const saveCommentsToStorage = () => {
	if (props.post.id) {
		const postComments = JSON.parse(
			localStorage.getItem('postComments') || '{}'
		)
		postComments[props.post.id] = comments.value
		localStorage.setItem('postComments', JSON.stringify(postComments))
	}
}

const loadCommentsFromStorage = () => {
	if (props.post.id) {
		const postComments = JSON.parse(
			localStorage.getItem('postComments') || '{}'
		)
		comments.value = postComments[props.post.id] || []
	}
}

onMounted(() => {
	const userData = localStorage.getItem('currentUser')
	if (userData) {
		currentUser.value = JSON.parse(userData)
	}
	loadCommentsFromStorage()
})

const displayRole = computed(() => {
	const userRole = props.post.author?.role || currentUser.value?.role || 'user'
	const roles = [
		{ value: 'user', label: 'Пользователь' },
		{ value: 'premium', label: 'Премиум' },
		{ value: 'admin', label: 'Админ' },
	]
	const roleConfig = roles.find(role => role.value === userRole)
	return roleConfig?.label || 'Пользователь'
})

const formatDate = dateString => {
	const date = new Date(dateString)
	const now = new Date()
	const diffTime = Math.abs(now - date)
	const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

	if (diffDays === 1) return 'сегодня'
	if (diffDays === 2) return 'вчера'
	if (diffDays <= 7) return `${diffDays - 1} день назад`

	return date.toLocaleDateString('ru-RU')
}

const authorName = computed(() => {
	return (
		props.post.author?.username ||
		currentUser.value?.username ||
		currentUser.value.username
	)
})

const commentsCount = computed(() => comments.value.length)
</script>

<template>
	<div :class="postMargin.marginTop">
		<!-- Добавляем отступ здесь -->
		<div
			class="w-[1052px] h-[290px] rounded-[25px] border border-[#819723] ml-[380px] relative"
		>
			<div class="flex items-start pt-[20px] pl-[20px]">
				<img :src="avatarUser" alt="avatar" class="w-10 h-10" />
				<div class="ml-[15px]">
					<div class="flex items-baseline">
						<p
							class="text-[16px] bg-clip-text text-transparent bg-gradient-to-r from-[#FF7096] to-[#FF8FAB] font-exo font-[600]"
						>
							{{ authorName }}
						</p>
						<p class="text-[#878787] font-bold text-[13px] ml-2">
							· {{ formatDate(post.createdAt || new Date()) }}
						</p>
					</div>
					<p class="text-[#D2EE5B] font-exo text-sm">
						{{ displayRole }}
					</p>
				</div>
				<div class="ml-auto flex items-center pr-[20px]">
					<router-link
						to="/profile"
						class="w-[140px] h-[34px] rounded-[20px] bg-[#D2EE5B] flex items-center justify-center font-exo text-sm"
					>
						Вы подписаны
					</router-link>
					<div class="flex items-center ml-4">
						<img :src="zakrep" alt="pinned" class="w-5 h-5" />
						<img :src="tritoki" alt="tritoki" class="ml-2 w-[3px] h-[11px]" />
					</div>
				</div>
			</div>

			<div class="mt-1 px-[20px] absolute">
				<h3 class="text-white font-bold">
					{{ post.title || 'GhostCode - платформа анонимного кода' }}
				</h3>
				<p class="text-white font-exo mt-2 whitespace-pre-line">
					{{ post.content || `Революционная платформа для анонимного размещения
					и совместной работы над кодом.<br />
					Поддерживает все популярные языки программирования, имеет встроенную
					систему ревью кода и<br />
					возможность создания анонимных форков проектов...` }}
				</p>

				<button
					v-if="post.hashtags"
					class="bg-clip-text text-transparent bg-gradient-to-r from-[#0095FF] to-[#006EBD] border border-[#0095FF] rounded-[15px] px-3 py-1 mt-3 text-sm"
				>
					{{ post.hashtags }}
				</button>

				<div class="flex items-center gap-8 mt-4">
					<button
						@click="toggleLiked"
						class="relative transition-all duration-300 hover:scale-110 focus:outline-none flex items-center justify-center"
						:class="isLiked ? 'text-red-500' : 'text-gray-400'"
					>
						<div
							v-if="showPulse"
							class="absolute inset-0 bg-red-500 rounded-full animate-ping opacity-60"
						></div>

						<svg
							class="w-[25px] h-[25px] ml-[5px] transition-all duration-300"
							:class="[
								isLiked
									? 'fill-current scale-110'
									: 'fill-none stroke-current stroke-2',
							]"
							viewBox="0 0 24 24"
						>
							<path
								d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
							/>
						</svg>
					</button>

					<button
						@click="toggleComments"
						class="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
					>
						<img
							:src="comment"
							alt="comment"
							class="cursor-pointer w-[25px] h-[25px]"
						/>
						<span class="font-exo text-sm">{{ commentsCount }}</span>
					</button>

					<img
						:src="repost"
						alt="repost"
						class="cursor-pointer w-[25px] h-[25px]"
					/>
				</div>
			</div>
		</div>

		<div
			v-if="post.id && showComments"
			class="bg-[#191919] rounded-[20px] p-4 w-[1052px] ml-[380px] mt-4"
		>
			<div class="flex justify-between items-center mb-4">
				<h3 class="font-exo text-white font-[600] text-[16px]">
					Комментарии ({{ commentsCount }})
				</h3>
			</div>

			<div v-if="comments.length > 0" class="space-y-4 mb-4">
				<div
					v-for="comment in comments"
					:key="comment.id"
					class="flex items-start space-x-3"
				>
					<img
						:src="comment.author.avatar"
						alt="avatar"
						class="w-8 h-8 rounded-full"
					/>
					<div class="flex-1">
						<div class="flex items-baseline">
							<p class="font-exo text-white font-[600] text-[14px]">
								{{ comment.author.username }}
							</p>
							<p class="font-exo text-[#878787] text-[12px] ml-2">
								· {{ formatDate(comment.createdAt) }}
							</p>
						</div>
						<p class="font-exo text-white text-[14px] mt-1 whitespace-pre-wrap">
							{{ comment.text }}
						</p>
					</div>
				</div>
			</div>

			<div class="mt-4">
				<textarea
					v-model="newComment"
					placeholder="Напишите комментарий..."
					class="w-full bg-[#2A2A2A] rounded-xl p-4 font-exo text-white text-[14px] resize-none focus:outline-none focus:ring-2 focus:ring-[#D2EE5B]"
					rows="3"
					maxlength="500"
				></textarea>

				<div class="flex justify-between items-center mt-2">
					<span class="font-exo text-[13px] text-[#878787]">
						{{ newComment.length }}/500
					</span>

					<button
						@click="addComment"
						:disabled="!newComment.trim()"
						class="bg-[#D2EE5B] text-black font-exo font-[600] text-[14px] px-6 py-2 rounded-xl hover:bg-[#c5e04a] disabled:opacity-50 disabled:cursor-not-allowed"
					>
						Отправить
					</button>
				</div>
			</div>
		</div>

		<CommentsComponents v-if="!post.id" class="mt-4 ml-[618px]" />
	</div>
</template>
