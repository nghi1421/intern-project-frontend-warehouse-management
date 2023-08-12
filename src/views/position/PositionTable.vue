<script setup>
import store from "../../store";
import { ref, onMounted } from "vue";
import Table from "@/components/table/Table.vue";
import CreatePositionModal from "./CreatePositionModal.vue";
import EditPositionModal from "./EditPositionModal.vue";
import ConfirmModal from "@/components/ConfirmModal.vue";
import { useToast } from "vue-toast-notification";
import "vue-toast-notification/dist/theme-sugar.css";

const toast = useToast();

const columns = ref([
  {
    key: "id",
    value: "position ID",
  },
  {
    key: "name",
    value: "Name",
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

const selectedPosition = ref({});

const rows = ref([]);

const meta = ref({});

const links = ref([]);

const isOpenCreateModal = ref(false);

const isOpenEditModal = ref(false);

const isOpenConfirmModal = ref(false);

const searchPosition = ref("");

function fetchPositionsData() {
  store.dispatch("getPositions").then((response) => {
    meta.value = response.data.pagination;

    links.value = response.data.pagination.links;

    rows.value = response.data.pagination.data;
  });
}

function closeModal() {
  isOpenCreateModal.value = false;
  isOpenEditModal.value = false;
  isOpenConfirmModal.value = false;
  selectedPosition.value = null;
}

function fetchSearchPosition() {
  //
}

function openCreateModal() {
  isOpenCreateModal.value = true;
}

function openEditModal(position) {
  isOpenEditModal.value = true;
  selectedPosition.value = position;
}

function openConfirmModal(position) {
  isOpenConfirmModal.value = true;
  selectedPosition.value = position;
}

function deletePosition() {
  return store
    .dispatch("deletePosition", selectedPosition.value.id)
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
  fetchPositionsData();
});
</script>

<template>
  <CreatePositionModal :is-open="isOpenCreateModal" :closeModal="closeModal">
  </CreatePositionModal>
  <EditPositionModal
    :position="selectedPosition"
    :is-open="isOpenEditModal"
    :close-modal="closeModal"
  ></EditPositionModal>
  <confirm-modal
    :is-open="isOpenConfirmModal"
    :close-modal="closeModal"
    :submit="deletePosition"
  >
    <template v-slot:header> Are your sure? </template>
    <template v-slot:message> Delete position! </template>
  </confirm-modal>
  <div class="flex align-items-between items-center justify-between px-4 py-2">
    <h1
      class="text-2xl font-bold tracking-tight text-gray-950 sm:text-3xl"
      style="line-height: inherit"
    >
      Position
    </h1>
    <button
      type="button"
      @click="openCreateModal"
      class="rounded-md m-2 duration-75 a bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-opacity-80 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75"
    >
      Create position
    </button>
  </div>

  <div class="px-4 py-2 relative mb-12">
    <div
      class="absolute left-4 w-80 flex justify-end rounded-lg shadow-sm ring-1 transition duration-75 text-gray-400 bg-white focus-within:ring-2 ring-gray-950/10 focus-within:ring-primary-600"
    >
      <div class="m-auto ps-2">
        <svg
          class="w-5 h-5"
          xmlns="http://www.w3.org/2000/svg"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            fill-rule="evenodd"
            d="M14.53 15.59a8.25 8.25 0 111.06-1.06l5.69 5.69a.75.75 0 11-1.06 1.06l-5.69-5.69zM2.5 9.25a6.75 6.75 0 1111.74 4.547.746.746 0 00-.443.442A6.75 6.75 0 012.5 9.25z"
          ></path>
        </svg>
      </div>
      <input
        class="py-2 px-1 text-black rounded-lg flex-1"
        type="text"
        v-model="searchPosition"
        placeholder="Search position"
      />
      <button
        @click="fetchSearchPosition"
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
    :action-column="true"
    :tableRoute="'/positions'"
    :searchTerm="searchPosition"
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
