<script>
import { computed } from "vue";
import { useStore } from "vuex";

export default {
  setup() {
    const store = useStore();

    const notification = computed(() => store.state.notification);

    return { notification };
  },
};
</script>
<template>
  <div
    v-if="notification.show"
    class="fixed w-[300px] left-4 bottom-4 py-2 px-4 text-white animate-fade-in-down"
    :class="[
      notification.type === 'success' ? 'bg-success-500' : 'bg-danger-500',
    ]"
  >
    {{ notification.message }}
  </div>
</template>
