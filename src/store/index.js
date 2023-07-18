import { createStore } from "vuex";
import axiosClient from "../axios";

const store = createStore({
  state: {
    user: {
      data: {
        name: sessionStorage.getItem('NAME'),
        role: sessionStorage.getItem('ROLE')
      },
      token: sessionStorage.getItem("TOKEN"),
    },
    dashboard: {
      loading: false,
      data: {}
    },
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
          commit('setName', data.staff_information);
          commit('setRole', data.role);
          commit('setToken', data.token)
          return data;
        })
    },
    logout({ commit }) {
      return axiosClient.post('/logout')
        .then((data) => {
          commit('logout');

          return data;
        });
    },
    getStaffs() {
      return axiosClient.get('/staffs')
        .then((data) => {
          return data;
        })
    },
    getPositions() {
      return axiosClient.get('/positions')
      .then((data)=> data)
    },
    createStaff({ commit }, data) {
      return axiosClient.post('staffs', data).then((response) => {
        return response;
      })
    }
  },
  mutations: {
    setName: (state, staffInformation) => {
      state.user.data = { ...state.user.data, name: staffInformation.name };
      sessionStorage.setItem('NAME', staffInformation.name);
    },
    setToken: (state, token) => {
      state.user.token = token;
      sessionStorage.setItem('TOKEN', token);
    },
    setRole: (state, role) => {
      state.user.data = { ...state.user.data, role: role };
      sessionStorage.setItem('ROLE', role);
    },
    logout(state) {
      state.user.token = null;
      state.user.data = {};
      sessionStorage.removeItem('TOKEN');
    }
  },
  modules: {},
});

export default store;