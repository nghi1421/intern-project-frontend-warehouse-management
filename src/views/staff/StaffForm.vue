<script setup>
import { ref, computed, onMounted } from "vue";
import store from "../../store";
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
import VueDatePicker from "@vuepic/vue-datepicker";
import "@vuepic/vue-datepicker/dist/main.css";
import TextInput from "@/components/form/inputs/TextInput.vue";
import PersonIcon from "@/components/icons/Person.vue";
import { useVuelidate } from "@vuelidate/core";
import { required, maxLength } from "@vuelidate/validators";

const props = defineProps({
  submit: Function,
  staff: Object,
  closeForm: Function,
});

const rules = computed(() => ({
  name: {
    required,
    maxLength: maxLength(255),
  },
  phoneNumber: {
    required,
  },
  address: {
    maxLength: maxLength(255),
  },
  dob: {
    required,
  },
}));

const address = ref("");

const name = ref("");

const phoneNumber = ref("");

const dob = ref("2000-1-1");

const genders = [
  {
    id: 0,
    name: "Female",
  },
  {
    id: 1,
    name: "Male",
  },
  {
    id: 2,
    name: "Other",
  },
];

const working = ref(true);

const selectedGender = ref(genders[0]);

const selectedPosition = ref({});

let query = ref("");

const positions = ref([]);

const v$ = useVuelidate(rules, { name, phoneNumber, address, dob });

let filteredPositions = computed(() =>
  query.value === ""
    ? positions.value
    : positions.value.filter((position) =>
        position.name
          .toLowerCase()
          .replace(/\s+/g, "")
          .includes(query.value.toLowerCase().replace(/\s+/g, ""))
      )
);

const errorMessage = ref({});

let isValidPhoneNumber = false;

function handleSubmit() {
  validate();
  if (isValidPhoneNumber) {
    let data = {
      name: name.value,
      phone_number: phoneNumber.value,
      address: address.value,
      dob: dob.value,
      working: working.value,
      position_id: selectedPosition.value.id,
      gender: selectedGender.value.id,
    };
    if (props.staff) {
      data = { ...data, id: props.staff.id };
    }
    props.submit(data).then(function (isSuccess) {
      if (isSuccess) {
        clearData;
        props.closeForm();
      }
    });
  }
}

function clearData() {
  name.value = "";
  address.value = "";
  phoneNumber.value = "";
  dob.value = "2000-1-1";
  working.value = true;
  errorMessage.value = {};
}

onMounted(() => {
  positions.value = store.state.positions;
  if (props.staff) {
    selectedGender.value = genders.find(
      (gender) => gender.name === props.staff.gender
    );

    selectedPosition.value = positions.value.find(
      (position) => position.id === props.staff.position_id
    );

    name.value = props.staff.name;
    address.value = props.staff.address;
    phoneNumber.value = props.staff.phone_number;
    dob.value = props.staff.dob;
    working.value = props.staff.working;
  } else {
    selectedPosition.value = positions.value[0];
  }
});
function validate() {
  errorMessage.value = {};

  v$.value.$validate();

  isValidPhoneNumber = phoneNumber.value.match(
    /(84|0[2|3|5|7|8|9])+([0-9]{8})\b/g
  );

  if (!isValidPhoneNumber) {
    errorMessage.value.phoneNumber = "Phone number is invalid";
  }

  if (v$.value.$invalid) {
    errorMessage.value.name = v$.value.name.$error
      ? v$.value.name.$errors[0].$message
      : "";

    errorMessage.value.phoneNumber = v$.value.phoneNumber.$error
      ? v$.value.phoneNumber.$errors[0].$message
      : "";

    errorMessage.value.dob = v$.value.dob.$error
      ? v$.value.dob.$errors[0].$message
      : "";

    errorMessage.value.address = v$.value.address.$error
      ? v$.value.address.$errors[0].$message
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
        v-model:value="name"
        :error-message="errorMessage.name"
      >
        <template v-slot:icon><PersonIcon /></template>
      </TextInput>
    </div>

    <div class="col-span-3">
      <TextInput
        label="Phone number"
        type="text"
        name="phone_number"
        v-model:value="phoneNumber"
        :error-message="errorMessage.phoneNumber"
      >
        <template v-slot:icon><PersonIcon /></template>
      </TextInput>
    </div>

    <div class="col-span-3">
      <TextInput
        label="Address"
        v-model:value="address"
        name="address"
        :error-message="errorMessage.address"
      >
        <template v-slot:icon><PersonIcon /></template>
      </TextInput>
    </div>

    <div class="col-span-3">
      <div class="group">
        <label
          for="default-input"
          class="p-1 bg-white z-50 ms-4 mb-2 text-xs font-medium text-gray-900 dark:text-white group-focus-within:text-primary-400 group-focus-within:text-sm ease-in duration-150"
        >
          Date of birth
        </label>
        <div
          class="-mt-2 border-2 focus-within:border-primary-400 flex items-center py-2 px-3 rounded-2xl mb-4"
        >
          <VueDatePicker
            class="-m-2"
            :enable-time-picker="false"
            v-model="dob"
          ></VueDatePicker>
        </div>
        <p v-if="errorMessage.dob" class="-mt-4 ms-4 text-danger-600 text-sm">
          {{ errorMessage.dob }}
        </p>
      </div>
    </div>
    <div class="col-span-3">
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
    </div>
    <div class="col-span-3">
      <div>
        <label
          for="default-input"
          class="p-1 bg-white z-50 ms-4 mb-2 text-xs font-medium text-gray-900 dark:text-white group-focus-within:text-primary-400 group-focus-within:text-sm ease-in duration-150"
        >
          Gender
        </label>
        <div class="fixed w-[46%]">
          <Listbox v-model="selectedGender">
            <div class="relative mt-1">
              <ListboxButton
                class="relative w-full cursor-default rounded-lg bg-white py-2 pl-3 pr-10 text-left shadow-md focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:text-sm"
              >
                <span class="block truncate">{{ selectedGender.name }}</span>
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
                    v-for="gender in genders"
                    :key="gender.name"
                    :value="gender"
                    as="template"
                  >
                    <li
                      :class="[
                        active
                          ? 'bg-amber-100 text-amber-900'
                          : 'text-gray-900',
                        'relative cursor-default select-none py-2 pl-10 pr-4',
                      ]"
                    >
                      <span
                        :class="[
                          selected ? 'font-medium' : 'font-normal',
                          'block truncate',
                        ]"
                        >{{ gender.name }}</span
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
    </div>
    <div class="col-span-3 mt-12 inline-flex">
      <label
        for="default-input"
        class="p-1 bg-white text-xs font-medium text-gray-900 dark:text-white group-focus-within:text-primary-400 group-focus-within:text-sm ease-in duration-150"
      >
        Is working?
      </label>
      <div>
        <input name="working" type="checkbox" :checked="working" />
      </div>
    </div>
    <div class="mt-12 flex">
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
