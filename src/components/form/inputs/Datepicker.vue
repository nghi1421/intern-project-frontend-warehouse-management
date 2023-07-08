<script>
import VueDatePicker from "@vuepic/vue-datepicker";
import "@vuepic/vue-datepicker/dist/main.css";
export default {
  name: "date-picker",

  components: {
    VueDatePicker,
  },

  data() {
    return {
      date: "2000-1-1",
    };
  },
};
</script>
<template>
  <VueDatePicker :enable-time-picker="false" v-model="date"></VueDatePicker>
</template>
