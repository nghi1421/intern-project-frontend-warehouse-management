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
  name: {
    required,
    maxLength: maxLength(50),
  },
  description: {
    maxLength: maxLength(255),
  },
  unit: {
    required,
    maxLength: maxLength(2),
  },
}));

const name = ref("");

const description = ref("");

const unit = ref("");

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
