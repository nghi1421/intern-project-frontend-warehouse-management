<script setup>
import { ref, shallowRef, onMounted } from "vue";
import { UsersIcon } from "@heroicons/vue/24/outline";
import CategoryIcon from "@/components/icons/Category.vue";
import ImportIcon from "@/components/icons/Import.vue";
import PartnerIcon from "@/components/icons/Partner.vue";
import BranchIcon from "@/components/icons/Branch.vue";
import LocationIcon from "@/components/icons/Location.vue";
import StockIcon from "@/components/icons/Stock.vue";
import store from "../store";
const navigation = ref([]);

const permissions = JSON.parse(store.state.user.data.permissions);

function checkPermission(permissionList) {
  return permissions.some(
    (permission) => permissionList.indexOf(permission.name) != -1
  );
}

function getNavigation() {
  if (checkPermission(["manage-user"])) {
    navigation.value.push({ name: "User", href: "/users", icon: UsersIcon });
  }

  if (checkPermission(["manage-all-staff", "manage-branch-staff"])) {
    navigation.value.push({ name: "Staff", href: "/staffs", icon: UsersIcon });
  }

  if (checkPermission(["manage-warehouse-branch"])) {
    navigation.value.push({
      name: "Warehouse branch",
      href: "/warehouse-branches",
      icon: shallowRef(BranchIcon),
    });
  }

  if (checkPermission(["manage-provider"])) {
    navigation.value.push({
      name: "Provider",
      href: "/providers",
      icon: shallowRef(PartnerIcon),
    });
  }

  if (checkPermission(["manage-location"])) {
    navigation.value.push({
      name: "Location",
      href: "/locations",
      icon: shallowRef(LocationIcon),
    });
  }

  if (checkPermission(["manage-category"])) {
    navigation.value.push({
      name: "Category",
      href: "/categories",
      icon: shallowRef(CategoryIcon),
    });
  }

  if (checkPermission(["manage-stock", "read-stock"])) {
    navigation.value.push({
      name: "Stock",
      href: "/stocks",
      icon: shallowRef(StockIcon),
    });
  }

  if (checkPermission(["manage-import"])) {
    navigation.value.push({
      name: "Import",
      href: "/imports",
      icon: shallowRef(ImportIcon),
    });
  }
}

onMounted(() => {
  getNavigation();
});
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
