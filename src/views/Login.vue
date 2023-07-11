<script>
import TextInput from "@/components/form/inputs/TextInput.vue";
import PersonIcon from "@/components/icons/Person.vue";
import PasswordIcon from "@/components/icons/Password.vue";
import PrimaryButton from "@/components/form/buttons/PrimaryButton.vue";
import { useVuelidate } from "@vuelidate/core";
import { required, minLength, maxLength } from "@vuelidate/validators";

export default {
  components: { TextInput, PersonIcon, PasswordIcon, PrimaryButton },

  setup() {
    return { v$: useVuelidate() };
  },

  data() {
    return {
      errorMessage: {
        username: "",
        password: "",
      },
      credential: {
        username: "",
        password: "",
        remember: false,
      },
      username: "",
      password: "",
    };
  },

  validations() {
    return {
      username: {
        required,
        minLengthValue: minLength(8),
        maxLengthValue: maxLength(255),
      },
      password: {
        required,
        minLengthValue: minLength(8),
        maxLengthValue: maxLength(255),
      },
    };
  },

  methods: {
    login() {
      this.$v.$touch();
      if (!this.$v.$invalid) {
        // Submit form
      }
      // console.log(v$.$errors);
      console.log(this.username);
      // this.$store
      //   .dispatch("login", this.credential)
      //   .then(() => {
      //     this.$router.push("/");
      //     this.$toast.success("Login successfully!");
      //   })
      //   .catch((error) => {
      //     console.log(error.response.data.message);
      //   });
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
            v-model:value="username"
            :errorMessage="v$.$silentErrors[0]?.$message"
          >
            <template v-slot:icon><PersonIcon /></template>
          </TextInput>
          <TextInput
            label="Password"
            type="password"
            v-model:value="password"
            :errorMessage="v$.$silentErrors[1]?.$message"
          >
            <template v-slot:icon><PasswordIcon /></template>
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
