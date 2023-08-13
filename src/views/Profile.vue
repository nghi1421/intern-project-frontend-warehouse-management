<script setup>
import { onMounted, ref, computed } from "vue";
import store from "../store";
import { useVuelidate } from "@vuelidate/core";
import { required, maxLength } from "@vuelidate/validators";
import {
  Listbox,
  ListboxButton,
  ListboxOptions,
  ListboxOption,
} from "@headlessui/vue";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/vue/20/solid";
import { useToast } from "vue-toast-notification";
import "@vuepic/vue-datepicker/dist/main.css";
import TextInput from "@/components/form/inputs/TextInput.vue";
import DateInput from "@/components/form/inputs/DateInput.vue";

const toast = useToast();

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
    name: "Nữ",
  },
  {
    id: 1,
    name: "Nam",
  },
  {
    id: 2,
    name: "Khác",
  },
];

const selectedGender = ref(genders[0]);

const position = ref("");

const v$ = useVuelidate(rules, { name, phoneNumber, address, dob });

const errorMessage = ref({});

let isValidPhoneNumber = false;

const staffInformation = ref({});

function handleSubmit() {
  validate();
  if (isValidPhoneNumber) {
    let data = {
      id: staffInformation.value.id,
      name: name.value,
      phone_number: phoneNumber.value,
      address: address.value,
      dob: dob.value,
      working: staffInformation.value.working,
      position_id: staffInformation.value.position_id,
      gender: selectedGender.value.id,
      warehouse_branch_id: staffInformation.value.warehouse_branch_id,
    };
    updateStaff(data);
  }
}

function updateStaff(data) {
  return store.dispatch("updateStaff", data).then((response) => {
    if (response.status === 200) {
      toast.success(response.data.message);
    } else {
      toast.error(response.data.message);
    }
  });
}

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

async function fetchCurrentUserInformation() {
  await store.dispatch("searchStaff").then((response) => {
    if (response.status === 200) {
      staffInformation.value = response.data.data;

      selectedGender.value = genders.find(
        (gender) => gender.id === staffInformation.value.gender_id
      );
      position.value = staffInformation.value.position;
      name.value = staffInformation.value.name;
      address.value = staffInformation.value.address;
      phoneNumber.value = staffInformation.value.phone_number;
      dob.value = staffInformation.value.dob;
    }
  });
}

onMounted(() => {
  fetchCurrentUserInformation();
});
</script>

<template>
  <h1
    class="text-2xl font-bold tracking-tight text-gray-950 sm:text-3xl mb-4 px-3 py-2"
    style="line-height: inherit"
  >
    Profile
  </h1>
  <form
    @submit.prevent="handleSubmit"
    class="grid grid-cols-6 gap-3 bg-white px-3 py-4"
  >
    <div class="col-span-3">
      <TextInput
        label="Name"
        type="text"
        name="name"
        v-model:value="name"
        :error-message="errorMessage.name"
      >
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
      </TextInput>
    </div>

    <div class="col-span-3">
      <TextInput
        label="Address"
        v-model:value="address"
        name="address"
        :error-message="errorMessage.address"
      >
      </TextInput>
    </div>

    <div class="col-span-3">
      <DateInput
        label="Date of birth"
        name="dob"
        placeholder="dd/mm/yyyy"
        v-model:value="dob"
        :error-message="errorMessage.dob"
      >
      </DateInput>
    </div>
    <div class="col-span-3">
      <div>
        <label
          for="default-input"
          class="p-1 bg-white z-50 ms-4 mb-2 text-xs font-medium text-gray-900 dark:text-white group-focus-within:text-primary-400 group-focus-within:text-sm ease-in duration-150"
        >
          Gender
        </label>
        <div class="">
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
    <div class="col-span-6 mt-4">
      <button
        type="submit"
        class="rounded-md border border-transparent bg-success-100 px-4 py-2 text-sm font-medium text-success-900 hover:bg-success-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-success-500 focus-visible:ring-offset-2"
      >
        Update
      </button>
    </div>
  </form>
</template>
