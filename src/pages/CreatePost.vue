<script setup>
import PostHashtags from '@/components/Posts/PostHashtags.vue'
import PostInside from '@/components/Posts/PostInside.vue'
import PostName from '@/components/Posts/PostName.vue'
import PostPublic from '@/components/Posts/PostPublic.vue'
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import HeaderGhostCode from './HeaderGhostCode.vue'

const router = useRouter()

const postTitle = ref('')
const postContent = ref('')
const postHashtags = ref('')
const isLoading = ref(false)
const errorMessage = ref('')

// Проверка, можно ли опубликовать пост
const canPublish = computed(() => {
	return postContent.value.trim().length > 0 && !isLoading.value
})

const handleTitleUpdate = title => {
	postTitle.value = title
}

const handleContentUpdate = content => {
	postContent.value = content
}

const handleHashtagsUpdate = hashtags => {
	postHashtags.value = hashtags
}

// Функция для локального создания поста
const createPostLocally = () => {
	const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}')
	const newPost = {
		id: Date.now().toString(),
		authorId: currentUser.id || 'currentUser',
		content: postContent.value,
		title: postTitle.value || 'Без названия',
		hashtags: postHashtags.value,
		createdAt: new Date().toISOString(),
		likes: 0,
		commentsCount: 0,
		author: {
			username: currentUser.username || 'Аноним',
			role: currentUser.role || 'user',
			avatarLink: currentUser.avatarLink || '',
		},
	}

	const existingPosts = JSON.parse(localStorage.getItem('userPosts') || '[]')
	existingPosts.unshift(newPost)
	localStorage.setItem('userPosts', JSON.stringify(existingPosts))

	// Очищаем форму
	postTitle.value = ''
	postContent.value = ''
	postHashtags.value = ''

	console.log('✅ Пост создан локально:', newPost)
	return newPost
}

const handlePostSubmit = async () => {
	if (!canPublish.value) {
		errorMessage.value = 'Содержание поста не может быть пустым'
		return
	}

	isLoading.value = true
	errorMessage.value = ''

	try {
		const postData = {
			content: postContent.value,
		}

		console.log('📤 Отправка поста на сервер:', postData)

		const response = await fetch('/api/posts/create', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(postData),
		})

		console.log('📥 Ответ сервера:', response.status, response.statusText)

		if (response.ok) {
			let createdPost
			try {
				const responseText = await response.text()
				createdPost = responseText ? JSON.parse(responseText) : {}
				console.log('✅ Пост создан на сервере:', createdPost)
			} catch (e) {
				createdPost = { id: Date.now().toString() }
			}

			// Сохраняем пост в localStorage для отображения
			const existingPosts = JSON.parse(
				localStorage.getItem('userPosts') || '[]'
			)
			const currentUser = JSON.parse(
				localStorage.getItem('currentUser') || '{}'
			)

			const newPost = {
				id: createdPost.id || Date.now().toString(),
				authorId: createdPost.authorId || 'currentUser',
				content: postContent.value,
				title: postTitle.value || 'Без названия',
				hashtags: postHashtags.value,
				createdAt: new Date().toISOString(),
				likes: 0,
				commentsCount: 0,
				author: {
					username: currentUser.username || 'Аноним',
					role: currentUser.role || 'user',
					avatarLink: currentUser.avatarLink || '',
				},
			}
			existingPosts.unshift(newPost)
			localStorage.setItem('userPosts', JSON.stringify(existingPosts))

			// Очищаем форму
			postTitle.value = ''
			postContent.value = ''
			postHashtags.value = ''

			// Переходим на главную страницу
			router.push('/')
		} else {
			// Если сервер вернул ошибку, создаем пост локально
			console.log('🔄 Сервер вернул ошибку, создаем пост локально')
			createPostLocally()

			// Переходим на главную страницу
			router.push('/')

			// Показываем информационное сообщение
			errorMessage.value = 'Пост создан локально (сервер временно недоступен)'
			setTimeout(() => {
				errorMessage.value = ''
			}, 3000)
		}
	} catch (error) {
		console.error('❌ Ошибка сети:', error)

		// При ошибке сети тоже создаем пост локально
		console.log('🔄 Ошибка сети, создаем пост локально')
		createPostLocally()

		// Переходим на главную страницу
		router.push('/')

		errorMessage.value = 'Пост создан локально (проблемы с соединением)'
		setTimeout(() => {
			errorMessage.value = ''
		}, 3000)
	} finally {
		isLoading.value = false
	}
}
</script>

<template>
	<div class="mt-[-85px] absolute">
		<HeaderGhostCode />
	</div>

	<div
		class="w-[873px] h-[820px] bg-[#1B1B1B] border border-[#676666] mt-[90px] rounded-[20px] ml-[550px]"
	>
		<div
			class="w-[299px] h-[274px] bg-[#9AFE81] absolute rounded-full opacity-[5%] blur-[80px] animate-float1"
		></div>
		<div
			class="w-[299px] h-[274px] bg-[#9AFE81] absolute rounded-full opacity-[5%] blur-[80px] ml-[450px] mt-[500px] animate-float2"
		></div>
		<div
			class="text-[#FFFFFF] font-exo text-[20px] ml-[332px] mt-[16px] text-shadow-lg"
		>
			<p>Создание поста</p>
		</div>
		<div class="w-[873px] h-[1px] bg-[#9AFE81] mt-[15px]"></div>

		<PostName @title-update="handleTitleUpdate" />

		<PostInside @content-update="handleContentUpdate" />

		<PostHashtags @hashtags-update="handleHashtagsUpdate" />

		<div v-if="errorMessage" class="text-red-500 text-center mt-4 font-exo">
			{{ errorMessage }}
		</div>

		<PostPublic
			@post-submit="handlePostSubmit"
			:isLoading="isLoading"
			:disabled="!canPublish"
		/>
	</div>
</template>

<style>
@keyframes float1 {
	0%,
	100% {
		transform: translate(0, 0) rotate(0deg);
	}
	25% {
		transform: translate(50px, 30px) rotate(90deg);
	}
	50% {
		transform: translate(20px, 60px) rotate(180deg);
	}
	75% {
		transform: translate(-30px, 40px) rotate(270deg);
	}
}

@keyframes float2 {
	0%,
	100% {
		transform: translate(0, 0) rotate(0deg);
	}
	33% {
		transform: translate(-40px, 20px) rotate(120deg);
	}
	66% {
		transform: translate(30px, -30px) rotate(240deg);
	}
}

.animate-float1 {
	animation: float1 8s ease-in-out infinite;
}

.animate-float2 {
	animation: float2 10s ease-in-out infinite;
}
</style>
