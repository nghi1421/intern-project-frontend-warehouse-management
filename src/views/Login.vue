<script>
import TextInput from ".././components/form/inputs/TextInput.vue";
import PersonIcon from ".././components/icons/Person.vue";
import PasswordIcon from ".././components/icons/Password.vue";
import PrimaryButton from ".././components/form/buttons/PrimaryButton.vue";

export default {
  components: { TextInput, PersonIcon, PasswordIcon, PrimaryButton },

  data() {
    return {
      errorMessage: "",
      credential: {
        username: "",
        password: "",
        remember: false,
      },
    };
  },

  methods: {
    login() {
      this.$store
        .dispatch("login", this.credential)
        .then(() => {
          this.$router.push("Home");
        })
        .catch((err) => {
          console.log(err);
        });
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
          <TextInput label="Username" v-model:value="credential.username">
            <template v-slot:icon><PersonIcon /></template>
          </TextInput>
          <TextInput
            label="Password"
            type="password"
            v-model:value="credential.password"
            :errorMessage="errorMessage"
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
