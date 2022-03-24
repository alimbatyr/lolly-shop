import Vue from 'vue';
import VueRouter from 'vue-router';

Vue.use(VueRouter);

const routes = [{
  path: '/',
  name: 'Home',
  meta: { layout: 'default' },
  component: () => import('../views/Home.vue'),
}, {
  path: '/login',
  name: 'Login',
  meta: { layout: 'default' },
  component: () => import('../views/Login.vue'),
}, {
  path: '/products',
  name: 'Products',
  meta: { layout: 'main' },
  component: () => import('../views/Products.vue'),
}];

const router = new VueRouter({
  routes,
});

export default router;
