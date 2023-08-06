import { createRouter, createWebHistory } from "vue-router";
import store from "../store";
import Dashboard from '../views/Dashboard.vue';
import UserTable from '../views/user/UserTable.vue';
import Login from '../views/Login.vue';
import StaffTable from '../views/staff/StaffTable.vue'
import CategoryTable from '../views/category/CategoryTable.vue'
import ImportTable from '../views/import/ImportTable.vue'
import ProviderTable from '../views/provider/ProviderTable.vue'
import WarehouseBranchTable from '../views/warehouse-branch/WarehouseBranchTable.vue'
import LocationTable from '../views/location/LocationTable.vue'
import StockTable from '../views/stock/StockTable.vue'

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
        },
        {
          path: '/categories',
          name: 'Category',
          component: CategoryTable,
          meta: { requiresAuth: true },
        },
        {
          path: '/imports',
          name: 'Import',
          component: ImportTable,
          meta: { requiresAuth: true },
        },
        {
          path: '/providers',
          name: 'Provider',
          component: ProviderTable,
          meta: { requiresAuth: true },
        },
        {
          path: '/warehouse-branches',
          name: 'WarehouseBranch',
          component: WarehouseBranchTable,
          meta: { requiresAuth: true },
        },
        {
          path: '/locations',
          name: 'Locations',
          component: LocationTable,
          meta: { requiresAuth: true },
        },
        {
          path: '/stocks',
          name: 'Stock',
          component: StockTable,
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