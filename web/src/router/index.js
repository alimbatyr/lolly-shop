import Vue from 'vue';
import VueRouter from 'vue-router';
import store from '../store';

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    name: 'Home',
    meta: { layout: 'main' },
    component: () => import('../views/Home.vue'),
  },
  {
    path: '/login',
    name: 'Login',
    meta: { layout: 'main' },
    component: () => import('../views/Login.vue'),
  },
  {
    path: '/products',
    name: 'Products',
    meta: { layout: 'main', show_sidebar: true },
    component: () => import('../views/Products.vue'),
  },
  {
    path: '/product/:id',
    name: 'Product',
    meta: { layout: 'main', show_sidebar: true },
    component: () => import('../views/Product.vue'),
  },
  {
    path: '/cart',
    name: 'Cart',
    meta: { layout: 'main' },
    component: () => import('../views/Cart.vue'),
  },
  {
    path: '/product-create',
    name: 'ProductCreate',
    meta: { layout: 'main', is_admin: true },
    component: () => import('../views/ProductCreate.vue'),
  },
  {
    path: '/product-edit/:id',
    name: 'ProductEdit',
    meta: { layout: 'main', is_admin: true },
    component: () => import('../views/ProductEdit.vue'),
  },
  {
    path: '/admin',
    name: 'Admin',
    meta: { layout: 'main', is_admin: true },
    component: () => import('../views/Admin.vue'),
  },
];

const router = new VueRouter({
  mode: 'history',
  routes,
});

// router guard
router.beforeEach(async (to, from, next) => {
  const is_admin = to.matched.some(record => record.meta.is_admin);
  if (is_admin) {
    try {
      const is_verified = await store.dispatch('verify_token');
      if (!is_verified) {
        next('/login');
      }
      next();
    } catch (error) {
      next('/login');
    }
  } else {
    next();
  }
});

export default router;
