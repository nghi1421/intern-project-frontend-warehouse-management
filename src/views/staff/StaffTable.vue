<script setup>
import store from "../../store";
import { ref, onMounted, watch, onUnmounted } from "vue";
import Table from "@/components/table/Table.vue";
import CreateStaffModal from "./CreateStaffModal.vue";
import EditStaffModal from "./EditStaffModal.vue";
import { Menu, MenuButton, MenuItems } from "@headlessui/vue";
import ConfirmModal from "@/components/ConfirmModal.vue";
import TransitionSlideVertical from "@/components/TransitionSlideVertical.vue";
import SearchChoiceIcon from "@/components/icons/SearchChoice.vue";
import SearchIcon from "@/components/icons/Search.vue";
import { useToast } from "vue-toast-notification";
import "vue-toast-notification/dist/theme-sugar.css";
import eventClient from "../../eventClient.js";
import { useRouter, useRoute } from "vue-router";

const router = useRouter();

const route = useRoute();

const toast = useToast();

const selectedStaff = ref({});

const columns = ref([
  {
    key: "id",
    sortable: true,
    searchable: true,
    value: "Staff ID",
  },
  {
    key: "name",
    sortable: true,
    searchable: true,
    value: "Name",
  },
  {
    key: "position",
    sortable: true,
    searchable: false,
    value: "Position",
  },
  {
    key: "phone_number",
    sortable: true,
    searchable: true,
    value: "Phone number",
  },
  {
    key: "gender",
    sortable: true,
    searchable: false,
    value: "Gender",
  },
  {
    key: "status",
    sortable: true,
    searchable: false,
    value: "Status",
  },
]);

const params = ref({
  page: 1,
  search: "",
  sort_field: "id",
  sort_direction: "asc",
  search_columns: ["id", "name", "phone_number"],
});

const rows = ref([]);

const meta = ref({});

const isOpenCreateModal = ref(false);

const isOpenEditModal = ref(false);

const isOpenConfirmModal = ref(false);

const links = ref([]);

const searchStaff = ref("");

const loading = ref(true);

const searchColumns = ref([]);

watch(searchStaff, (newValue) => {
  params.value = { ...params.value, search: newValue };
  if (newValue.length === 0) {
    params.value.page = 1;
    router.push({ path: "/staffs", query: params.value });
    fetchStaffsData(params.value);
  }
});

function sortTable(query) {
  params.value = {
    ...params.value,
    sort_field: query.sortField,
    sort_direction: query.sortDirection,
  };
  router.push({ path: "/staffs", query: params.value });
  fetchStaffsData(params.value);
}

function fetchSearchStaff() {
  const searchChecked = searchColumns.value.filter((column) => column.checked);
  params.value.search_columns = searchChecked.map((column) => column.key);
  params.value.page = 1;
  router.push({ path: "/staffs", query: params.value });

  fetchStaffsData(params.value);
}

function fetchStaffsData(query) {
  loading.value = true;
  store.dispatch("getStaffs", query).then((response) => {
    meta.value = response.data.meta;

    links.value = response.data.meta.links;

    rows.value = response.data.data;
    loading.value = false;
  });
}

function closeModal() {
  isOpenCreateModal.value = false;
  isOpenEditModal.value = false;
  isOpenConfirmModal.value = false;
  selectedStaff.value = null;
}

function openCreateModal() {
  if (loading.value) {
    toast.info("Please wait for loading page.");
  } else {
    isOpenCreateModal.value = true;
  }
}

function openEditModal(staff) {
  if (loading.value) {
    toast.info("Please wait for loading page.");
  } else {
    isOpenEditModal.value = true;
    selectedStaff.value = staff;
  }
}

function openConfirmModal(staff) {
  if (loading.value) {
    toast.info("Please wait for loading page.");
  } else {
    isOpenConfirmModal.value = true;
    selectedStaff.value = staff;
  }
}

function storePositions() {
  store.dispatch("getAllPositions").then((data) => {
    loading.value = false;
    return data;
  });
}

function deleteStaff() {
  return store
    .dispatch("deleteStaff", selectedStaff.value.id)
    .then((response) => {
      if (response.status === 200) {
        return true;
      } else {
        return false;
      }
    })
    .catch(() => {});
}

onMounted(() => {
  params.value = { ...params.value, ...route.query };
  fetchStaffsData(route.query);
  storePositions();
  searchColumns.value = columns.value.filter(
    (column) => column.searchable === true
  );
  searchColumns.value = searchColumns.value.map(function (column) {
    return { key: column.key, name: column.value, checked: true };
  });
  eventClient.on("change-page", (pageNumber) => {
    params.value.page = pageNumber;
    router.push({ path: "/staffs", query: params.value });
    fetchStaffsData(params.value);
  });
});

onUnmounted(() => {
  eventClient.off("change-page");
});
</script>
<template>
  <create-staff-modal :is-open="isOpenCreateModal" :close-modal="closeModal">
  </create-staff-modal>
  <edit-staff-modal
    :staff="selectedStaff"
    :is-open="isOpenEditModal"
    :close-modal="closeModal"
  ></edit-staff-modal>
  <confirm-modal
    :is-open="isOpenConfirmModal"
    :close-modal="closeModal"
    :submit="deleteStaff"
  >
    <template v-slot:header> Are your sure? </template>
    <template v-slot:message> Delete staff information! </template>
  </confirm-modal>
  <div class="flex align-items-between items-center justify-between px-4 py-2">
    <h1
      class="text-2xl font-bold tracking-tight text-gray-950 sm:text-3xl"
      style="line-height: inherit"
    >
      Staff
    </h1>
    <button
      type="button"
      @click="openCreateModal"
      class="rounded-md m-2 duration-75 a bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-opacity-80 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75"
    >
      Create staff
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
        v-model="searchStaff"
        placeholder="Search staff"
      />
      <button
        @click="fetchSearchStaff"
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
    @sortTable="sortTable"
    :columns="columns"
    :rows="rows"
    :loading="loading"
    :meta="meta"
    :links="links"
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
[type="checkbox"] {
  box-sizing: border-box;
  padding: 0;
}

.form-checkbox {
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  -webkit-print-color-adjust: exact;
  color-adjust: exact;
  display: inline-block;
  vertical-align: middle;
  background-origin: border-box;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
  flex-shrink: 0;
  color: currentColor;
  background-color: #fff;
  border-color: #e2e8f0;
  border-width: 1px;
  border-radius: 0.25rem;
  height: 1.2em;
  width: 1.2em;
}

.form-checkbox:checked {
  background-image: url("data:image/svg+xml,%3csvg viewBox='0 0 16 16' fill='white' xmlns='http://www.w3.org/2000/svg'%3e%3cpath d='M5.707 7.293a1 1 0 0 0-1.414 1.414l2 2a1 1 0 0 0 1.414 0l4-4a1 1 0 0 0-1.414-1.414L7 8.586 5.707 7.293z'/%3e%3c/svg%3e");
  border-color: transparent;
  background-color: currentColor;
  background-size: 100% 100%;
  background-position: center;
  background-repeat: no-repeat;
}
.form-checkbox:indeterminate {
  background-image: url("data:image/svg+xml,%3Csvg class='w-16 h-16' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 12 12' fill='none'%3E%3Crect x='2' y='5.25' width='8' height='1.5' rx='0.75' fill='white'%3E%3C/rect%3E%3C/svg%3E");
  border-color: transparent;
  background-color: currentColor;
  background-size: 100% 100%;
  background-position: center;
  background-repeat: no-repeat;
}
</style>
