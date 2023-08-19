<script setup>
import { ref, shallowRef, onMounted } from "vue";
import { UsersIcon } from "@heroicons/vue/24/outline";
import CategoryIcon from "@/components/icons/Category.vue";
import AccountIcon from "@/components/icons/Account.vue";
import ImportIcon from "@/components/icons/Import.vue";
import ExportIcon from "@/components/icons/Export.vue";
import PartnerIcon from "@/components/icons/Partner.vue";
import BranchIcon from "@/components/icons/Branch.vue";
import LogIcon from "@/components/icons/LogIcon.vue";
import PositionIcon from "@/components/icons/GroupPeople.vue";
import StockIcon from "@/components/icons/Stock.vue";
import TrackIcon from "@/components/icons/TrackIcon.vue";

import store from "../store";
const navigation = ref([]);

const permissions = JSON.parse(store.state.user.data.permissions);

function checkPermissions(permissionList) {
  return permissions.some(
    (permission) => permissionList.indexOf(permission.name) != -1
  );
}

function getNavigation() {
  if (checkPermissions(["manage-account"])) {
    navigation.value.push({
      name: "Account",
      href: "/accounts",
      icon: shallowRef(AccountIcon),
    });
  }

  if (checkPermissions(["manage-all-staff", "manage-branch-staff"])) {
    navigation.value.push({ name: "Staff", href: "/staffs", icon: UsersIcon });
  }

  if (checkPermissions(["manage-warehouse-branch"])) {
    navigation.value.push({
      name: "Warehouse branch",
      href: "/warehouse-branches",
      icon: shallowRef(BranchIcon),
    });
  }

  if (checkPermissions(["manage-provider"])) {
    navigation.value.push({
      name: "Provider",
      href: "/providers",
      icon: shallowRef(PartnerIcon),
    });
  }

  if (checkPermissions(["manage-position"])) {
    navigation.value.push({
      name: "Position",
      href: "/positions",
      icon: shallowRef(PositionIcon),
    });
  }

  if (checkPermissions(["manage-category"])) {
    navigation.value.push({
      name: "Category",
      href: "/categories",
      icon: shallowRef(CategoryIcon),
    });
  }

  if (checkPermissions(["manage-stock", "read-stock", "manage-branch-stock"])) {
    navigation.value.push({
      name: "Stock",
      href: "/stocks",
      icon: shallowRef(StockIcon),
    });
  }

  if (checkPermissions(["manage-import", "read-branch-import"])) {
    navigation.value.push({
      name: "Import",
      href: "/imports",
      icon: shallowRef(ImportIcon),
    });
  }

  if (checkPermissions(["manage-export", "read-branch-export"])) {
    navigation.value.push({
      name: "Export",
      href: "/exports",
      icon: shallowRef(ExportIcon),
    });
  }

  navigation.value.push({
    name: "Activity log",
    href: "/activity-log",
    icon: shallowRef(LogIcon),
  });

  if (store.state.user.data.role === "Nhan vien quan li") {
    navigation.value.push({
      name: "Track",
      href: "/track",
      icon: shallowRef(TrackIcon),
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
