<script>
import VueDatePicker from "@vuepic/vue-datepicker";
import "@vuepic/vue-datepicker/dist/main.css";
export default {
  name: "date-picker",

  props: {
    label: String,
    value: String,
    errorMessage: String,
  },

  components: {
    VueDatePicker,
  },

  data() {
    return {
      date: "2000-1-1",
    };
  },

  methods: {
    updateInput(event) {
      this.$emit("update:value", event.target.value);
    },
    clearErrorMessage() {
      this.$emit("update:errorMessage", "");
    },
  },
};
</script>
<template>
  <div class="group">
    <label
      for="default-input"
      class="p-1 bg-white z-50 ms-4 mb-2 text-xs font-medium text-gray-900 dark:text-white group-focus-within:text-primary-400 group-focus-within:text-sm ease-in duration-150"
    >
      {{ label }}
    </label>
    <div
      class="-mt-2 flex items-center border-2 focus-within:border-primary-400 py-2 px-3 rounded-2xl mb-4"
    >
      <VueDatePicker :enable-time-picker="false" v-model="date"></VueDatePicker>
    </div>
    <p v-if="errorMessage" class="-mt-4 ms-4 text-danger-600 text-sm">
      {{ errorMessage }}
    </p>
  </div>
</template>
