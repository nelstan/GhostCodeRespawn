import { createWebHistory, createRouter } from "vue-router";
import Home from '@/pages/Home.vue';
import Login from '@/pages/Login.vue';
import Register from '@/pages/Register.vue';
import GhostCode from '@/pages/GhostCode.vue';
import Profile from '@/pages/Profile.vue';
import CreatePost from "@/pages/CreatePost.vue";

const routes = [
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
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;  