import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    component: () => import('@/pages/home.vue'),
  },
  {
    path: '/tree',
    component: () => import('@/pages/tree/index.vue'),
  },
  {
    path: '/flow',
    component: () => import('@/pages/flow/index.vue'),
  },
  {
    path: '/dag',
    component: () => import('@/pages/dag/index.vue'),
  },
];

const router = createRouter({
  history: createWebHashHistory(), // history 模式则使用 createWebHistory()
  routes,
});
export default router;
