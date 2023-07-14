<script setup>
import store from "../store";
import { ref, onMounted } from "vue";
import Table from "@/components/table/Table.vue";

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

const links = ref([]);
function fetchStaffsData() {
  store.dispatch("getStaffs").then((response) => {
    meta.value = response.data.meta;

    links.value = response.data.meta.links;

    rows.value = response.data.data;
  });
}

onMounted(() => {
  fetchStaffsData();
});
</script>
<template>
  <h2 class="p-4 font-semibold uppercase">Staff Table</h2>
  <Table :columns="columns" :rows="rows" :meta="meta" :links="links"></Table>
</template>
