<script>
export default {
  props: {
    columns: Array,
    item: Object,
  },
  data() {},
};
</script>

<template>
  <tr>
    <td class="border-dashed border-t border-gray-200">
      <span
        class="text-gray-700 px-6 py-3 flex items-center"
        v-text="user.userId"
      ></span>
    </td>
    <td class="border-dashed border-t border-gray-200">
      <span
        class="text-gray-700 px-6 py-3 flex items-center"
        v-text="user.firstName"
      ></span>
    </td>
    <td class="border-dashed border-t border-gray-200">
      <span
        class="text-gray-700 px-6 py-3 flex items-center"
        v-text="user.lastName"
      ></span>
    </td>
    <td class="border-dashed border-t border-gray-200">
      <span
        class="text-gray-700 px-6 py-3 flex items-center"
        v-text="user.emailAddress"
      ></span>
    </td>
    <td class="border-dashed border-t border-gray-200">
      <span
        class="text-gray-700 px-6 py-3 flex items-center"
        v-text="user.gender"
      ></span>
    </td>
    <td class="border-dashed border-t border-gray-200">
      <span
        class="text-gray-700 px-6 py-3 flex items-center"
        v-text="user.phoneNumber"
      ></span>
    </td>
  </tr>
</template>
