import axios from "axios";
import store from "./store";
import router from "./router";
import { useToast } from "vue-toast-notification";
import "vue-toast-notification/dist/theme-sugar.css";

const toast = useToast();

const baseUrlApi = 'http://localhost:8000/api'

const axiosClient = axios.create({
    baseURL: baseUrlApi,
    responseType: 'blob',
})

axiosClient.interceptors.request.use(config => {
  config.headers.Authorization = `Bearer ${store.state.user.token}`
  return config;
})

axiosClient.interceptors.response.use(response => {
  
  return response;
}, error => {
  if (error.response.status === 401) {
    sessionStorage.removeItem('TOKEN')
    sessionStorage.removeItem('NAME')
    sessionStorage.removeItem('ROLE')
    sessionStorage.removeItem('PERMISSIONS')
    router.push({name: 'Login'})
  }
  else if (error.response.status === 403) {
   router.push({name: 'Not found'})
  }
  else if (error.response.status === 404) {
    router.push({name: 'NotFound'})
  }
  else {
    toast.error(error.response.data.message);
  }
  return Promise.reject(error);
})

export default axiosClient;