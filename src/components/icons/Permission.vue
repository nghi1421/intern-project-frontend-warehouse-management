<script>
export default {
  name: "Permission",

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
    viewBox="0 0 48 48"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M20 10H6C4.89543 10 4 10.8954 4 12V38C4 39.1046 4.89543 40 6 40H42C43.1046 40 44 39.1046 44 38V35.5"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
    ></path>
    <path
      d="M10 23H18"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
    ></path>
    <path
      d="M10 31H34"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
    ></path>
    <circle
      cx="34"
      cy="16"
      r="6"
      fill="currentColor"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
    ></circle>
    <path
      d="M44.0001 28.4187C42.0469 24.6023 38 22 34 22C30 22 28.0071 23.1329 25.9503 25"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
    ></path>
  </svg>
</template>
