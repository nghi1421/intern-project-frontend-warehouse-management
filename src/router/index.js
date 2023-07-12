import { createRouter, createWebHistory } from "vue-router";
import store from "../store";
import Dashboard from '../views/Dashboard.vue';
import UserTable from '../views/UserTable.vue';
import Login from '../views/Login.vue';
import StaffTable from '../views/StaffTable.vue'
const routes = [
  {
    path: '/',
    name: 'Dashboard',
    component: Dashboard,
    meta: { requiresAuth: true },
    children: [
        {
          path: '/users',
          name: 'User',
          component: UserTable,
          meta: { requiresAuth: true },
        },
        {
          path: '/staffs',
          name: 'Staff',
          component: StaffTable,
          meta: { requiresAuth: true },
        }
    ]
  },
  {
    path: '/login',
    name: 'Login',
    component: Login,
    meta: {isGuest: true},
  },
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