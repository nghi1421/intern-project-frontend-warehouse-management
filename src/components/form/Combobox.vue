<script>
import {
  Combobox,
  ComboboxButton,
  ComboboxInput,
  ComboboxLabel,
  ComboboxOption,
  ComboboxOptions,
} from "@headlessui/vue";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/vue/20/solid";

export default {
  components: {
    Combobox,
    ComboboxButton,
    ComboboxInput,
    ComboboxLabel,
    ComboboxOption,
    ComboboxOptions,
    CheckIcon,
    ChevronUpDownIcon,
  },

  props: {
    items: Array,
    label: String,
    selectedItem: Object,
  },

  data() {
    return {
      selectedData: this.selectedItem,
      query: "",
    };
  },

  computed: {
    filteredItems() {
      return this.query === ""
        ? this.items
        : this.items.filter((item) => {
            return item.name.toLowerCase().includes(this.query.toLowerCase());
          });
    },
  },

  watch: {
    selectedData(newSelect) {
      this.$emit("updateSelectedItem", newSelect);
    },
  },
};
</script>

<template>
  <label
    for="default-input"
    class="p-1 bg-white z-50 ms-4 mb-2 text-xs font-medium text-gray-900 dark:text-white group-focus-within:text-primary-400 group-focus-within:text-sm ease-in duration-150"
  >
    {{ label }}
  </label>
  <Combobox as="div" v-model="selectedData">
    <ComboboxLabel class="block text-sm font-medium leading-6 text-gray-900">{{
      label
    }}</ComboboxLabel>
    <div class="relative mt-2">
      <ComboboxInput
        class="w-full rounded-md border-0 bg-white py-1.5 pl-3 pr-10 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
        @change="query = $event.target.value"
        :display-value="(item) => item?.name"
      />

      <ComboboxButton
        class="absolute inset-y-0 right-0 flex items-center rounded-r-md px-2 focus:outline-none"
      >
        <ChevronUpDownIcon class="h-5 w-5 text-gray-400" aria-hidden="true" />
      </ComboboxButton>
      <ComboboxOptions
        class="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm"
      >
        <ComboboxOption
          v-for="item in filteredItems"
          :key="item.id"
          :value="item"
          as="template"
          v-slot="{ active, selected }"
        >
          <li
            :class="[
              'relative cursor-default select-none py-2 pl-3 pr-9',
              active ? 'bg-indigo-600 text-white' : 'text-gray-900',
            ]"
          >
            <span :class="['block truncate', selected && 'font-semibold']">
              {{ item.name }}
            </span>

            <span
              v-if="selected"
              :class="[
                'absolute inset-y-0 right-0 flex items-center pr-4',
                active ? 'text-white' : 'text-indigo-600',
              ]"
            >
              <CheckIcon class="h-5 w-5" aria-hidden="true" />
            </span>
          </li>
        </ComboboxOption>
      </ComboboxOptions>
    </div>
  </Combobox>
</template>
