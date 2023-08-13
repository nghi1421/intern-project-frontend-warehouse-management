<script setup>
import { onMounted, ref, computed } from "vue";
import store from "../store";
import { useVuelidate } from "@vuelidate/core";
import { required, maxLength } from "@vuelidate/validators";
import { useToast } from "vue-toast-notification";
import "@vuepic/vue-datepicker/dist/main.css";
import TextInput from "@/components/form/inputs/TextInput.vue";
import PersonIcon from "@/components/icons/Person.vue";
import { useRouter } from "vue-router";

const router = useRouter();

const toast = useToast();

const rules = computed(() => ({
  oldPassword: {
    required,
    maxLength: maxLength(255),
  },
  newPassword: {
    required,
    maxLength: maxLength(255),
  },
  newPasswordConfirmation: {
    required,
    maxLength: maxLength(255),
  },
}));

const oldPassword = ref("");

const newPassword = ref("");

const newPasswordConfirmation = ref("");

const v$ = useVuelidate(rules, {
  oldPassword,
  newPassword,
  newPasswordConfirmation,
});

const errorMessage = ref({});

function handleSubmit() {
  if (validate()) {
    let data = {
      old_password: oldPassword.value,
      new_password: newPassword.value,
      new_password_confirmation: newPasswordConfirmation.value,
    };
    changePassword(data);
  }
}

function changePassword(data) {
  return store.dispatch("changePassword", data).then((response) => {
    if (response.status === 200) {
      toast.success(response.data.message);
      store
        .dispatch("logout")
        .then((response) => {
          router.push("/login");
        })
        .catch((error) => {});
    } else {
      toast.error(response.data.message);
    }
  });
}

function validate() {
  errorMessage.value = {};

  v$.value.$validate();

  if (v$.value.$invalid) {
    errorMessage.value.oldPassword = v$.value.oldPassword.$error
      ? v$.value.oldPassword.$errors[0].$message
      : "";

    errorMessage.value.newPassword = v$.value.newPassword.$error
      ? v$.value.newPassword.$errors[0].$message
      : "";

    errorMessage.value.newPassword = v$.value.newPassword.$error
      ? v$.value.newPassword.$errors[0].$message
      : "";

    errorMessage.value.newPasswordConfirmation = v$.value
      .newPasswordConfirmation.$error
      ? v$.value.newPasswordConfirmation.$errors[0].$message
      : "";

    return false;
  }

  if (newPasswordConfirmation.value !== newPassword.value) {
    errorMessage.value.newPasswordConfirmation =
      "New password confirmation is not the same as the new password";
    return false;
  } else {
    errorMessage.value.newPasswordConfirmation = "";
    return true;
  }
}
</script>

<template>
  <h1
    class="text-2xl font-bold tracking-tight text-gray-950 sm:text-3xl mb-4 text-center px-3 py-2"
    style="line-height: inherit"
  >
    Change password
  </h1>
  <form
    @submit.prevent="handleSubmit"
    class="flex-col min-w-sm max-w-md gap-3 bg-white m-auto py-8"
  >
    <div class="col-span-3">
      <TextInput
        label="Old password"
        type="password"
        placeHolder="Please fill old password"
        name="old_password"
        v-model:value="oldPassword"
        :error-message="errorMessage.oldPassword"
      >
        <template v-slot:icon><PersonIcon /></template>
      </TextInput>
    </div>

    <div class="col-span-3">
      <TextInput
        label="New password"
        type="password"
        name="new_password"
        placeHolder="Please fill new password"
        v-model:value="newPassword"
        :error-message="errorMessage.newPassword"
      >
        <template v-slot:icon><PersonIcon /></template>
      </TextInput>
    </div>

    <div class="col-span-3">
      <TextInput
        label="Password confirmation"
        type="password"
        v-model:value="newPasswordConfirmation"
        placeHolder="Please fill password confirmation"
        name="new_password_confirmation"
        :error-message="errorMessage.newPasswordConfirmation"
      >
        <template v-slot:icon><PersonIcon /></template>
      </TextInput>
    </div>
    <div class="col-span-6 mt-4">
      <button
        type="submit"
        class="rounded-md border border-transparent bg-success-100 px-4 py-2 text-sm font-medium text-success-900 hover:bg-success-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-success-500 focus-visible:ring-offset-2"
      >
        Change password
      </button>
    </div>
  </form>
</template>
