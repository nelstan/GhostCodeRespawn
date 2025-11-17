<script setup>
import userAvatar from '@/assets/qwerty.png'
import AdminAvatar from '@/assets/ава.png'
import { computed, ref } from 'vue'

const newComment = ref('')
const commentsHidden = ref(false)
const comments = ref([
	{
		id: 1,
		avatar: userAvatar,
		username: 'userTest',
		time: '2 часа назад',
		text: 'Получилось очень классно, так держать! Этот продукт взорвет все чарты! ТГК-@dllcommunity',
		isAdmin: false,
	},
	{
		id: 2,
		avatar: AdminAvatar,
		username: 'AdminTest',
		time: '2 часа назад',
		text: 'Получилось очень классно, так держать! Этот продукт взорвет все чарты! ТГК-@dllcommunity',
		isAdmin: true,
	},
])

const commentsCount = computed(() => comments.value.length)
const charCount = computed(() => newComment.value.length)
const maxChars = 500

const addComment = () => {
	if (!newComment.value.trim()) return

	const newId = comments.value.length + 1
	const isAdmin = newId % 2 === 0

	comments.value.push({
		id: newId,
		avatar: isAdmin ? AdminAvatar : userAvatar,
		username: isAdmin ? 'AdminNew' : 'userNew',
		time: 'только что',
		text: newComment.value,
		isAdmin,
	})

	newComment.value = ''
}

const toggleCommentsVisibility = () => {
	commentsHidden.value = !commentsHidden.value
}
</script>

<template>
	<div
		class="w-[1052px] bg-[#191919] rounded-[20px] mt-[0px] mx-auto ml-[379px] p-4"
	>
		<div class="flex justify-between items-center mb-4">
			<div class="flex items-center">
				<h3 class="font-exo text-white font-[600] text-[16px]">Комментарии</h3>
				<span class="font-exo text-[#878787] text-[14px] ml-2">
					({{ commentsCount }})
				</span>
			</div>

			<button
				@click="toggleCommentsVisibility"
				class="font-exo text-[#D2EE5B] text-[14px] hover:underline flex items-center"
			>
				<span v-if="commentsHidden">Показать комментарии</span>
				<span v-else>Скрыть комментарии</span>
			</button>
		</div>

		<div v-if="!commentsHidden">
			<div
				v-for="comment in comments"
				:key="comment.id"
				class="mt-[20px] first:mt-0"
			>
				<img
					:src="comment.avatar"
					alt="avatar"
					class="w-[30px] h-[30px] ml-[20px] mt-[14px] absolute"
					:class="{ 'w-[33px] h-[33px]': comment.isAdmin }"
				/>
				<p
					class="font-exo text-white font-[600] text-[14px] ml-[60px] pt-[10px]"
				>
					{{ comment.username }}
				</p>
				<p
					class="font-exo font-[600] text-[#878787] text-[13px] ml-[140px] -mt-[20px]"
				>
					· {{ comment.time }}
				</p>
				<p
					class="font-exo font-[400] text-white text-[14px] ml-[60px] -mt-[2px] whitespace-pre-wrap break-words"
				>
					{{ comment.text }}
				</p>
			</div>

			<div class="mt-6">
				<textarea
					v-model="newComment"
					placeholder="Напишите комментарий..."
					class="w-full bg-[#2A2A2A] rounded-xl p-4 font-exo text-white text-[14px] resize-none focus:outline-none focus:ring-2 focus:ring-[#D2EE5B] whitespace-pre-wrap"
					rows="4"
					:maxlength="maxChars"
				></textarea>

				<div class="flex justify-between items-center mt-2">
					<span
						class="font-exo text-[13px]"
						:class="
							charCount > maxChars - 50 ? 'text-red-500' : 'text-[#878787]'
						"
					>
						{{ charCount }}/{{ maxChars }}
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

		<div v-else class="text-center py-8">
			<p class="font-exo text-[#878787] text-[14px]">Комментарии скрыты</p>
			<button
				@click="toggleCommentsVisibility"
				class="font-exo text-[#D2EE5B] text-[14px] mt-2 hover:underline"
			>
				Показать комментарии
			</button>
		</div>

		<p
			v-if="!commentsHidden"
			class="font-exo font-[400] text-[14px] text-[#D2EE5B] flex justify-center mt-[20px] cursor-pointer hover:underline"
		>
			Показать еще
		</p>
	</div>
</template>
