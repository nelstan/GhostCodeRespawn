import CreatePost from '@/pages/CreatePost.vue'
import Enigma from '@/pages/Enigma.vue'
import GhostCode from '@/pages/GhostCode.vue'
import Home from '@/pages/Home.vue'
import Login from '@/pages/Login.vue'
import Messages from '@/pages/Messages.vue'
import Profile from '@/pages/Profile.vue'
import Register from '@/pages/Register.vue'
import { createRouter, createWebHistory } from 'vue-router'

const routes = [
	{
		path: '/Messages',
		name: 'Messages',
		component: Messages,
	},
	{
		path: '/',
		name: 'Home',
		component: Home,
	},
	{
		path: '/CreatePost',
		name: 'CreatePost',
		component: CreatePost,
	},
	{
		path: '/Login',
		name: 'Login',
		component: Login,
	},
	{
		path: '/Register',
		name: 'Register',
		component: Register,
	},
	{
		path: '/GhostCode',
		name: 'GhostCode',
		component: GhostCode,
	},
	{
		path: '/Profile',
		name: 'Profile',
		component: Profile,
	},

	{
		path: '/enigma',
		name: 'Enigma',
		component: Enigma,
	},
]

const router = createRouter({
	history: createWebHistory(),
	routes,
})

export default router
