<script setup>
import store from "../store";
import { ref, onMounted, computed } from "vue";
import Table from "@/components/table/Table.vue";
import CreateStaffModal from "./CreateStaffModal.vue";
import { useVuelidate } from "@vuelidate/core";
import { required, minLength, maxLength } from "@vuelidate/validators";

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

const isOpen = ref(false);

const links = ref([]);

function fetchStaffsData() {
  store.dispatch("getStaffs").then((response) => {
    meta.value = response.data.meta;

    links.value = response.data.meta.links;

    rows.value = response.data.data;
  });
}

function closeModal() {
  isOpen.value = false;
}
function openModal() {
  isOpen.value = true;
}

onMounted(() => {
  fetchStaffsData();
});
</script>
<template>
  <div>
    <div class="flex flex-1">
      <h2 class="p-4 font-semibold uppercase">Staff Table</h2>
      <button
        type="button"
        @click="openModal"
        class="rounded-md m-2 bg-success-600 px-4 py-2 text-sm font-medium text-white hover:bg-opacity-80 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75"
      >
        Create new staff
      </button>
    </div>
    <div>
      <create-staff-modal :is-open="isOpen" :closeModal="closeModal">
      </create-staff-modal>
    </div>
  </div>

  <Table :columns="columns" :rows="rows" :meta="meta" :links="links"></Table>
</template>

<style scoped>
input.dp__pointer {
  @apply border-none;
}
</style>
