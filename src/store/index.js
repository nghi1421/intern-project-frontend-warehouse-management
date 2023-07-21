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
    staff: {
      totalPages: 1,
    },
    positions: []
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
    getStaffs({ commit }) {
      return axiosClient.get('/staffs')
        .then((data) => {
          return data;
        })
    },
    getUsers() {
      return axiosClient.get('/users')
        .then((data) => data)
    },
    getPositions({ commit }) {
      return axiosClient.get('/positions')
        .then((data) => {
          commit('setPositions', data.data.positions)
          return data
        })
    },
    createStaff({ commit }, data) {
      return axiosClient
        .post('staffs', data)
        .then((response) => response)
    },
    updateStaff({ commit }, data) {
      return axiosClient
        .put(`/staffs/${data.id}`, data)
        .then((response) => response) 
    },
    deleteStaff({ commit }, staffId) {
      return axiosClient
        .delete(`staffs/${staffId}`)
        .then((response) => response)
    },
    getCategories() {
      return axiosClient.get('/categories')
        .then((response) => response)
    },
    createCategory({ commit }, data) {
      return axiosClient
        .post('categories', data)
        .then((response) => response)
    },
    updateCategory({ commit }, data) {
      return axiosClient
        .put(`/categories/${data.id}`, data)
        .then((response) => response) 
    },
    deleteCategory({ commit }, categoryId) {
      return axiosClient
        .delete(`categories/${categoryId}`)
        .then((response) => response)
    },
    getImports() {
      return axiosClient.get('/imports')
        .then((response) => response)
    },
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
    setPositions: (state, positions) => {
      state.positions = positions;
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