<script setup>
import store from "../../store";
import { ref, onMounted } from "vue";
import Table from "@/components/table/Table.vue";
import CreateExportModal from "./CreateExportModal.vue";
import ConfirmModal from "@/components/ConfirmModal.vue";
import EditExportModal from "./EditExportModal.vue";
import { useToast } from "vue-toast-notification";
import "vue-toast-notification/dist/theme-sugar.css";

const toast = useToast();

const columns = ref([
  {
    key: "id",
    value: "Export ID",
  },
  {
    key: "staff_name",
    value: "Created by",
  },
  {
    key: "warehouse_branch_name",
    value: "Warehouse branch name",
  },
  {
    key: "status",
    value: "status",
  },
  {
    key: "created_at",
    value: "create at",
  },
  {
    key: "updated_at",
    value: "updated  at",
  },
]);

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
  if (loading.value) {
    toast.info("Please wait for loading page.");
  } else {
    isOpenConfirmModal.value = true;
    selectedImport.value = row;
  }
}

function fetchCurrentUser() {
  store.dispatch("searchStaff").then((response) => {
    if (response.status === 200) {
      staffInformation.value = response.data.data;
    }
  });
}

function fetchExportsData() {
  store.dispatch("getExports").then((response) => {
    meta.value = response.data.meta;

    links.value = response.data.meta.links;

    rows.value = response.data.data;
  });
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

function deleteExport() {
  return store
    .dispatch("deleteExport", selectedImport.value.id)
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

onMounted(() => {
  fetchExportsData();
  fetchCurrentUser();
  fetchWarehouseBranchesData();
  fetchCategoriesData();
});
</script>
<template>
  <CreateExportModal
    :is-open="isOpenCreateModal"
    :closeModal="closeModal"
    :staff="staffInformation"
  >
  </CreateExportModal>
  <EditExportModal
    :is-open="isOpenEditModal"
    :closeModal="closeModal"
    :exportData="selectedImport"
  >
  </EditExportModal>
  <ConfirmModal
    :is-open="isOpenConfirmModal"
    :close-modal="closeModal"
    :submit="deleteExport"
  >
    <template v-slot:header> Are your sure? </template>
    <template v-slot:message> Delete import information! </template>
  </ConfirmModal>
  <div>
    <div class="flex flex-1">
      <h2 class="p-4 font-semibold uppercase">Export Table</h2>
      <button
        v-if="checkPermissions(['manage-import'])"
        type="button"
        @click="openCreateModal"
        class="flex rounded-md m-2 bg-success-600 px-4 py-2 text-sm font-medium text-white hover:bg-opacity-80 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75"
        :class="{ 'bg-opacity-80 cursor-no-drop': loading }"
      >
        Create export
      </button>
    </div>
  </div>

  <Table
    :columns="columns"
    :rows="rows"
    :meta="meta"
    :links="links"
    :action-column="true"
  >
    <template v-slot:actions="{ row }">
      <button
        @click="openEditModal(row)"
        class="p-1 overflow-hidden hover:opacity-60 bg-success-600 rounded-3xl text-white whitespace-nowrap"
      >
        <svg
          class="w-5 h-5"
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          fill="currentColor"
          viewBox="0 0 16 16"
        >
          <path
            d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"
          ></path>
          <path
            d="m8.93 6.588-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533L8.93 6.588zM9 4.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0z"
          ></path>
        </svg>
      </button>

      <button
        @click="openConfirmModal(row)"
        v-if="checkPermissions(['manage-import'])"
        class="p-1 ms-2 overflow-hidden hover:opacity-60 bg-danger-600 rounded-xl text-white whitespace-nowrap"
      >
        <svg
          class="w-5 h-5"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
        >
          <path
            d="M7 4a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v2h4a1 1 0 1 1 0 2h-1.069l-.867 12.142A2 2 0 0 1 17.069 22H6.93a2 2 0 0 1-1.995-1.858L4.07 8H3a1 1 0 0 1 0-2h4V4zm2 2h6V4H9v2zM6.074 8l.857 12H17.07l.857-12H6.074zM10 10a1 1 0 0 1 1 1v6a1 1 0 1 1-2 0v-6a1 1 0 0 1 1-1zm4 0a1 1 0 0 1 1 1v6a1 1 0 1 1-2 0v-6a1 1 0 0 1 1-1z"
            fill="currentColor"
          ></path>
        </svg>
      </button>
    </template>
  </Table>
</template>

<style scoped>
input.dp__pointer {
  @apply border-none;
}
</style>
