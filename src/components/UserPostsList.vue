<script setup>
import PostsComponents from '@/components/PostsComponents.vue'
import { onMounted, ref, watch } from 'vue'

const userPosts = ref([])
const postsGap = ref('space-y-12')

const loadUserPosts = () => {
	const storedPosts = localStorage.getItem('userPosts')
	if (storedPosts) {
		userPosts.value = JSON.parse(storedPosts)
	}
}

onMounted(() => {
	loadUserPosts()
})

watch(
	() => localStorage.getItem('userPosts'),
	() => {
		loadUserPosts()
	}
)
</script>

<template>
	<div>
		<div v-if="userPosts.length > 0" :class="postsGap" class="[&>*]:mb-0">
			<PostsComponents v-for="post in userPosts" :key="post.id" :post="post" />
		</div>
		<div v-else class="text-center text-gray-500 mt-8 font-exo py-8">
			Пока нет созданных постов. Будьте первым!
		</div>
	</div>
</template>
