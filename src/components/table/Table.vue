<script>
export default {
  name: "Table",

  props: {
    rows: Array,
    columns: Array,
  },

  data() {
    return {
      data: this.rows.map(function (row) {
        return { ...row, selected: false };
      }),
      open: false,
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
};
</script>

<template>
  <div class="antialiased sans-serif bg-gray-200 h-screen">
    <div class="container mx-auto py-6 px-4" v-cloak>
      <div
        class="w-full overflow-auto bg-white rounded-lg shadow overflow-y-auto relative"
      >
        <table
          class="border-collapse table-auto w-full whitespace-no-wrap bg-white table-striped relative"
        >
          <thead>
            <tr class="text-center">
              <th
                class="py-2 px-3 sticky top-0 border-b border-gray-200 bg-gray-100"
              >
                <label
                  class="text-teal-500 inline-flex justify-between items-center hover:bg-gray-200 px-2 py-2 rounded-lg cursor-pointer"
                >
                  <input
                    type="checkbox"
                    ref="toggleAll"
                    class="form-checkbox focus:outline-none focus:shadow-outline"
                    @click="toggleAll"
                  />
                </label>
              </th>
              <template v-for="column in columns" :key="column.key">
                <th
                  class="bg-gray-100 sticky top-0 border-b border-gray-200 px-6 py-2 text-gray-600 font-bold tracking-wider uppercase text-xs"
                  :ref="column.key"
                  :class="{ [column.key]: true }"
                >
                  <span class="whitespace-nowrap">
                    {{ column.value }}
                    <!-- :class="{
                        'opacity-60': query[sortName] !== column.name,
                        'opacity-100': query[sortName] === column.name,
                        'rotate-180':
                          query[sortName] === column.name &&
                          query[sortDirectionName] === 'DESC',
                      }" -->
                    <svg
                      v-if="column.sortable"
                      class="ms-1 inline-block h-3 w-3"
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
                </th>
              </template>
            </tr>
          </thead>
          <tbody>
            <template v-for="(row, index) in data" :key="index">
              <tr>
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
                  <span class="text-gray-700 px-6 py-3 flex items-center">
                    {{ row[column.key] }}
                  </span>
                </td>
              </tr>
            </template>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<style scoped>
[v-cloak] {
  display: none;
}

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
