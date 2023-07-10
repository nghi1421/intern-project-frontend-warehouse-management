import { createRouter, createWebHistory } from "vue-router";
import store from "../store";
import HomeComponent from '../views/HomeComponent.vue';
import Login from '../views/Login.vue';
const routes = [
  {
    path: '/',
    name: 'Home',
    component: HomeComponent,
    meta: { requiresAuth: true },
  },
  {
    path: '/login',
    name: 'Login',
    component: Login,
    meta: {isGuest: true},
  }

];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  if (to.meta.requiresAuth && !store.state.user.token) {
    next({ name: "Login" });
  } else if (store.state.user.token && to.meta.isGuest) {
    next({ name: "Home" });
  } else {
    next();
  }
});

export default router;