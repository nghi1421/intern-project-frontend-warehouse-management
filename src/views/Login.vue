<!-- eslint-disable vue/multi-word-component-names -->
<script>
import TextInput from "@/components/form/inputs/TextInput.vue";
import PersonIcon from "@/components/icons/Person.vue";
import PasswordIcon from "@/components/icons/Password.vue";
import PrimaryButton from "@/components/form/buttons/PrimaryButton.vue";
import { useVuelidate } from "@vuelidate/core";
import { required, minLength, maxLength } from "@vuelidate/validators";

export default {
  components: { TextInput, PersonIcon, PasswordIcon, PrimaryButton },

  data() {
    return {
      v$: useVuelidate(),
      errorMessage: {
        username: "",
        password: "",
      },
      username: "",
      password: "",
      remember: false,
    };
  },

  validations() {
    return {
      username: {
        required,
        minLength: minLength(8),
        maxLength: maxLength(255),
      },
      password: {
        required,
        minLength: minLength(8),
        maxLength: maxLength(255),
      },
    };
  },

  methods: {
    login() {
      this.v$.$validate();
      if (this.v$.$invalid) {
        this.errorMessage.username = this.v$.username.$errors[0].$message;
        this.errorMessage.password = this.v$.password.$errors[0].$message;
      } else {
        const credential = {
          username: this.username,
          password: this.password,
          remember: this.remember,
        };
        this.$store
          .dispatch("login", credential)
          .then(() => {
            this.$router.push("/");
            this.$toast.success("Login successfully!");
          })
          .catch((error) => {
            this.$toast.error(error.response.data.message);
          });
      }
    },
  },
};
</script>

<template>
  <div class="h-screen bg-slate-100">
    <div class="flex min-h-full flex-col justify-start px-6 py-12 lg:px-8">
      <div class="sm:mx-auto sm:w-full sm:max-w-sm h-full">
        <img
          class="mx-auto h-10 w-auto"
          src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600"
          alt="Your Company"
        />
        <h2
          class="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900"
        >
          Log in to your account
        </h2>
      </div>
      <div class="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <form
          @submit.prevent="login"
          class="p-6 bg-white rounded-lg drop-shadow-lg"
        >
          <TextInput
            label="Username"
            placeHolder="Fill username"
            v-model:value="username"
            v-model:errorMessage="errorMessage.username"
          >
            <template v-slot:icon
              ><PersonIcon class="text-gray-400"
            /></template>
          </TextInput>
          <TextInput
            label="Password"
            type="password"
            placeHolder="Fill password"
            v-model:value="password"
            v-model:errorMessage="errorMessage.password"
          >
            <template v-slot:icon
              ><PasswordIcon class="text-gray-400"
            /></template>
          </TextInput>
          <div class="pt-4">
            <PrimaryButton type="submit" label="Log in">
              Sign in
            </PrimaryButton>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>
