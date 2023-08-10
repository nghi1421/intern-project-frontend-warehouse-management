<script setup>
import store from "../../store";
import { ref, onMounted } from "vue";
import Table from "@/components/table/Table.vue";
import CreateStaffModal from "./CreateStaffModal.vue";
import EditStaffModal from "./EditStaffModal.vue";
import ConfirmModal from "@/components/ConfirmModal.vue";
import { useToast } from "vue-toast-notification";
import "vue-toast-notification/dist/theme-sugar.css";

const toast = useToast();

const selectedStaff = ref({});

const columns = ref([
  {
    key: "id",
    value: "Staff ID",
  },
  {
    key: "name",
    value: "Name",
  },
  {
    key: "position",
    value: "Position",
  },
  {
    key: "phone_number",
    value: "Phone number",
  },
  {
    key: "gender",
    value: "Gender",
  },
  {
    key: "status",
    value: "Status",
  },
]);

const rows = ref([]);

const meta = ref({});

const isOpenCreateModal = ref(false);

const isOpenEditModal = ref(false);

const isOpenConfirmModal = ref(false);

const links = ref([]);

function fetchStaffsData() {
  store.dispatch("getStaffs").then((response) => {
    meta.value = response.data.meta;

    links.value = response.data.meta.links;

    rows.value = response.data.data;
  });
}

function closeModal() {
  isOpenCreateModal.value = false;
  isOpenEditModal.value = false;
  isOpenConfirmModal.value = false;
  selectedStaff.value = null;
}

function openCreateModal() {
  isOpenCreateModal.value = true;
}

function openEditModal(staff) {
  isOpenEditModal.value = true;
  selectedStaff.value = staff;
}

function openConfirmModal(staff) {
  isOpenConfirmModal.value = true;
  selectedStaff.value = staff;
}

function storePositions() {
  store.dispatch("getPositions").then((data) => {
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
  fetchStaffsData();
  storePositions();
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
  <div>
    <div class="flex flex-1">
      <h2 class="p-4 font-semibold uppercase">Staff Table</h2>
      <button
        type="button"
        @click="openCreateModal"
        class="rounded-md m-2 bg-success-600 px-4 py-2 text-sm font-medium text-white hover:bg-opacity-80 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75"
      >
        Create new staff
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
