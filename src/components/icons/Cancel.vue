<script>
export default {
  name: "Cancel",

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
    viewBox="0 0 256 256"
    fill="currentColor"
  >
    <path
      d="M128,24A104,104,0,1,0,232,128,104.1,104.1,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216Zm37.7-61.7a8.1,8.1,0,0,1,0,11.4,8.2,8.2,0,0,1-11.4,0L128,139.3l-26.3,26.4a8.2,8.2,0,0,1-11.4,0,8.1,8.1,0,0,1,0-11.4L116.7,128,90.3,101.7a8.1,8.1,0,0,1,11.4-11.4L128,116.7l26.3-26.4a8.1,8.1,0,0,1,11.4,11.4L139.3,128Z"
    ></path>
  </svg>
</template>
