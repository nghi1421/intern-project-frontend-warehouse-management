<script setup>
import { ref, computed, onMounted } from "vue";
import "@vuepic/vue-datepicker/dist/main.css";
import TextInput from "@/components/form/inputs/TextInput.vue";
import { useVuelidate } from "@vuelidate/core";
import { required, maxLength } from "@vuelidate/validators";

const props = defineProps({
  submit: Function,
  warehouseBranch: Object,
  closeForm: Function,
});

const rules = computed(() => ({
  name: {
    required,
    maxLength: maxLength(50),
  },
  address: {
    required,
    maxLength: maxLength(255),
  },
  phoneNumber: {
    required,
    maxLength: maxLength(15),
  },
}));

const name = ref("");

const address = ref("");

const phoneNumber = ref("");

const opening = ref(true);

const v$ = useVuelidate(rules, { name, address, phoneNumber });

const errorMessage = ref({});

let isValidPhoneNumber = false;

function handleSubmit() {
  validate();

  if (isValidPhoneNumber) {
    let data = {
      name: name.value,
      address: address.value,
      opening: opening.value ? 1 : 0,
      phone_number: phoneNumber.value,
    };

    if (props.warehouseBranch) {
      data = { ...data, id: props.warehouseBranch.id };
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
  opening.value = false;
  phoneNumber.value = "";
  errorMessage.value = {};
}

onMounted(() => {
  if (props.warehouseBranch) {
    name.value = props.warehouseBranch.name;
    address.value = props.warehouseBranch.address;
    opening.value = props.warehouseBranch.opening === 1 ? true : false;
    phoneNumber.value = props.warehouseBranch.phone_number;
    console.log(opening.value);
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

    errorMessage.value.address = v$.value.address.$error
      ? v$.value.address.$errors[0].$message
      : "";

    errorMessage.value.phoneNumber = v$.value.phoneNumber.$error
      ? v$.value.phoneNumber.$errors[0].$message
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
        place-holder="Fill warehouse branch name"
        v-model:value="name"
        :error-message="errorMessage.name"
      >
      </TextInput>
    </div>

    <div class="col-span-3">
      <TextInput
        label="Address"
        type="text"
        name="address"
        place-holder="Fill warehouse branch address"
        v-model:value="address"
        :error-message="errorMessage.address"
      >
      </TextInput>
    </div>

    <div class="col-span-3">
      <TextInput
        label="Phone number"
        type="text"
        v-model:value="phoneNumber"
        place-holder="Fill warehouse branch phone number"
        name="phone_number"
        :error-message="errorMessage.phoneNumber"
      >
      </TextInput>
    </div>
    <div class="col-span-3">
      <div class="flex gap-3 pt-6 ps-4">
        <label>Is opening?</label>
        <input type="checkbox" v-model="opening" />
      </div>
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
