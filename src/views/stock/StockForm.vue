<script setup>
import { ref, onMounted } from "vue";
import "@vuepic/vue-datepicker/dist/main.css";
import DateInput from "@/components/form/inputs/DateInput.vue";
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

const errorMessage = ref({});

const locations = ref([]);

let importInformation = ref({});

let categoryInformation = ref({});

function handleSubmit() {
  if (validate()) {
    let data = {};

    if (expiryDate.value) {
      data = { ...data, expiry_date: expiryDate.value };
    } else {
      toast.info("Nothing to update.");
      return;
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
    return;
  }
}

onMounted(() => {
  locations.value = store.state.locations;
  if (props.stock) {
    importInformation.value = props.stock.import;
    categoryInformation.value = props.stock.category;
    expiryDate.value = props.stock.expiry_date;
  }
});

function validate() {
  if (expiryDate.value) {
    if (new Date(expiryDate.value) < new Date()) {
      errorMessage.value.expiryDate = "Expiry date must be after today.";
      return false;
    }
    return true;
  } else {
    return false;
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
