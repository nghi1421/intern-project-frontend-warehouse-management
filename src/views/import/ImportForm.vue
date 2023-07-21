<script setup>
import { ref, computed, onMounted } from "vue";
import "@vuepic/vue-datepicker/dist/main.css";
import TextInput from "@/components/form/inputs/TextInput.vue";
import { useVuelidate } from "@vuelidate/core";
import { required, maxLength } from "@vuelidate/validators";

const props = defineProps({
  submit: Function,
  category: Object,
  closeForm: Function,
});

const rules = computed(() => ({
  staff_id: {
    required,
  },
  provider_id: {
    required,
  },
  unit: {
    required,
    maxLength: maxLength(2),
  },
}));

const name = ref("");

const description = ref("");

const status = ref("");

const v$ = useVuelidate(rules, { name, description, unit });

const errorMessage = ref({});

function handleSubmit() {
  validate();

  let data = {
    name: name.value,
    description: description.value,
    unit: unit.value,
  };

  if (props.category) {
    data = { ...data, id: props.category.id };
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
  unit.value = "";
  errorMessage.value = {};
}

onMounted(() => {
  if (props.category) {
    name.value = props.category.name;
    description.value = props.category.description;
    unit.value = props.category.unit;
  }
});

function validate() {
  errorMessage.value = {};

  v$.value.$validate();

  if (v$.value.$invalid) {
    errorMessage.value.name = v$.value.name.$error
      ? v$.value.name.$errors[0].$message
      : "";

    errorMessage.value.description = v$.value.description.$error
      ? v$.value.description.$errors[0].$message
      : "";

    errorMessage.value.unit = v$.value.unit.$error
      ? v$.value.unit.$errors[0].$message
      : "";
  }
}
</script>
<template>
  <form @submit.prevent="handleSubmit" class="grid grid-cols-6 gap-3 bg-white">
    <div class="col-span-6">
      <!-- user information -->
    </div>
    <div class="col-span-6">
      <!-- provider information -->
    </div>
    <!-- <div class="col-span-3">
      <label
        for="default-input"
        class="p-1 bg-white z-50 ms-4 mb-2 text-xs font-medium text-gray-900 dark:text-white group-focus-within:text-primary-400 group-focus-within:text-sm ease-in duration-150"
      >
        Position
      </label>

      <div class="fixed w-[46%]">
        <Combobox v-model="selectedPosition">
          <div class="relative mt-1">
            <div
              class="relative w-full cursor-default overflow-hidden rounded-lg bg-white text-left shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-teal-300 sm:text-sm"
            >
              <ComboboxInput
                class="w-full border-none py-2 pl-3 pr-10 text-sm leading-5 text-gray-900 focus:ring-0"
                :displayValue="(position) => position.name"
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
                  v-if="filteredPositions.length === 0 && query !== ''"
                  class="relative cursor-default select-none py-2 px-4 text-gray-700"
                >
                  Nothing found.
                </div>

                <ComboboxOption
                  v-for="position in filteredPositions"
                  as="template"
                  :key="position.id"
                  :value="position"
                  v-slot="{ selectedPosition, active }"
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
                        'font-medium': selectedPosition,
                        'font-normal': !selectedPosition,
                      }"
                    >
                      {{ position.name }}
                    </span>
                    <span
                      v-if="selectedPosition"
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
    </div> -->
    <div class="col-span-3">
      <TextInput
        label="Name"
        type="text"
        name="name"
        place-holder="Fill category name"
        v-model:value="name"
        :error-message="errorMessage.name"
      >
      </TextInput>
    </div>

    <div class="col-span-3">
      <TextInput
        label="Description"
        type="text"
        name="description"
        place-holder="Fill category description"
        v-model:value="description"
        :error-message="errorMessage.description"
      >
      </TextInput>
    </div>

    <div class="col-span-3">
      <TextInput
        label="Unit"
        v-model:value="unit"
        place-holder="Fill category unit"
        name="unit"
        :error-message="errorMessage.unit"
      >
      </TextInput>
    </div>

    <div class="col-span-6 flex">
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
