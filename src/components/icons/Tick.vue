<script>
export default {
  name: "Tick",

  props: {
    size: {
      type: Number,
      default: 5,
    },
  },

  computed: {
    classSize() {
      return `w-${this.size} h-${this.size}`;
    },
  },
};
</script>
<template>
  <svg
    :class="classSize"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 15 15"
    fill="none"
  >
    <path
      d="M4 7.5L7 10l4-5m-3.5 9.5a7 7 0 110-14 7 7 0 010 14z"
      stroke="currentColor"
    ></path>
  </svg>
</template>
