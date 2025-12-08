import CreatePost from '@/pages/CreatePost.vue'
import Enigma from '@/pages/Enigma.vue'
import GhostCode from '@/pages/GhostCode/GhostCode.vue'
import Home from '@/pages/Home.vue'
import Login from '@/pages/Login.vue'
import Main from '@/pages/Main.vue'
import Messages from '@/pages/Messages.vue'
import Profile from '@/pages/Profile.vue'
import Register from '@/pages/Register.vue'
import SinglePostPage from '@/views/SinglePostPage.vue'
import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path: '/register',
    name: 'Register',
    component: Register
  },
  {
    path: '/main',
    name: 'Main',
    component: Main
  },
  {
    path: '/profile',
    name: 'Profile',
    component: Profile
  },
  {
    path: '/messages',
    name: 'Messages',
    component: Messages
  },
  {
    path: '/enigma',
    name: 'Enigma',
    component: Enigma
  },
  {
    path: '/create-post',
    name: 'CreatePost',
    component: CreatePost
  },
  {
    path: '/GhostCode',
    name: 'GhostCode',
    component: GhostCode
  },
  {
    path: '/post/:id',
    name: 'SinglePost',
    component: SinglePostPage,
    props: true
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router