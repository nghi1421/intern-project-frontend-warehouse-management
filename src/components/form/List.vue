<script>
import {
  Listbox,
  ListboxButton,
  ListboxOptions,
  ListboxOption,
} from "@headlessui/vue";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/vue/20/solid";

export default {
  emits: ["updateSelectedItem"],

  components: {
    Listbox,
    ListboxButton,
    ListboxOptions,
    ListboxOption,
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
    };
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
    v-if="label"
    for="default-input"
    class="p-1 bg-white z-50 ms-4 mb-2 text-xs font-medium text-gray-900 dark:text-white group-focus-within:text-primary-400 group-focus-within:text-sm ease-in duration-150"
  >
    {{ label }}
  </label>
  <Listbox v-model="selectedData">
    <div class="relative mt-1">
      <ListboxButton
        class="relative z-20 w-full cursor-default rounded-lg bg-white py-2 pl-3 pr-10 text-left border-gray-400 border-opacity-60 border focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:text-sm"
      >
        <span class="block truncate">{{ selectedData?.name }}</span>
        <span
          class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2"
        >
          <ChevronUpDownIcon class="h-5 w-5 text-gray-400" aria-hidden="true" />
        </span>
      </ListboxButton>

      <transition
        leave-active-class="transition duration-100 ease-in"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
      >
        <ListboxOptions
          class="absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm"
        >
          <ListboxOption
            v-slot="{ active, selected }"
            v-for="item in items"
            :key="item.name"
            :value="item"
            as="template"
          >
            <li
              :class="[
                active ? 'bg-amber-100 text-amber-900' : 'text-gray-900',
                'relative cursor-default select-none py-2 pl-10 pr-4',
              ]"
            >
              <span
                :class="[
                  selected ? 'font-medium' : 'font-normal',
                  'block truncate',
                ]"
                >{{ item?.name }}</span
              >
              <span
                v-if="selected"
                class="absolute inset-y-0 left-0 flex items-center pl-3 text-amber-600"
              >
                <CheckIcon class="h-5 w-5" aria-hidden="true" />
              </span>
            </li>
          </ListboxOption>
        </ListboxOptions>
      </transition>
    </div>
  </Listbox>
</template>
