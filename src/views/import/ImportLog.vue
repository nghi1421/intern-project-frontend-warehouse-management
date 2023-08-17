<script setup>
import { onMounted, ref } from "vue";
import store from "../../store";
import Loading from "@/components/Loading.vue";

const logs = ref([]);
const loading = ref(true);
function fetchImortLog() {
  return store.dispatch("getImportLog").then((response) => {
    if (response.status === 200) {
      logs.value = response.data;
      loading.value = false;
      return true;
    } else {
      return false;
    }
  });
}

onMounted(() => {
  fetchImortLog();
});
</script>
<template>
  <div class="flex align-items-between items-center justify-between px-4 py-2">
    <h1
      class="text-2xl font-bold tracking-tight text-gray-950 sm:text-3xl"
      style="line-height: inherit"
    >
      Activity log
    </h1>
  </div>
  <div class="flow-root">
    <div class="overflow-x-auto">
      <div class="inline-block min-w-full align-middle">
        <div class="relative overflow-hidden shadow ring-black ring-opacity-5">
          <table
            class="min-h-[100px] max-w-full min-w-full border-collapse overflow-auto table-auto w-full whitespace-no-wrap bg-white relative"
          >
            <thead class="">
              <tr>
                <th class="border-dashed border-t border-gray-200">
                  <span class="whitespace-nowrap uppercase font-bold text-xs">
                    Create at
                  </span>
                </th>
                <th class="border-dashed border-t border-gray-200">
                  <span class="whitespace-nowrap uppercase font-bold text-xs">
                    from
                  </span>
                </th>
                <th class="border-dashed border-t border-gray-200">
                  <span class="whitespace-nowrap uppercase font-bold text-xs">
                    to
                  </span>
                </th>
                <th class="border-dashed border-t border-gray-200">
                  <span class="whitespace-nowrap uppercase font-bold text-xs">
                    status
                  </span>
                </th>
                <th class="border-dashed border-t border-gray-200">
                  <span class="whitespace-nowrap uppercase font-bold text-xs">
                    type
                  </span>
                </th>

                <th class="border-dashed border-t border-gray-200">
                  <span class="whitespace-nowrap uppercase font-bold text-xs">
                    detail
                  </span>
                </th>
                <th class="border-dashed border-t border-gray-200">
                  <span class="whitespace-nowrap uppercase font-bold text-xs">
                    total
                  </span>
                </th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="log in logs" :key="log" class="odd:bg-violet-50">
                <td class="border-dashed border-t border-gray-200">
                  <span
                    class="table-cell px-3 py-4 text-sm text-gray-500 overflow-hidden dark:text-slate-300 whitespace-nowrap"
                  >
                    {{ log["created_at"] }}
                  </span>
                </td>
                <td class="border-dashed border-t border-gray-200">
                  <span
                    class="table-cell px-3 py-4 text-sm text-gray-500 overflow-hidden dark:text-slate-300 whitespace-nowrap"
                  >
                    {{ log["from"] }}
                  </span>
                </td>
                <td class="border-dashed border-t border-gray-200">
                  <span
                    class="table-cell px-3 py-4 text-sm text-gray-500 overflow-hidden dark:text-slate-300 whitespace-nowrap"
                  >
                    {{ log["to"] }}
                  </span>
                </td>
                <td class="border-dashed border-t border-gray-200">
                  <span
                    class="table-cell px-3 py-4 text-sm text-gray-500 overflow-hidden dark:text-slate-300 whitespace-nowrap"
                  >
                    <span
                      :class="{
                        'inline-flex items-center rounded-md bg-red-50 px-2 py-1 text-xs font-medium text-red-600 ring-1 ring-inset ring-red-600/10':
                          log['status_id'] === 0,
                        'inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-600 ring-1 ring-inset ring-blue-700/10':
                          log['status_id'] === 1,
                        'inline-flex items-center rounded-md bg-yellow-50 px-2 py-1 text-xs font-medium text-yellow-600 ring-1 ring-inset ring-yellow-600/20':
                          log['status_id'] === 2,
                        'inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-600 ring-1 ring-inset ring-green-600/20':
                          log['status_id'] === 3,
                      }"
                      >{{ log["status"] }}</span
                    >
                  </span>
                </td>
                <td class="border-dashed border-t border-gray-200">
                  <span
                    class="table-cell px-3 py-4 text-sm text-gray-500 overflow-hidden dark:text-slate-300 whitespace-nowrap"
                  >
                    {{ log["type"] }}
                  </span>
                </td>

                <td class="border-dashed border-t border-gray-200">
                  <ul role="list" class="divide-y divide-gray-50">
                    <li
                      v-for="item in log['detail']"
                      :key="item.id"
                      class="py-"
                    >
                      <span
                        class="flex justify-between px-2 py-1 text-sm text-gray-500 overflow-hidden whitespace-nowrap"
                      >
                        {{ item["name"] }}
                        <span
                          v-if="log['is_import'] === 1"
                          class="text-sm text-green-600 font-bold whitespace-nowrap"
                        >
                          +{{ item["amount"] }}
                        </span>
                        <span
                          v-else
                          class="text-sm text-red-600 font-bold whitespace-nowrap"
                        >
                          -{{ item["amount"] }}
                        </span>
                      </span>
                    </li>
                  </ul>
                </td>
                <td class="border-dashed border-t border-gray-200">
                  <span
                    class="table-cell px-3 py-4 text-sm text-gray-500 overflow-hidden dark:text-slate-300 whitespace-nowrap"
                  >
                    {{ log["total"] }}
                  </span>
                </td>
              </tr>

              <tr v-if="logs.length === 0">
                <td :colspan="7">
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
          <Loading :loading="loading || loadingStatus" />
        </div>
      </div>
    </div>
  </div>
</template>
