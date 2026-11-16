import { createRouter, createWebHistory } from 'vue-router'
import BeautyMainScreen from '@/views/BeautyMainScreen.vue'
import HowToFindUsSection from '@/views/HowToFindUsSection.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'BeautyMainScreen',
      component: BeautyMainScreen
    },
    {
      path: '/how-to-find-us',
      name: 'HowToFindUsSection',
      component: HowToFindUsSection
    }
  ],
})

export default router
