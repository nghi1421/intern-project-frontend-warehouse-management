<script>
export default {
  name: "Report",

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
    width="24"
    height="24"
    viewBox="0 0 24 24"
    stroke-width="2"
    stroke="currentColor"
    fill="none"
    stroke-linecap="round"
    stroke-linejoin="round"
  >
    <path d="M8 5h-2a2 2 0 0 0 -2 2v12a2 2 0 0 0 2 2h5.697"></path>
    <path d="M18 14v4h4"></path>
    <path d="M18 11v-4a2 2 0 0 0 -2 -2h-2"></path>
    <rect x="8" y="3" width="6" height="4" rx="2"></rect>
    <circle cx="18" cy="18" r="4"></circle>
    <path d="M8 11h4"></path>
    <path d="M8 15h3"></path>
  </svg>
</template>
