<script setup>
import { ref, computed, onMounted } from "vue";
import "@vuepic/vue-datepicker/dist/main.css";
import TextInput from "@/components/form/inputs/TextInput.vue";
import { useVuelidate } from "@vuelidate/core";
import { required, maxLength } from "@vuelidate/validators";
import IdenfifyIcon from "@/components/icons/Identify.vue";
import PersonIcon from "@/components/icons/Person.vue";
import LocationIcon from "@/components/icons/Location.vue";
import PhoneIcon from "@/components/icons/Phone.vue";

const props = defineProps({
  staff: Object,
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

const v$ = useVuelidate(rules, { name, description });

const errorMessage = ref({});

function handleSubmit() {
  validate();

  let data = {
    name: name.value,
    description: description.value,
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
  errorMessage.value = {};
}

onMounted(() => {
  if (props.category) {
    name.value = props.category.name;
    description.value = props.category.description;
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
    <div class="col-span-3">
      <label
        for="default-input"
        class="mt-4 p-1 bg-white z-50 ms-4 text-xs font-medium text-gray-900 dark:text-white"
      >
        Staff information
      </label>
      <div
        class="grid grid-cols-3 border-2 focus-within:border-primary-400 py-2 px-3 rounded-2xl mb-4"
      >
        <div class="col-span-1 flex gap-1 text-xs text-gray-500 mb-1">
          <div>
            <IdenfifyIcon></IdenfifyIcon>
          </div>
          <span class="inline-block align-middle">Staff ID</span>
        </div>
        <div class="col-span-2 text-xs mb-1 bg-slate-50 ps-1">
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
        <div class="col-span-2 text-xs mb-1 bg-slate-50 ps-1">
          <span>{{ staff.id }}</span>
        </div>

        <div class="col-span-1 flex gap-1 text-xs text-gray-500 mb-1">
          <div>
            <PersonIcon></PersonIcon>
          </div>
          <span class="inline-block align-middle">Provider Name</span>
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
