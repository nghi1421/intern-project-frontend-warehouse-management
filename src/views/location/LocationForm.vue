<script setup>
import { ref, computed, onMounted } from "vue";
import "@vuepic/vue-datepicker/dist/main.css";
import TextInput from "@/components/form/inputs/TextInput.vue";
import { useVuelidate } from "@vuelidate/core";
import { required, maxLength } from "@vuelidate/validators";
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

const props = defineProps({
  submit: Function,
  location: Object,
  closeForm: Function,
});

const rules = computed(() => ({
  name: {
    required,
    maxLength: maxLength(50),
  },
  description: {
    required,
    maxLength: maxLength(255),
  },
}));

const name = ref("");

const description = ref("");

const v$ = useVuelidate(rules, { name, description });

const errorMessage = ref({});

const warehouseBranches = ref([]);

const selectedWarehouseBranch = ref({});

const query = ref("");

let filteredWarehouseBranches = computed(() =>
  query.value === ""
    ? warehouseBranches.value
    : warehouseBranches.value.filter((warehoueBranch) =>
        warehoueBranch.name
          .toLowerCase()
          .replace(/\s+/g, "")
          .includes(query.value.toLowerCase().replace(/\s+/g, ""))
      )
);

function selectWarehouseBranch(warehouseBranch) {
  selectedWarehouseBranch.value = warehouseBranch;
}

function handleSubmit() {
  validate();

  let data = {
    name: name.value,
    description: description.value,
    warehouse_branch_id: 1,
  };
  if (props.location) {
    data = { ...data, id: props.location.id };
  }

  props.submit(data).then(function (isSuccess) {
    if (isSuccess) {
      clearData;
      props.closeForm();
    }
  });
}

function clearData() {
  name.value = "";
  description.value = "";
  errorMessage.value = {};
}

onMounted(() => {
  warehouseBranches.value = store.state.warehouseBranches;
  if (props.location) {
    name.value = props.location.name;
    description.value = props.location.description;
    selectedWarehouseBranch.value = warehouseBranches.value.find(
      (warehouseBranch) =>
        warehouseBranch.id === props.location.warehouse_branch_id
    );
  } else {
    selectedWarehouseBranch.value = warehouseBranches.value[0];
  }
});

function validate() {
  if (v$.value.$invalid) {
    errorMessage.value.name = v$.value.name.$error
      ? v$.value.name.$errors[0].$message
      : "";

    errorMessage.value.description = v$.value.description.$error
      ? v$.value.description.$errors[0].$message
      : "";
  }
}
</script>
<template>
  <form @submit.prevent="handleSubmit" class="grid grid-cols-6 gap-3 bg-white">
    <div class="col-span-3">
      <TextInput
        label="Name"
        type="text"
        name="name"
        place-holder="Fill provider name"
        v-model:value="name"
        :error-message="errorMessage.name"
      >
      </TextInput>
    </div>

    <div class="col-span-3">
      <TextInput
        label="description"
        type="text"
        name="description"
        place-holder="Fill provider description"
        v-model:value="description"
        :error-message="errorMessage.description"
      >
      </TextInput>
    </div>

    <div class="col-span-3">
      <label
        for="default-input"
        class="p-1 bg-white z-50 ms-4 mb-2 text-xs font-medium text-gray-900 dark:text-white group-focus-within:text-primary-400 group-focus-within:text-sm ease-in duration-150"
      >
        Warehouse branch
      </label>

      <div class="fixed w-[46%]">
        <Combobox v-model="selectedWarehouseBranch">
          <div class="relative mt-1">
            <div
              class="relative w-full cursor-default overflow-hidden rounded-lg bg-white text-left shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-teal-300 sm:text-sm"
            >
              <ComboboxInput
                class="w-full border-none py-2 pl-3 pr-10 text-sm leading-5 text-gray-900 focus:ring-0"
                :displayValue="(warehouseBranch) => warehouseBranch.name"
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
                class="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm"
              >
                <div
                  v-if="filteredWarehouseBranches.length === 0 && query !== ''"
                  class="relative cursor-default select-none py-2 px-4 text-gray-700"
                >
                  Nothing found.
                </div>

                <ComboboxOption
                  v-for="warehouseBranch in filteredWarehouseBranches"
                  as="template"
                  :key="warehouseBranch.id"
                  :value="warehouseBranch"
                  v-slot="{ selectedWarehouseBranch, active }"
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
                        'font-medium': selectedWarehouseBranch,
                        'font-normal': !selectedWarehouseBranch,
                      }"
                    >
                      {{ warehouseBranch.name }}
                    </span>
                    <span
                      v-if="selectedWarehouseBranch"
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
