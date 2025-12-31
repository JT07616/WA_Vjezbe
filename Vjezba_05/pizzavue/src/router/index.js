import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('../components/PizzaList.vue'),
    },
    {
      path: '/pizze/:naziv',
      name: 'pizza-detalji',
      component: () => import('../components/PizzeDetalji.vue'),
    },
  ],
})

export default router
