<script setup>
import { ref, onMounted, computed } from "vue";
import store from "../../store";
// import TextInput from "@/components/form/inputs/TextInput.vue";
import {
  Combobox,
  ComboboxInput,
  ComboboxButton,
  ComboboxOptions,
  ComboboxOption,
  TransitionRoot,
  Listbox,
  ListboxButton,
  ListboxOptions,
  ListboxOption,
} from "@headlessui/vue";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/vue/20/solid";

import IdenfifyIcon from "@/components/icons/Identify.vue";
import PersonIcon from "@/components/icons/Person.vue";
import LocationIcon from "@/components/icons/Location.vue";
import PhoneIcon from "@/components/icons/Phone.vue";

const props = defineProps({
  staff: Object,
  submit: Function,
  closeForm: Function,
});

const status = ref("");

const providers = ref([]);

const selectedProvider = ref({});

const query = ref("");

const statuses = [
  {
    id: 0,
    name: "Cancel",
  },
  {
    id: 1,
    name: "In Progress",
  },
  {
    id: 2,
    name: "Completed",
  },
];

const categories = ref([]);

const selectedCategories = ref([]);

const selectedStatus = ref(statuses[1]);

let filteredProviders = computed(() =>
  query.value === ""
    ? providers.value
    : providers.value.filter((provider) =>
        provider.name
          .toLowerCase()
          .replace(/\s+/g, "")
          .includes(query.value.toLowerCase().replace(/\s+/g, ""))
      )
);

function handleSubmit() {
  validate();

  let data = {
    status: status.value,
  };

  props.submit(data).then(function (isSuccess) {
    if (isSuccess) {
      clearData;
      props.closeForm();
    }
  });
}

function clearData() {
  status.value = "";
}

function selectProvider(proivder) {
  selectedProvider.value = proivder;
}

onMounted(() => {
  providers.value = store.state.providers;
  selectedProvider.value = providers.value[0];
  categories.value = store.state.categories.map((category) => {
    return { ...category, selected: false };
  });
});

function selectRow(rowId) {
  let indexRowSelected = categories.value.findIndex(function (row) {
    return row.id == rowId;
  });

  categories.value[indexRowSelected].selected =
    !categories.value[indexRowSelected].selected;

  console.log(categories.value);
}

function validate() {}
</script>
<template>
  <form @submit.prevent="handleSubmit" class="grid grid-cols-6 gap-3 bg-white">
    <div class="col-span-3">
      <label
        for="default-input"
        class="mt-4 p-1 bg-white z-50 ms-4 text-xs font-medium text-gray-900 dark:text-white"
      >
        Staff information
      </label>
      <div
        class="grid grid-cols-3 border-2 focus-within:border-primary-400 py-2 px-2 rounded-2xl mb-4"
      >
        <div class="col-span-1 flex gap-1 text-xs text-gray-500 mb-1">
          <div>
            <IdenfifyIcon></IdenfifyIcon>
          </div>
          <span class="inline-block align-middle">Staff ID</span>
        </div>
        <div class="col-span-2 text-xs mb-1 ps-1">
          <span>{{ staff.id }}</span>
        </div>

        <div class="col-span-1 flex gap-1 text-xs text-gray-500 mb-1">
          <div>
            <PersonIcon></PersonIcon>
          </div>
          <span class="inline-block align-middle">Full Name</span>
        </div>
        <div class="col-span-2 text-xs mb-1">
          <span>{{ staff.name }}</span>
        </div>

        <div class="col-span-1 flex gap-1 text-xs text-gray-500 mb-1">
          <div>
            <PhoneIcon></PhoneIcon>
          </div>
          <span class="inline-block align-middle">Phone Number</span>
        </div>
        <div class="col-span-2 text-xs mb-1">
          <span>{{ staff.phone_number }}</span>
        </div>

        <div class="col-span-1 flex gap-1 text-xs text-gray-500 mb-1">
          <div>
            <LocationIcon></LocationIcon>
          </div>
          <span class="inline-block align-middle">Address</span>
        </div>
        <div class="col-span-2 text-xs mb-1">
          <span class="">{{ staff.address }}</span>
        </div>
      </div>
    </div>
    <div class="col-span-3">
      <label
        for="default-input"
        class="mt-4 p-1 bg-white z-50 ms-4 text-xs font-medium text-gray-900 dark:text-white"
      >
        Provider information
      </label>
      <div
        class="grid grid-cols-3 border-2 focus-within:border-primary-400 py-2 px-3 rounded-2xl mb-4"
      >
        <div class="col-span-1 flex gap-1 text-xs text-gray-500 mb-1">
          <div>
            <IdenfifyIcon></IdenfifyIcon>
          </div>
          <span class="inline-block align-middle">Provider ID</span>
        </div>
        <div class="col-span-2 text-xs mb-1 ps-1">
          <span>{{ selectedProvider.id }}</span>
        </div>

        <div class="col-span-1 flex gap-1 text-xs text-gray-500 mb-1">
          <div>
            <PersonIcon></PersonIcon>
          </div>
          <span class="inline-block align-middle">Provider Name</span>
        </div>
        <div class="col-span-2 text-xs mb-1">
          <div v-if="props.import" class="col-span-2 text-xs mb-1 ps-1">
            <span>{{ selectedProvider.name }}</span>
          </div>
          <div v-else class="fixed w-[26%]">
            <Combobox v-model="selectedProvider">
              <div class="relative">
                <div
                  class="relative w-full cursor-default overflow-hidden rounded-lg bg-white text-left shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-teal-300 sm:text-sm"
                >
                  <ComboboxInput
                    class="w-full border-none text-xs pr-10 leading-5 text-gray-900 focus:ring-0"
                    :displayValue="(provider) => provider.name"
                    @change="query = $event.target.value"
                  />
                  <ComboboxButton
                    class="absolute inset-y-0 right-0 flex items-center pr-2"
                  >
                    <ChevronUpDownIcon
                      class="h-5 w-5 text-gray-400"
                      aria-hidden="true"
                    />
                  </ComboboxButton>
                </div>
                <TransitionRoot
                  leave="transition ease-in duration-100"
                  leaveFrom="opacity-100"
                  leaveTo="opacity-0"
                  @after-leave="query = ''"
                >
                  <ComboboxOptions
                    class="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-xs"
                  >
                    <div
                      v-if="filteredProviders.length === 0 && query !== ''"
                      class="relative cursor-default select-none py-2 px-4 text-gray-700"
                    >
                      Nothing found.
                    </div>

                    <ComboboxOption
                      v-for="provider in filteredProviders"
                      as="template"
                      :key="provider.id"
                      :value="provider"
                      v-slot="{ selectedProvider, active }"
                    >
                      <li
                        class="relative cursor-default select-none py-2 pl-10 pr-4"
                        @click="selectProvider(provider)"
                        :class="{
                          'text-amber-600 bg-amber-100': active,
                          'text-gray-900': !active,
                        }"
                      >
                        <span
                          class="block truncate"
                          :class="{
                            'font-medium': selectedProvider,
                            'font-normal': !selectedProvider,
                          }"
                        >
                          {{ provider.name }}
                        </span>
                        <span
                          v-if="selectedProvider"
                          class="absolute inset-y-0 left-0 flex items-center pl-3"
                          :class="{
                            'text-white': active,
                            'text-teal-600': !active,
                          }"
                        >
                          <CheckIcon class="h-5 w-5" aria-hidden="true" />
                        </span>
                      </li>
                    </ComboboxOption>
                  </ComboboxOptions>
                </TransitionRoot>
              </div>
            </Combobox>
          </div>
        </div>

        <div class="col-span-1 flex gap-1 text-xs text-gray-500 mb-1">
          <div>
            <PhoneIcon></PhoneIcon>
          </div>
          <span class="inline-block align-middle">Phone Number</span>
        </div>
        <div class="col-span-2 text-xs mb-1">
          <span>{{ selectedProvider.phone_number }}</span>
        </div>

        <div class="col-span-1 flex gap-1 text-xs text-gray-500 mb-1">
          <div>
            <LocationIcon></LocationIcon>
          </div>
          <span class="inline-block align-middle">Address</span>
        </div>
        <div class="col-span-2 text-xs mb-1">
          <span class="">{{ selectedProvider.address }}</span>
        </div>
      </div>
    </div>

    <div class="col-span-6 -mt-4">
      <label
        for="default-input"
        class="p-1 bg-white z-50 ms-4 mb-2 text-xs font-medium text-gray-900 dark:text-white group-focus-within:text-primary-400 group-focus-within:text-sm ease-in duration-150"
      >
        Status
      </label>
      <div class="fixed w-[46%]">
        <Listbox v-model="selectedStatus">
          <div class="relative mt-1">
            <ListboxButton
              class="relative w-full cursor-default rounded-lg bg-white py-2 pl-3 pr-10 text-left shadow-md focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:text-sm"
            >
              <span class="block truncate">{{ selectedStatus.name }}</span>
              <span
                class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2"
              >
                <ChevronUpDownIcon
                  class="h-5 w-5 text-gray-400"
                  aria-hidden="true"
                />
              </span>
            </ListboxButton>

            <transition
              leave-active-class="transition duration-100 ease-in"
              leave-from-class="opacity-100"
              leave-to-class="opacity-0"
            >
              <ListboxOptions
                class="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm"
              >
                <ListboxOption
                  v-slot="{ active, selected }"
                  v-for="status in statuses"
                  :key="status.name"
                  :value="status"
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
                      >{{ status.name }}</span
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
      </div>
    </div>
    <div class="mt-12 col-span-6 grid grid-cols-7 max-h-40">
      <div class="col-span-3 flex flex-col overflow-auto">
        <table>
          <thead class="p-2">
            <tr class="bg-slate-500 text-white text-xs">
              <th>
                <span class="p-2 text-sm font-semibold">ID</span>
              </th>
              <th>
                <span class="p-2 text-sm font-semibold">Category name</span>
              </th>
              <th>
                <span class="p-2 text-sm font-semibold">Unit</span>
              </th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="category in categories"
              :key="`cateogry-${category.id}`"
              :class="{
                'text-gray-800 text-xs hover:bg-slate-100 bg-slate-300':
                  category.selected,
                'text-gray-800 text-xs hover:bg-slate-100 bg-white':
                  !category.selected,
              }"
              @click="selectRow(category.id)"
            >
              <th>
                <span class="p-2 font-semibold">{{ category.id }}</span>
              </th>
              <th>
                <span class="p-2 font-semibold">{{ category.name }}</span>
              </th>
              <th>
                <span class="p-2 font-semibold">{{ category.unit }}</span>
              </th>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="col-span-1 flex flex-col">
        <button>>></button>
        <button>></button>
        <button v-text="'<<'"></button>
        <button v-text="'<'"></button>
      </div>
      <div class="col-span-3 flex flex-col overflow-auto">
        <table>
          <thead class="p-2">
            <tr class="bg-slate-500 text-white text-xs">
              <th>
                <span class="p-2 text-sm font-semibold">ID</span>
              </th>
              <th>
                <span class="p-2 text-sm font-semibold">Category name</span>
              </th>
              <th>
                <span class="p-2 text-sm font-semibold">Unit</span>
              </th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="category in selectedCategories"
              :key="`cateogry-${category.id}`"
              :class="{
                'text-gray-800 text-xs hover:bg-slate-100 bg-slate-300':
                  category.selected,
                'text-gray-800 text-xs hover:bg-slate-100 bg-white':
                  !category.selected,
              }"
              @click="selectRow(category.id)"
            >
              <th>
                <span class="p-2 font-semibold">{{ category.id }}</span>
              </th>
              <th>
                <span class="p-2 font-semibold">{{ category.name }}</span>
              </th>
              <th>
                <span class="p-2 font-semibold">{{ category.unit }}</span>
              </th>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div class="col-span-6 mt-12">
      <button
        type="submit"
        class="inline-flex justify-center rounded-md border border-transparent bg-success-100 px-4 py-2 text-sm font-medium text-success-900 hover:bg-success-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-success-500 focus-visible:ring-offset-2"
      >
        Submit
      </button>
      <button
        type="button"
        class="ms-4 inline-flex justify-center rounded-md border border-transparent bg-amber-100 px-4 py-2 text-sm font-medium text-amber-900 hover:bg-amber-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2"
        @click="
          props.closeForm();
          clearData();
        "
      >
        Close
      </button>
    </div>
  </form>
</template>
