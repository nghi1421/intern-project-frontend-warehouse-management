<script setup>
import store from "../store";
import { ref, onMounted } from "vue";
import Table from "@/components/table/Table.vue";
import {
  TransitionRoot,
  TransitionChild,
  Dialog,
  DialogPanel,
  DialogTitle,
} from "@headlessui/vue";
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

const rows = ref([]);

const meta = ref({});

const isOpen = ref(false);

const links = ref([]);

const address = ref("");

const name = ref("");

const dob = ref("2000-1-1");

function fetchStaffsData() {
  store.dispatch("getStaffs").then((response) => {
    meta.value = response.data.meta;

    links.value = response.data.meta.links;

    rows.value = response.data.data;
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
    <div>
      <h2 class="p-4 font-semibold uppercase">Staff Table</h2>
      <button
        type="button"
        @click="openModal"
        class="rounded-md bg-black bg-opacity-20 px-4 py-2 text-sm font-medium text-white hover:bg-opacity-30 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75"
      >
        Open dialog
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
                          v-model:value="name"
                        >
                          <template v-slot:icon><PersonIcon /></template>
                        </TextInput>
                      </div>

                      <div class="col-span-3">
                        <TextInput
                          label="Phone number"
                          type="text"
                          v-model:value="phone_number"
                        >
                          <template v-slot:icon><PersonIcon /></template>
                        </TextInput>
                      </div>

                      <div class="col-span-3">
                        <TextInput label="Address" v-model:value="address">
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
                          <p
                            v-if="errorMessage"
                            class="-mt-4 ms-4 text-danger-600 text-sm"
                          >
                            {{ errorMessage }}
                          </p>
                        </div>
                      </div>

                      <div class="pt-4">
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
