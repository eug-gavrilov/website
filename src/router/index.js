import { createRouter, createWebHistory } from 'vue-router'
import BeautyMainScreen from '@/views/BeautyMainScreen.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'BeautyMainScreen',
      component: BeautyMainScreen
    }
  ],
})

export default router
