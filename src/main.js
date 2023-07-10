import './assets/main.css'
import './index.css'

import store from './store'
import router from './router'
import { createApp } from 'vue'
import App from './App.vue'
import toast from 'vue-toast-notification';
import 'vue-toast-notification/dist/theme-bootstrap.css';

createApp(App)
    .use(store)
    .use(toast)
    .use(router)
    .mount('#app')
