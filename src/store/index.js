import { createStore } from "vuex";
import axiosClient from "../axios";
import axiosCustom from "../axiosCustom";

const store = createStore({
  state: {
    user: {
      data: {
        id: sessionStorage.getItem('ID'),
        name: sessionStorage.getItem('NAME'),
        role: sessionStorage.getItem('ROLE'),
        permissions: sessionStorage.getItem('PERMISSIONS')
      },
      token: sessionStorage.getItem("TOKEN"),
    },
    staff: {
      totalPages: 1,
    },

    providers: [],
    positions: [],
    categories: [],
    warehouseBranches: [],
    locations: [],
    roles: [],
    permissions: [],
  },
  getters: {},
  actions: {
    login({ commit }, credential) {
      return axiosClient.post('/login', credential)
        .then(({data}) => {
          commit('setName', data.staff_information);
          commit('setStaffId', data.staff_information);
          commit('setPermissions', data.permissions);
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
    changePassword(context, data) {
      return axiosClient.post('/change-password', data)
        .then((response) => response);
    },
    getStaffs() {
      return axiosClient.get('/staffs')
        .then((data) => {
          return data;
        })
    },
    searchStaff(context) {
      return axiosClient.get(`/staffs/${context.state.user.data.id}`)
        .then((response) => response)
    },
    getUsers() {
      return axiosClient.get('/users')
        .then((data) => data)
    },
    searchAccount(context, searchTerm) {
      return axiosClient.get(`/users?search=${searchTerm}`)
        .then((data) => data)
    },
    createAccount(context, data) {
      return axiosClient
        .post('/users', data)
        .then((response) => response)
    },
    showAccount(context, data) {
      return axiosClient
        .get(`users/${data}`)
        .then((response) => response)
    },
    updateAccount(context, data) {
      return axiosClient
        .put(`/users/${data.id}`, data)
        .then((response) => response) 
    },
    deleteAccount(context, staffId) {
      return axiosClient
        .delete(`users/${staffId}`)
        .then((response) => response)
    },
    getAllPositions({ commit }) {
      return axiosClient.get('/positions')
        .then((data) => {
          commit('setPositions', data.data.positions)
          return data
        })
    },
    createStaff(context, data) {
      return axiosClient
        .post('staffs', data)
        .then((response) => response)
    },
    updateStaff(context, data) {
      return axiosClient
        .put(`/staffs/${data.id}`, data)
        .then((response) => response) 
    },
    deleteStaff(context, staffId) {
      return axiosClient
        .delete(`staffs/${staffId}`)
        .then((response) => response)
    },
    getCategories(context) {
      return axiosClient.get('/categories')
        .then((response) => response)
    },
    getAllCategories({ commit }) {
      return axiosClient.get('/categories/?no_pagination=1')
        .then((response) => {
          commit('setCategories', response.data)
          return response
        })
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
        .delete(`/categories/${categoryId}`)
        .then((response) => response)
    },
    getImports() {
      return axiosClient.get('/imports')
        .then((response) => response)
    },
    createImport({ commit }, data) {
      return axiosClient
        .post('/imports', data)
        .then((response) => response)
    },
    updateImport({ commit }, data) {
      return axiosClient
        .put(`/imports/${data.id}`, data)
        .then((response) => response) 
    },
    deleteImport({ commit }, importId) {
      return axiosClient
        .delete(`/imports/${importId}`)
        .then((response) => response)
    },
    getExports() {
      return axiosClient.get('/exports')
        .then((response) => response)
    },
    createExport({ commit }, data) {
      return axiosClient
        .post('/exports', data)
        .then((response) => response)
    },
    updateExport({ commit }, data) {
      return axiosClient
        .put(`/exports/${data.id}`, data)
        .then((response) => response) 
    },
    deleteExport({ commit }, exportId) {
      return axiosClient
        .delete(`/exports/${exportId}`)
        .then((response) => response)
    },
    getAllProviders({ commit }) {
      return axiosClient
        .get(`providers/?no_pagination=1`)
        .then((response) => {
          commit('setProviders', response.data.data)
          return response
        })
    },
    getProviders() {
      return axiosClient.get('/providers')
        .then((response) => response)
    },
    createProvider({ commit }, data) {
      return axiosClient
        .post('/providers', data)
        .then((response) => response)
    },
    updateProvider({ commit }, data) {
      return axiosClient
        .put(`/providers/${data.id}`, data)
        .then((response) => response) 
    },
    deleteProvider({ commit }, providerId) {
      return axiosClient
        .delete(`/providers/${providerId}`)
        .then((response) => response)
    },
    getAllWarehouseBranches({ commit }) {
      return axiosClient
        .get(`warehouse-branches/?no_pagination=1`)
        .then((response) => {
          commit('setWarehouseBranches', response.data.data)
          return response
        })
    },
    getWarehouseBranches() {
      return axiosClient.get('/warehouse-branches')
        .then((response) => response)
    },
    createWarehouseBranch({ commit }, data) {
      return axiosClient
        .post('/warehouse-branches', data)
        .then((response) => response)
    },
    updateWarehouseBranch({ commit }, data) {
      return axiosClient
        .put(`/warehouse-branches/${data.id}`, data)
        .then((response) => response) 
    },
    deleteWarehouseBranch({ commit }, warehouseBranchId) {
      return axiosClient
        .delete(`/warehouse-branches/${warehouseBranchId}`)
        .then((response) => response)
    },
    getAllLocations({ commit }) {
      return axiosClient
        .get(`locations/?no_pagination=1`)
        .then((response) => {
          commit('setLocations', response.data.data)
          return response
        })
    },
    getLocations() {
      return axiosClient.get('/locations')
        .then((response) => response)
    },
    createLocation({ commit }, data) {
      return axiosClient
        .post('/locations', data)
        .then((response) => response)
    },
    updateLocation({ commit }, data) {
      return axiosClient
        .put(`/locations/${data.id}`, data)
        .then((response) => response) 
    },
    deleteLocation({ commit }, locationId) {
      return axiosClient
        .delete(`/locations/${locationId}`)
        .then((response) => response)
    },
    getPositions() {
      return axiosClient.get('/positions')
        .then((response) => response)
    },
    createPosition({ commit }, data) {
      return axiosClient
        .post('/positions', data)
        .then((response) => response)
    },
    updatePosition({ commit }, data) {
      return axiosClient
        .put(`/positions/${data.id}`, data)
        .then((response) => response) 
    },
    deletePosition({ commit }, positionId) {
      return axiosClient
        .delete(`/positions/${positionId}`)
        .then((response) => response)
    },
    getStocks() {
      return axiosClient.get('/stocks')
        .then((response) => response)
    },
    updateStock({ commit }, data) {
      return axiosClient
        .put(`/stocks/${data.id}`, data)
        .then((response) => response) 
    },
    deleteStock({ commit }, stockId) {
      return axiosClient
        .delete(`/locations/${stockId}`)
        .then((response) => response)
    },
    getImportPDF({ commit }, importId) {
      console.log(importId)
      return axiosCustom
        .get(`/pdf/import/${importId}`)
        .then((response) => response)
    },
    getExportPDF({ commit }, exportId) {
      console.log(exportId)
      return axiosCustom
        .get(`/pdf/export/${exportId}`)
        .then((response) => response)
    },
    getAllRoles({ commit }) {
      return axiosClient.get('/roles')
        .then((response) => {
          commit('setAllRoles', response.data)
          return response
        })
    },
    getAllPermissions({ commit }) {
      return axiosClient.get('/permissions')
        .then((response) => {
          commit('setAllPermissions', response.data)
          return response
        })
    }
  },
  mutations: {
    setName: (state, staffInformation) => {
      state.user.data = { ...state.user.data, name: staffInformation.name };
      sessionStorage.setItem('NAME', staffInformation.name); 
      sessionStorage.setItem('BRANCH_ID', staffInformation.warehouse_branch_id);
    },
    setStaffId: (state, staffInformation) => {
      state.user.data = { ...state.user.data, id: staffInformation.id };
      sessionStorage.setItem('ID', staffInformation.id);
    },
    setToken: (state, token) => {
      state.user.token = token;
      sessionStorage.setItem('TOKEN', token);
    },
    setRole: (state, role) => {
      state.user.data = { ...state.user.data, role: role };
      sessionStorage.setItem('ROLE', role);
    },
    setAllRoles: (state, roles) => {
      state.roles = roles;
    },
    setAllPermissions: (state, permissions) => {
      state.permissions = permissions ;
    },
    setPermissions: (state, permissions) => {
      state.user.data = { ...state.user.data, permissions: JSON.stringify(permissions)};
      sessionStorage.setItem('PERMISSIONS', JSON.stringify(permissions) );
    },
    setPositions: (state, positions) => {
      state.positions = positions;
    },
    setProviders: (state, providers) => {
      state.providers = providers;
    },
    setWarehouseBranches: (state, warehouseBranches) => {
      state.warehouseBranches = warehouseBranches;
    },
    setCategories: (state, categories) => {
      state.categories = categories;
    },
    setLocations: (state, locations) => {
      state.locations = locations;
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