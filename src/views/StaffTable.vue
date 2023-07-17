<script setup>
import store from "../store";
import { ref, onMounted, computed } from "vue";
import Table from "@/components/table/Table.vue";
import {
  Combobox,
  ComboboxInput,
  ComboboxButton,
  ComboboxOptions,
  ComboboxOption,
  TransitionRoot,
  TransitionChild,
  Listbox,
  ListboxButton,
  ListboxOptions,
  ListboxOption,
  Dialog,
  DialogPanel,
  DialogTitle,
} from "@headlessui/vue";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/vue/20/solid";
import VueDatePicker from "@vuepic/vue-datepicker";
import "@vuepic/vue-datepicker/dist/main.css";
import TextInput from "@/components/form/inputs/TextInput.vue";
import PersonIcon from "@/components/icons/Person.vue";
import PasswordIcon from "@/components/icons/Password.vue";
import PrimaryButton from "@/components/form/buttons/PrimaryButton.vue";
import { useVuelidate } from "@vuelidate/core";
import { required, minLength, maxLength } from "@vuelidate/validators";

const columns = ref([
  {
    key: "id",
    value: "Staff ID",
  },
  {
    key: "name",
    value: "Name",
  },
  {
    key: "position",
    value: "Position",
  },
  {
    key: "phone_number",
    value: "Phone number",
  },
  {
    key: "gender",
    value: "Gender",
  },
  {
    key: "status",
    value: "Status",
  },
]);

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

const selectedGender = ref(genders[0]);

const rows = ref([]);

const meta = ref({});

const isOpen = ref(false);

const links = ref([]);

const address = ref("");

const name = ref("");

const phoneNumber = ref("");

const dob = ref("2000-1-1");

const selectedPosition = ref({});

let query = ref("");

const positions = ref([]);

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
async function fetchStaffsData() {
  await store.dispatch("getStaffs").then((response) => {
    meta.value = response.data.meta;

    links.value = response.data.meta.links;

    rows.value = response.data.data;
  });

  await store.dispatch("getPositions").then((response) => {
    positions.value = response.data.positions;

    selectedPosition.value = positions.value[0];
  });
}

function closeModal() {
  isOpen.value = false;
}
function openModal() {
  isOpen.value = true;
}

onMounted(() => {
  fetchStaffsData();
});
</script>
<template>
  <div>
    <div class="flex flex-1">
      <h2 class="p-4 font-semibold uppercase">Staff Table</h2>
      <button
        type="button"
        @click="openModal"
        class="rounded-md m-2 bg-success-600 px-4 py-2 text-sm font-medium text-white hover:bg-opacity-80 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75"
      >
        Create new staff
      </button>
    </div>
    <div>
      <TransitionRoot appear :show="isOpen" as="template">
        <Dialog as="div" @close="closeModal" class="relative z-50">
          <TransitionChild
            as="template"
            enter="duration-300 ease-out"
            enter-from="opacity-0"
            enter-to="opacity-100"
            leave="duration-200 ease-in"
            leave-from="opacity-100"
            leave-to="opacity-0"
          >
            <div class="fixed inset-0 bg-black bg-opacity-25" />
          </TransitionChild>

          <div class="fixed inset-0 overflow-y-auto">
            <div
              class="flex min-h-full items-center justify-center p-4 text-center"
            >
              <TransitionChild
                as="template"
                enter="duration-300 ease-out"
                enter-from="opacity-0 scale-95"
                enter-to="opacity-100 scale-100"
                leave="duration-200 ease-in"
                leave-from="opacity-100 scale-100"
                leave-to="opacity-0 scale-95"
              >
                <DialogPanel
                  class="w-full max-w-3xl transform rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all"
                >
                  <DialogTitle
                    as="h3"
                    class="text-lg font-medium leading-6 text-gray-900"
                  >
                    Create new staff
                  </DialogTitle>

                  <div class="mt-2">
                    <form class="grid grid-cols-6 gap-3 bg-white">
                      <div class="col-span-3">
                        <TextInput
                          label="Name"
                          type="text"
                          name="name"
                          v-model:value="name"
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
                        >
                          <template v-slot:icon><PersonIcon /></template>
                        </TextInput>
                      </div>

                      <div class="col-span-3">
                        <TextInput
                          label="Address"
                          v-model:value="address"
                          name="address"
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
                          <!-- <p
                            v-if="errorMessage"
                            class="-mt-4 ms-4 text-danger-600 text-sm"
                          >
                            {{ errorMessage }}
                          </p> -->
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
                                    v-if="
                                      filteredPositions.length === 0 &&
                                      query !== ''
                                    "
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
                                        <CheckIcon
                                          class="h-5 w-5"
                                          aria-hidden="true"
                                        />
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
                                  <span class="block truncate">{{
                                    selectedGender.name
                                  }}</span>
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
                                            selected
                                              ? 'font-medium'
                                              : 'font-normal',
                                            'block truncate',
                                          ]"
                                          >{{ gender.name }}</span
                                        >
                                        <span
                                          v-if="selected"
                                          class="absolute inset-y-0 left-0 flex items-center pl-3 text-amber-600"
                                        >
                                          <CheckIcon
                                            class="h-5 w-5"
                                            aria-hidden="true"
                                          />
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
                      <div class="pt-8">
                        <button
                          type="button"
                          class="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                          @click="closeModal"
                        >
                          Submit
                        </button>
                      </div>
                    </form>
                  </div>
                </DialogPanel>
              </TransitionChild>
            </div>
          </div>
        </Dialog>
      </TransitionRoot>
    </div>
  </div>

  <Table :columns="columns" :rows="rows" :meta="meta" :links="links"></Table>
</template>

<style scoped>
input.dp__pointer {
  @apply border-none;
}
</style>
