<script>
export default {
  name: "Import",

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
    fill="currentColor"
    stroke="none"
    viewBox="0 0 24 24"
  >
    <path d="m12 18 4-5h-3V2h-2v11H8z"></path>
    <path
      d="M19 9h-4v2h4v9H5v-9h4V9H5c-1.103 0-2 .897-2 2v9c0 1.103.897 2 2 2h14c1.103 0 2-.897 2-2v-9c0-1.103-.897-2-2-2z"
    ></path>
  </svg>
</template>
