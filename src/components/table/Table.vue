<script>
import Loading from "@/components/Loading.vue";
import TablePagination from "@/components/table/TablePagination.vue";

export default {
  name: "Table",

  components: {
    Loading,
    TablePagination,
  },

  props: {
    rows: Array,
    columns: Array,
    loading: Boolean,
    meta: Object,
    links: Array,
    actionColumn: {
      type: Boolean,
      default: true,
    },
  },

  data() {
    return {
      data: this.rows.map(function (row) {
        return { ...row, selected: false };
      }),
      metaData: this.meta,
      linksData: this.links,
      open: false,
      loadingStatus: true,
      sortField: this.$route.query.sort_field
        ? this.$route.query.sort_field
        : "id",
      sortDirection: this.$route.sort_direction
        ? this.$route.sort_direction
        : "asc",
    };
  },

  methods: {
    checkSelectedAll() {
      return this.data.every((row) => row.selected);
    },

    checkSelectAny() {
      return this.data.some((row) => row.selected);
    },

    toggleAll() {
      if (this.$refs.toggleAll.indeterminate || this.$refs.toggleAll.checked) {
        this.data = this.data.map(function (row) {
          return { ...row, selected: true };
        });
      } else {
        this.data = this.data.map(function (row) {
          return { ...row, selected: false };
        });
      }
    },

    clickSort(columnKey) {
      const column = this.columns.find((column) => column.key === columnKey);
      if (column.sortable) {
        this.sortField = columnKey;
        this.sortDirection = this.sortDirection === "asc" ? "desc" : "asc";
        this.$emit("sortTable", {
          sortField: this.sortField,
          sortDirection: this.sortDirection,
        });
      }
    },

    selectRow(rowId) {
      let indexRowSelected = this.data.findIndex(function (row) {
        return row.id == rowId;
      });

      this.data[indexRowSelected].selected =
        !this.data[indexRowSelected].selected;

      if (this.checkSelectedAll()) {
        this.$refs.toggleAll.indeterminate = false;
        this.$refs.toggleAll.checked = true;
      } else {
        if (this.checkSelectAny()) {
          this.$refs.toggleAll.indeterminate = true;
          this.$refs.toggleAll.checked = false;
        } else {
          this.$refs.toggleAll.indeterminate = false;
          this.$refs.toggleAll.checked = false;
        }
      }
    },
  },

  watch: {
    rows(newRows) {
      this.data = newRows.map(function (row) {
        return { ...row, selected: false };
      });
      this.metaData = this.meta;
      this.linksData = this.links;
      this.loadingStatus = false;
    },
  },
};
</script>

<template>
  <div class="flow-root">
    <div class="overflow-x-auto">
      <div class="inline-block min-w-full align-middle">
        <div
          class="relative overflow-hidden shadow ring-1 ring-black ring-opacity-5"
        >
          <table
            class="min-h-[100px] min-w-full border-collapse overflow-auto table-auto w-full whitespace-no-wrap bg-white relative"
          >
            <thead class="">
              <tr class="bg-slate-600">
                <th
                  class="py-2 px-3 border-b border-gray-200"
                  style="text-align: left"
                >
                  <label
                    class="text-teal-500 hover:bg-gray-200 px-2 py-2 rounded-lg cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      ref="toggleAll"
                      class="form-checkbox focus:outline-none focus:shadow-outline"
                      @click="toggleAll"
                    />
                  </label>
                </th>
                <th
                  v-for="column in columns"
                  :key="column.key"
                  class="border-b border-gray-200 px-3 py-1 items-start text-white"
                  :ref="column.key"
                  :class="{
                    'cursor-pointer': column.sortable,
                  }"
                  style="text-align: left"
                >
                  <span
                    @click="clickSort(column.key)"
                    class="whitespace-nowrap uppercase font-bold text-xs"
                    :class="{ 'cursor-pointer': column.sortable }"
                  >
                    <svg
                      v-if="column.sortable"
                      class="w-3 h-3 inline-block"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="currentColor"
                      stroke="none"
                      viewBox="0 0 24 24"
                    >
                      <path d="M8 16H4l6 6V2H8zm6-11v17h2V8h4l-6-6z"></path>
                    </svg>
                    {{ column.value }}
                    <span v-if="column.key === sortField && column.sortable">
                      <svg
                        :class="{
                          'rotate-180': sortDirection === 'desc',
                        }"
                        class="inline-block h-3 w-3"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        aria-hidden="true"
                      >
                        <path
                          fill-rule="evenodd"
                          d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                          clip-rule="evenodd"
                        ></path>
                      </svg>
                    </span>
                  </span>
                </th>
                <th
                  v-if="actionColumn"
                  class="border-b border-gray-200 px-3 py-1 items-start text-white"
                  style="text-align: left"
                >
                  <span class="whitespace-nowrap uppercase font-bold text-xs">
                    Action
                  </span>
                </th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="(row, index) in data"
                :key="index"
                class="odd:bg-violet-50"
              >
                <td class="border-dashed border-t border-gray-200 px-3">
                  <label
                    class="text-teal-500 inline-flex justify-between items-center hover:bg-gray-200 px-2 py-2 rounded-lg cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      class="form-checkbox rowCheckbox focus:outline-none focus:shadow-outline"
                      :checked="row['selected']"
                      :name="row.id"
                      @click="selectRow(row['id'])"
                    />
                  </label>
                </td>
                <td
                  v-for="(column, index) in columns"
                  :key="column.key + index"
                  class="border-dashed border-t border-gray-200"
                >
                  <span
                    class="table-cell px-3 py-4 text-sm text-gray-500 overflow-hidden dark:text-slate-300 whitespace-nowrap"
                  >
                    {{ row[column.key] }}
                  </span>
                </td>

                <td class="border-dashed border-t border-gray-200">
                  <slot name="actions" v-bind="{ row }" />
                </td>
              </tr>
              <tr v-if="rows.length === 0">
                <td :colspan="columns.length + 2">
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
    <table-pagination :meta="metaData" :links="linksData"></table-pagination>
  </div>
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
