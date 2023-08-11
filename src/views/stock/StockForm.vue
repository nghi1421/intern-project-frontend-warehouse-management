<script setup>
import { ref, computed, onMounted } from "vue";
import "@vuepic/vue-datepicker/dist/main.css";
import DateInput from "@/components/form/inputs/DateInput.vue";
import {
  Combobox,
  ComboboxInput,
  ComboboxButton,
  ComboboxOptions,
  ComboboxOption,
  TransitionRoot,
} from "@headlessui/vue";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/vue/20/solid";
import store from "../../store";
import { useToast } from "vue-toast-notification";
import "vue-toast-notification/dist/theme-sugar.css";

const toast = useToast();

const props = defineProps({
  submit: Function,
  stock: Object,
  closeForm: Function,
});

const expiryDate = ref("");

// const v$ = useVuelidate(rules, { expiryDate });

const errorMessage = ref({});

const locations = ref([]);

const selectedLocation = ref({});

const queryLocation = ref("");

let importInformation = {};

let categoryInformation = {};

let filteredLocations = computed(() =>
  queryLocation.value === ""
    ? locations.value
    : locations.value.filter((warehoueBranch) =>
        warehoueBranch.name
          .toLowerCase()
          .replace(/\s+/g, "")
          .includes(queryLocation.value.toLowerCase().replace(/\s+/g, ""))
      )
);

function handleSubmit() {
  validate();

  if (selectedLocation.value === props.stock.location_id || expiryDate.value) {
    let data = {};

    if (selectedLocation.value) {
      data = { ...data, location_id: selectedLocation.value.id };
    }

    if (expiryDate.value) {
      data = { ...data, expiry_date: expiryDate.value };
    }

    if (props.stock) {
      data = { ...data, id: props.stock.id };
    }

    props.submit(data).then(function (isSuccess) {
      if (isSuccess) {
        props.closeForm();
      }
    });
  } else {
    toast.info("Nothing to update.");
  }
}

onMounted(() => {
  locations.value = store.state.locations;
  if (props.stock) {
    importInformation = props.stock.import;
    categoryInformation = props.stock.category;
    selectedLocation.value = locations.value.find(
      (location) => location.id === props.stock.location_id
    );
  }
});

function validate() {
  if (expiryDate.value) {
    if (new Date(expiryDate.value) < new Date()) {
      errorMessage.value.expiryDate = "Expiry date must be after today.";
    }
  }
}
</script>
<template>
  <form @submit.prevent="handleSubmit" class="grid grid-cols-6 gap-3 bg-white">
    <div class="col-span-3">
      <label
        for="default-input"
        class="mt-4 p-1 bg-white z-50 ms-4 text-xs font-medium text-gray-900 dark:text-white"
      >
        Category information
      </label>
      <div
        class="grid grid-cols-3 border-2 focus-within:border-primary-400 py-2 px-2 rounded-2xl mb-4"
      >
        <div class="col-span-1 flex gap-1 text-xs text-gray-500 mb-1">
          <span class="inline-block align-middle">Category ID</span>
        </div>
        <div class="col-span-2 text-xs mb-1 ps-1">
          <span>{{ categoryInformation?.id }}</span>
        </div>

        <div class="col-span-1 flex gap-1 text-xs text-gray-500 mb-1">
          <span class="inline-block align-middle">Name</span>
        </div>
        <div class="col-span-2 text-xs mb-1">
          <span>{{ categoryInformation?.name }}</span>
        </div>

        <div class="col-span-1 flex gap-1 text-xs text-gray-500 mb-1">
          <span class="inline-block align-middle">Description</span>
        </div>
        <div class="col-span-2 text-xs mb-1">
          <span>{{ categoryInformation?.description }}</span>
        </div>

        <div class="col-span-1 flex gap-1 text-xs text-gray-500 mb-1">
          <span class="inline-block align-middle">Unit</span>
        </div>
        <div class="col-span-2 text-xs mb-1">
          <span class="">{{ categoryInformation?.unit }}</span>
        </div>
      </div>
    </div>
    <div class="col-span-3">
      <label
        for="default-input"
        class="mt-4 p-1 bg-white z-50 ms-4 text-xs font-medium text-gray-900 dark:text-white"
      >
        Import information
      </label>
      <div
        class="grid grid-cols-3 border-2 focus-within:border-primary-400 py-2 px-2 rounded-2xl mb-4"
      >
        <div class="col-span-1 flex gap-1 text-xs text-gray-500 mb-1">
          <span class="inline-block align-middle">Import ID</span>
        </div>
        <div class="col-span-2 text-xs mb-1 ps-1">
          <span>{{ importInformation?.id }}</span>
        </div>

        <div class="col-span-1 flex gap-1 text-xs text-gray-500 mb-1">
          <span class="inline-block align-middle">Created by</span>
        </div>
        <div class="col-span-2 text-xs mb-1">
          <span>{{ importInformation?.created_by }}</span>
        </div>

        <div class="col-span-1 flex gap-1 text-xs text-gray-500 mb-1">
          <span class="inline-block align-middle">Provided by</span>
        </div>
        <div class="col-span-2 text-xs mb-1">
          <span>{{ importInformation?.provider }}</span>
        </div>

        <div class="col-span-1 flex gap-1 text-xs text-gray-500 mb-1">
          <span class="inline-block align-middle">Created at</span>
        </div>
        <div class="col-span-2 text-xs mb-1">
          <span>{{ importInformation?.created_at }}</span>
        </div>
      </div>
    </div>
    <div class="col-span-3">
      <DateInput
        label="Expiry date"
        name="expiry_date"
        placeholder="dd/mm/yyyy"
        v-model:value="expiryDate"
        :error-message="errorMessage.expiryDate"
      >
      </DateInput>
    </div>

    <div class="col-span-3 -mt-2">
      <label
        for="default-input"
        class="p-1 bg-white z-50 ms-4 mb-2 text-xs font-medium text-gray-900 dark:text-white group-focus-within:text-primary-400 group-focus-within:text-sm ease-in duration-150"
      >
        Location
      </label>

      <div class="fixed w-[46%]">
        <Combobox v-model="selectedLocation">
          <div class="relative mt-1">
            <div
              class="relative w-full cursor-default overflow-hidden rounded-lg bg-white text-left shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-teal-300 sm:text-sm"
            >
              <ComboboxInput
                class="w-full border-none py-2 pl-3 pr-10 text-sm leading-5 text-gray-900 focus:ring-0"
                :displayValue="(location) => location.name"
                @change="queryLocation = $event.target.value"
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
              @after-leave="queryLocation = ''"
            >
              <ComboboxOptions
                class="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm"
              >
                <div
                  v-if="filteredLocations.length === 0 && queryLocation !== ''"
                  class="relative cursor-default select-none py-2 px-4 text-gray-700"
                >
                  Nothing found.
                </div>

                <ComboboxOption
                  v-for="warehouseBranch in filteredLocations"
                  as="template"
                  :key="warehouseBranch.id"
                  :value="warehouseBranch"
                  v-slot="{ selectedLocation, active }"
                >
                  <li
                    class="relative cursor-default select-none py-2 pl-10 pr-4"
                    :class="{
                      'text-amber-600 bg-amber-100': active,
                      'text-gray-900': !active,
                    }"
                  >
                    <span
                      class="block truncate"
                      :class="{
                        'font-medium': selectedLocation,
                        'font-normal': !selectedLocation,
                      }"
                    >
                      {{ warehouseBranch.name }}
                    </span>
                    <span
                      v-if="selectedLocation"
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

    <div class="col-span-6 flex mt-12">
      <button
        type="submit"
        class="inline-flex justify-center rounded-md border border-transparent bg-success-100 px-4 py-2 text-sm font-medium text-success-900 hover:bg-success-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-success-500 focus-visible:ring-offset-2"
      >
        Submit
      </button>
      <button
        type="button"
        class="ms-4 inline-flex justify-center rounded-md border border-transparent bg-amber-100 px-4 py-2 text-sm font-medium text-amber-900 hover:bg-amber-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2"
        @click="props.closeForm()"
      >
        Close
      </button>
    </div>
  </form>
</template>
