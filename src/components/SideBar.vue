<script setup>
import { ref } from "vue";
import { UsersIcon } from "@heroicons/vue/24/outline";

const navigation = ref([
  { name: "User", href: "/users", icon: UsersIcon },
  { name: "Staff", href: "/staffs", icon: UsersIcon },
]);
</script>

<template>
  <ul role="list" class="flex flex-1 flex-col gap-y-7">
    <li>
      <ul role="list" class="-mx-2 space-y-1">
        <li v-for="item in navigation" :key="item.name">
          <router-link
            active-class="active"
            :to="item.href"
            class="hover:bg-primary-400 drop-shadow-lg text-white flex gap-x-3 rounded-lg p-2 text-sm leading-6 font-semibold"
          >
            <component
              :is="item.icon"
              class="h-6 w-6 shrink-0"
              aria-hidden="true"
            />
            {{ item.name }}
          </router-link>
        </li>
      </ul>
    </li>
  </ul>
</template>

<style scoped>
.active {
  @apply bg-primary-900 text-white;
}
</style>
