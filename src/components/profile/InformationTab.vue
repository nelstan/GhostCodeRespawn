<template>
	<div :class="mobile ? 'text-sm' : ''">
		<div>
			<h2
				:class="
					mobile
						? 'text-[#D2EE5B] text-lg font-bold mb-2'
						: 'text-[#D2EE5B] text-xl font-bold mb-2'
				"
			>
				# {{ userData?.name || currentUser?.username || 'Nelstan' }}
			</h2>
			<p class="text-gray-300">
				<strong class="text-white">Stack</strong>: Vue.js Tailwind TS
			</p>
			<p class="text-gray-300">
				<strong class="text-white">Grade</strong>: Junior Front-End Developer
			</p>
			<p class="text-gray-300">
				<strong class="text-white">Role</strong>:
				{{ userData?.role || currentUser?.role || 'user' }}
			</p>
		</div>

		<div class="border-t border-gray-600 pt-4">
			<h3
				:class="
					mobile
						? 'text-white font-bold mb-3'
						: 'text-white text-lg font-bold mb-3'
				"
			>
				Кодер
			</h3>
			<ul class="space-y-2">
				<li class="text-gray-300">
					<strong class="text-white">Пишу в Visual Studio Code </strong>
				</li>
				<li class="text-gray-300">
					<strong class="text-white">Разработчик уже около 3-х лет.</strong>
				</li>
			</ul>
		</div>

		<div class="border-t border-gray-600 pt-4">
			<h3
				:class="
					mobile
						? 'text-white font-bold mb-3'
						: 'text-white text-lg font-bold mb-3'
				"
			>
				Обозначение
			</h3>
			<p
				:class="
					mobile
						? 'text-gray-300 leading-relaxed text-xs'
						: 'text-gray-300 leading-relaxed'
				"
			>
				Был тип программист. Слесарь, подрабатывал в красном белом.<br />
				В свободное время играл в тетрис, дженгу.<br />
				Детей нет, разведён.
			</p>
		</div>
	</div>
</template>

<script setup>
defineProps({
	userData: Object,
	currentUser: Object,
	mobile: Boolean,
})
</script>
