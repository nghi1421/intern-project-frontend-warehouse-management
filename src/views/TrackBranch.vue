<script setup>
import { onMounted, ref } from "vue";
import store from "../store";
import Loading from "@/components/Loading.vue";

const data = ref([]);

const categories = ref([]);

const loading = ref(true);

function fetchTrackData() {
  loading.value = true;
  return store.dispatch("getTrack").then((response) => {
    if (response.status === 200) {
      loading.value = false;
      data.value = response.data.data;
      categories.value = response.data.categories;
      debugger;
      return true;
    } else {
      return false;
    }
  });
}

onMounted(() => {
  fetchTrackData();
});
</script>

<template>
  <div class="flex align-items-between items-center justify-between px-4 py-2">
    <h1
      class="text-2xl font-bold tracking-tight text-gray-950 sm:text-3xl"
      style="line-height: inherit"
    >
      Track
    </h1>
  </div>

  <div class="flow-root">
    <div class="overflow-x-auto">
      <div class="inline-block min-w-full align-middle">
        <div class="relative overflow-hidden shadow ring-black ring-opacity-5">
          <table
            class="min-h-[100px] max-w-full min-w-full border-collapse overflow-auto table-auto w-full whitespace-no-wrap bg-white relative"
          >
            <thead class="text-white">
              <tr class="bg-slate-600">
                <th class="border-dashed border-t border-gray-200">
                  <span class="whitespace-nowrap uppercase font-bold text-xs">
                    Branch name
                  </span>
                </th>
                <th
                  v-for="category in categories"
                  :key="category"
                  class="border-dashed border-t border-gray-200"
                >
                  <span class="whitespace-nowrap uppercase font-bold text-xs">
                    {{ category.name }} ({{ category.unit }})
                  </span>
                </th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="track in data" :key="track" class="odd:bg-violet-50">
                <td class="border-dashed border-t border-gray-200">
                  <span
                    class="table-cell px-3 py-4 text-sm font-bold text-gray-500 overflow-hidden dark:text-slate-300 whitespace-nowrap"
                  >
                    {{ track["branch_name"] }}
                  </span>
                </td>
                <td
                  v-for="category in track.categories"
                  class="border-dashed border-t border-gray-200"
                >
                  <span
                    class="table-cell px-3 py-4 text-sm font-semibold text-gray-500 overflow-hidden dark:text-slate-300 whitespace-nowrap"
                  >
                    {{ category["quantity"] }}
                  </span>
                </td>
              </tr>

              <tr v-if="data.length === 0">
                <td :colspan="categories.length + 1">
                  <div class="py-6 text-center">
                    <svg
                      class="w-12 h-12 mx-auto text-gray-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        vector-effect="non-scaling-stroke"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z"
                      />
                    </svg>
                    <h3
                      class="mt-2 text-sm font-semibold text-gray-500 dark:bg-transparent dark:text-white"
                    >
                      No record found.
                    </h3>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
          <Loading :loading="loading" />
        </div>
      </div>
    </div>
  </div>
</template>
