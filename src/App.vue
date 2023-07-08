<script>
export default {
  mounted() {
    console.log(this.$route.path);
  },
};
</script>
<template>
  <router-view :key="$route.path"> </router-view>
</template>
