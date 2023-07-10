import { createStore } from "vuex";
import axiosClient from "../axios";

const store = createStore({
  state: {
    user: {
      data: {},
      token: sessionStorage.getItem("TOKEN"),
    },
    dashboard: {
      loading: false,
      data: {}
    },
    questionTypes: ["text", "select", "radio", "checkbox", "textarea"],
    notification: {
      show: false,
      type: 'success',
      message: ''
    }
  },
  getters: {},
  actions: {
    login({ commit }, credential) {
      console.log(credential);
      return axiosClient.post('/login', credential)
        .then(({data}) => {
          commit('setStaffInformation', data.staff_information);
          commit('setToken', data.token)
          return data;
        })
    },
  },
  mutations: {
    setStaffInformation: (state, user) => {
      state.user.data = user;
    },
    setToken: (state, token) => {
      state.user.token = token;
      sessionStorage.setItem('TOKEN', token);
    },
  },
  modules: {},
});

export default store;