<script setup>
import { ref, computed, onMounted } from "vue";
import "@vuepic/vue-datepicker/dist/main.css";
import TextInput from "@/components/form/inputs/TextInput.vue";
import { useVuelidate } from "@vuelidate/core";
import { required, maxLength } from "@vuelidate/validators";

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

let isValidPhoneNumber = false;

function handleSubmit() {
  validate();

  if (isValidPhoneNumber) {
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
}

function clearData() {
  name.value = "";
  description.value = "";
  errorMessage.value = {};
}

onMounted(() => {
  if (props.location) {
    name.value = props.location.name;
    description.value = props.location.description;
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
        label="Address"
        type="text"
        name="address"
        place-holder="Fill provider description"
        v-model:value="address"
        :error-message="errorMessage.description"
      >
      </TextInput>
    </div>

    <div class="col-span-3"></div>

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
