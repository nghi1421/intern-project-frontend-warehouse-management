<script setup>
import store from "../../store";
import { ref, onMounted, watch, onUnmounted } from "vue";
import Table from "@/components/table/Table.vue";
import CreateExportModal from "./CreateExportModal.vue";
import ConfirmModal from "@/components/ConfirmModal.vue";
import EditExportModal from "./EditExportModal.vue";
import { useToast } from "vue-toast-notification";
import "vue-toast-notification/dist/theme-sugar.css";
import { Menu, MenuButton, MenuItems } from "@headlessui/vue";
import TransitionSlideVertical from "@/components/TransitionSlideVertical.vue";
import SearchChoiceIcon from "@/components/icons/SearchChoice.vue";
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
    value: "Export ID",
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
    key: "warehouse_branch_name",
    value: "Warehouse branch name",
    sortable: true,
    searchable: false,
  },
  {
    key: "destination_name",
    value: "Destination",
    sortable: true,
    searchable: false,
  },
  {
    key: "status",
    value: "status",
    sortable: true,
    searchable: false,
  },
  {
    key: "created_at",
    value: "create at",
    sortable: true,
    searchable: false,
  },
  {
    key: "updated_at",
    value: "updated  at",
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

const searchColumns = ref([]);

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

const searchExport = ref("");

watch(searchExport, (newValue) => {
  params.value = { ...params.value, search: newValue };
  if (newValue.length === 0) {
    params.value.page = 1;
    router.push({ path: "/exports", query: params.value });
    fetchExportsData(params.value);
  }
});

function sortTable(query) {
  params.value = {
    ...params.value,
    sort_field: query.sortField,
    sort_direction: query.sortDirection,
  };
  router.push({ path: "/exports", query: params.value });
  fetchExportsData(params.value);
}

function fetchSearchExport() {
  const searchChecked = searchColumns.value.filter((column) => column.checked);
  params.value.search_columns = searchChecked.map((column) => column.key);
  params.value.page = 1;
  router.push({ path: "/exports", query: params.value });

  fetchExportsData(params.value);
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
  if (loading.value) {
    toast.info("Please wait for loading page.");
  } else {
    isOpenConfirmModal.value = true;
    selectedImport.value = row;
  }
}

function fetchCurrentUser() {
  loading.value = true;
  store.dispatch("searchStaff").then((response) => {
    if (response.status === 200) {
      staffInformation.value = response.data.data;
      loading.value = false;
    }
  });
}

function fetchExportsData(query) {
  loading.value = true;

  store.dispatch("getExports", query).then((response) => {
    meta.value = response.data.meta;

    links.value = response.data.meta.links;

    rows.value = response.data.data;

    loading.value = false;
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

function fetchExportPDF(exportId) {
  return store.dispatch("getExportPDF", exportId).then((response) => {
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute(
      "download",
      `export-${exportId}-${new Date().toISOString()}-.pdf`
    );
    document.body.appendChild(link);
    link.click();
  });
}

onMounted(() => {
  params.value = { ...params.value, ...route.query };
  fetchExportsData(params.value);
  if (
    checkPermissions(["read-branch-export"]) &&
    !checkPermissions(["update-export-status"]) &
      !checkPermissions(["manage-export"])
  ) {
    fetchExportsData(params.value);
  } else {
    fetchExportsData(params.value);
    fetchCurrentUser();
    fetchWarehouseBranchesData();
    fetchCategoriesData();
  }
  searchColumns.value = columns.value.filter(
    (column) => column.searchable === true
  );
  searchColumns.value = searchColumns.value.map(function (column) {
    return { key: column.key, name: column.value, checked: true };
  });
  eventClient.on("change-page", (pageNumber) => {
    params.value.page = pageNumber;
    router.push({ path: "/exports", query: params.value });
    fetchProvidersData(params.value);
  });
});

onUnmounted(() => {
  eventClient.off("change-page");
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
  <div class="flex align-items-between items-center justify-between px-4 py-2">
    <h1
      class="text-2xl font-bold tracking-tight text-gray-950 sm:text-3xl"
      style="line-height: inherit"
    >
      Export
    </h1>
    <button
      v-if="checkPermissions(['manage-export'])"
      type="button"
      @click="openCreateModal"
      class="rounded-md m-2 duration-75 a bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-opacity-80 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75"
    >
      Create export
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
        v-model="searchExport"
        placeholder="Search export"
      />
      <button
        @click="fetchSearchExport"
        type="button"
        class="rounded-md duration-75 a bg-primary-600 px-3 text-sm font-medium text-white hover:bg-opacity-80 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75"
      >
        Search
      </button>
    </div>
    <Menu as="div" class="relative my-auto">
      <MenuButton
        class="items-center hover:opacity-80 focus:ouline-none rounded-lg p-1"
      >
        <SearchChoiceIcon
          class="text-gray-400 hover:text-gray-600 opacity-60"
        />
      </MenuButton>
      <TransitionSlideVertical>
        <MenuItems
          class="absolute right-0 z-10 mt-2.5 p-4 w-80 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-gray-900/5 focus:outline-none"
        >
          <div class="flex items-center justify-between">
            <h4
              class="text-base font-semibold leading-6 text-gray-950 dark:text-white mb-4"
            >
              Search columns
            </h4>
          </div>
          <div class="flex-col gap-8">
            <div v-for="searchColumn in searchColumns" :key="searchColumn">
              <div class="flex gap-8">
                <label
                  class="text-teal-500 hover:bg-gray-200 px-2 py-2 rounded-lg cursor-pointer"
                >
                  <input
                    @click="searchColumn.checked = !searchColumn.checked"
                    type="checkbox"
                    ref="toggleAll"
                    :checked="searchColumn.checked"
                    class="-mt-3 form-checkbox focus:outline-none focus:shadow-outline"
                  />
                </label>
                <label
                  for="default-input"
                  class="p-1 bg-white whitespace-nowrap text-sm font-medium text-gray-900"
                >
                  {{ searchColumn.name }}
                </label>
              </div>
            </div>
          </div>
        </MenuItems>
      </TransitionSlideVertical>
    </Menu>
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
        v-if="checkPermissions(['manage-export', 'manage-branch-export'])"
        @click="fetchExportPDF(row.id)"
        class="p-1 ms-2 overflow-hidden hover:opacity-60 bg-warning-600 rounded-xl text-white whitespace-nowrap"
      >
        <PDFIcon />
      </button>
    </template>
  </Table>
</template>

<style scoped>
input.dp__pointer {
  @apply border-none;
}
</style>
