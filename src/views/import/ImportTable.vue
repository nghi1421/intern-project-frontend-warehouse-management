<script setup>
import store from "../../store";
import { ref, onMounted, watch, onUnmounted } from "vue";
import Table from "@/components/table/Table.vue";
import CreateImportModal from "./CreateImportModal.vue";
import ConfirmModal from "@/components/ConfirmModal.vue";
import EditImportModal from "./EditImportModal.vue";
import { useToast } from "vue-toast-notification";
import "vue-toast-notification/dist/theme-sugar.css";
import EditIcon from "@/components/icons/EditIcon.vue";
import DeleteIcon from "@/components/icons/DeleteIcon.vue";
import SearchIcon from "@/components/icons/Search.vue";
import PDFIcon from "@/components/icons/PDFIcon.vue";
import eventClient from "../../eventClient.js";
import { useRouter, useRoute } from "vue-router";

const toast = useToast();

const router = useRouter();

const route = useRoute();

const columns = ref([
  {
    key: "id",
    value: "Import ID",
    sortable: true,
    searchable: true,
  },
  {
    key: "staff_name",
    value: "Created by",
    sortable: true,
    searchable: false,
  },
  {
    key: "provided_from",
    value: "Provided from",
    sortable: true,
    searchable: false,
  },
  {
    key: "warehouse_branch_name",
    value: "Warehouse branch name",
    sortable: true,
    searchable: false,
  },
  {
    key: "status",
    value: "Status",
    sortable: true,
    searchable: false,
  },
  {
    key: "created_at",
    value: "Create at",
    sortable: true,
    searchable: false,
  },
  {
    key: "updated_at",
    value: "Update  at",
    sortable: true,
    searchable: false,
  },
]);

const params = ref({
  page: 1,
  search: "",
  sort_field: "id",
  sort_direction: "asc",
  search_columns: ["id"],
});

const staffInformation = ref({});

const rows = ref([]);

const meta = ref({});

const links = ref([]);

const selectedImport = ref({});

const isOpenCreateModal = ref(false);

const isOpenEditModal = ref(false);

const isOpenConfirmModal = ref(false);

const loading = ref(true);

const permissions = JSON.parse(store.state.user.data.permissions);

const searchImport = ref("");

watch(searchImport, (newValue) => {
  params.value = { ...params.value, search: newValue };
  if (newValue.length === 0) {
    params.value.page = 1;
    router.push({ path: "/imports", query: params.value });
    fetchImortsData(params.value);
  }
});

function sortTable(query) {
  params.value = {
    ...params.value,
    sort_field: query.sortField,
    sort_direction: query.sortDirection,
  };
  router.push({ path: "/imports", query: params.value });
  fetchImortsData(params.value);
}

function fetchSearchImport() {
  params.value.page = 1;
  router.push({ path: "/imports", query: params.value });

  fetchImortsData(params.value);
}

function checkPermissions(permissionList) {
  return permissions.some(
    (permission) => permissionList.indexOf(permission.name) != -1
  );
}

function closeModal() {
  isOpenCreateModal.value = false;
  isOpenEditModal.value = false;
  isOpenConfirmModal.value = false;
  selectedImport.value = null;
}

function openCreateModal() {
  if (loading.value) {
    toast.info("Please wait for loading page.");
  } else {
    isOpenCreateModal.value = true;
  }
}

function openEditModal(row) {
  if (loading.value) {
    toast.info("Please wait for loading page.");
  } else {
    isOpenEditModal.value = true;
    selectedImport.value = row;
  }
}

function openConfirmModal(row) {
  isOpenConfirmModal.value = true;
  selectedImport.value = row;
}

function fetchCurrentUser() {
  store.dispatch("searchStaff").then((response) => {
    if (response.status === 200) {
      staffInformation.value = response.data.data;
    }
  });
}

function fetchImortsData(query) {
  loading.value = true;
  store.dispatch("getImports", query).then((response) => {
    meta.value = response.data.meta;

    links.value = response.data.meta.links;

    rows.value = response.data.data;

    loading.value = false;
  });
}

function fetchProvidersData() {
  store.dispatch("getAllProviders").then((response) => response);
}

function fetchWarehouseBranchesData() {
  store.dispatch("getAllWarehouseBranches").then((response) => response);
}

function fetchCategoriesData() {
  store
    .dispatch("getAllCategories")
    .then((response) => response)
    .finally(() => (loading.value = false));
}

function deleteImport() {
  return store
    .dispatch("deleteImport", selectedImport.value.id)
    .then((response) => {
      if (response.status === 200) {
        toast.success(response.data.message);
        return true;
      } else {
        toast.error(response.data.message);
        return false;
      }
    });
}

function fetchImportPDF(importId) {
  return store.dispatch("getImportPDF", importId).then((response) => {
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute(
      "download",
      `import-${importId}-${new Date().toISOString()}-.pdf`
    );
    document.body.appendChild(link);
    link.click();
  });
}

onMounted(() => {
  params.value = { ...params.value, ...route.query };
  fetchImortsData(params.value);
  fetchCurrentUser();
  fetchProvidersData();
  fetchWarehouseBranchesData();
  fetchCategoriesData();
  eventClient.on("change-page", (pageNumber) => {
    params.value.page = pageNumber;
    router.push({ path: "/imports", query: params.value });
    fetchProvidersData(params.value);
  });
});

onUnmounted(() => {
  eventClient.off("change-page");
});
</script>
<template>
  <CreateImportModal
    :is-open="isOpenCreateModal"
    :closeModal="closeModal"
    :staff="staffInformation"
  >
  </CreateImportModal>
  <EditImportModal
    :is-open="isOpenEditModal"
    :closeModal="closeModal"
    :importData="selectedImport"
  >
  </EditImportModal>
  <ConfirmModal
    :is-open="isOpenConfirmModal"
    :close-modal="closeModal"
    :submit="deleteImport"
  >
    <template v-slot:header> Are your sure? </template>
    <template v-slot:message> Delete import information! </template>
  </ConfirmModal>
  <div class="flex align-items-between items-center justify-between px-4 py-2">
    <h1
      class="text-2xl font-bold tracking-tight text-gray-950 sm:text-3xl"
      style="line-height: inherit"
    >
      Import
    </h1>
    <button
      v-if="checkPermissions(['manage-import'])"
      type="button"
      @click="openCreateModal"
      class="rounded-md m-2 duration-75 a bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-opacity-80 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75"
    >
      Create import
    </button>
  </div>

  <div class="px-4 py-2 mb-4 flex align-items-center gap-2">
    <div
      class="left-4 w-80 flex justify-end rounded-lg shadow-sm ring-1 transition duration-75 text-gray-400 bg-white focus-within:ring-2 ring-gray-950/10 focus-within:ring-primary-600"
    >
      <div class="m-auto ps-2">
        <SearchIcon class="text-gray-400" />
      </div>
      <input
        class="py-2 px-1 text-black rounded-lg flex-1"
        type="text"
        v-model="searchImport"
        placeholder="Search by import id"
      />
      <button
        @click="fetchSearchImport"
        type="button"
        class="rounded-md duration-75 a bg-primary-600 px-3 text-sm font-medium text-white hover:bg-opacity-80 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75"
      >
        Search
      </button>
    </div>
  </div>

  <Table
    :columns="columns"
    :rows="rows"
    :meta="meta"
    :links="links"
    @sortTable="sortTable"
    :loading="loading"
  >
    <template v-slot:actions="{ row }">
      <button
        @click="openEditModal(row)"
        class="p-1 overflow-hidden hover:opacity-60 bg-success-600 rounded-3xl text-white whitespace-nowrap"
      >
        <EditIcon />
      </button>

      <button
        @click="openConfirmModal(row)"
        v-if="checkPermissions(['manage-import'])"
        class="p-1 ms-2 overflow-hidden hover:opacity-60 bg-danger-600 rounded-xl text-white whitespace-nowrap"
      >
        <DeleteIcon />
      </button>
      <button
        v-if="checkPermissions(['manage-import', 'manage-branch-import'])"
        @click="fetchImportPDF(row.id)"
        class="p-1 ms-2 overflow-hidden hover:opacity-60 bg-warning-600 rounded-xl text-white whitespace-nowrap"
      >
        <PDFIcon />
      </button>
    </template>
  </Table>
</template>
