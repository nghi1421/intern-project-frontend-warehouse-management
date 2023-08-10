<script setup>
import store from "../../store";
import { ref, onMounted } from "vue";
import Table from "@/components/table/Table.vue";
// import CreateLocationModal from "./CreateLocationModal.vue";
import EditStockModal from "./EditStockModal.vue";
// import ConfirmModal from "@/components/ConfirmModal.vue";
import { useToast } from "vue-toast-notification";
import "vue-toast-notification/dist/theme-sugar.css";

const toast = useToast();

const columns = ref([
  {
    key: "id",
    value: "stock ID",
  },
  {
    key: "category_name",
    value: "Cateogry name",
  },
  {
    key: "location_name",
    value: "Location",
  },
  {
    key: "import_id",
    value: "Import id",
  },
  {
    key: "expiry_date",
    value: "Expiry date",
  },
]);

const selectedLocation = ref({});

const rows = ref([]);

const meta = ref({});

const links = ref([]);

const isOpenCreateModal = ref(false);

const isOpenEditModal = ref(false);

const isOpenConfirmModal = ref(false);

function fetchStocksData() {
  store.dispatch("getStocks").then((response) => {
    meta.value = response.data.meta;

    links.value = response.data.meta.links;

    rows.value = response.data.data;
  });
}

function closeModal() {
  isOpenCreateModal.value = false;
  isOpenEditModal.value = false;
  isOpenConfirmModal.value = false;
  selectedLocation.value = null;
}

function openCreateModal() {
  isOpenCreateModal.value = true;
}

function openEditModal(location) {
  isOpenEditModal.value = true;
  selectedLocation.value = location;
}

function openConfirmModal(location) {
  isOpenConfirmModal.value = true;
  selectedLocation.value = location;
}

function deleteStock() {
  return store
    .dispatch("deleteStock", selectedLocation.value.id)
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
  fetchStocksData();
});
</script>

<template>
  <EditStockModal
    :location="selectedLocation"
    :is-open="isOpenEditModal"
    :close-modal="closeModal"
  ></EditStockModal>
  <confirm-modal
    :is-open="isOpenConfirmModal"
    :close-modal="closeModal"
    :submit="deleteStock"
  >
    <template v-slot:header> Are your sure? </template>
    <template v-slot:message> Delete stock! </template>
  </confirm-modal>
  <div>
    <div class="flex flex-1">
      <h2 class="p-4 font-semibold uppercase">Stock Table</h2>
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
