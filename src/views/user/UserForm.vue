<script setup>
import { ref, computed, onMounted } from "vue";
import store from "../../store";
import {
  Listbox,
  ListboxButton,
  ListboxOptions,
  ListboxOption,
} from "@headlessui/vue";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/vue/20/solid";
import TextInput from "@/components/form/inputs/TextInput.vue";
import PersonIcon from "@/components/icons/Person.vue";
import PasswordIcon from "@/components/icons/Password.vue";
import { useVuelidate } from "@vuelidate/core";
import { required, maxLength } from "@vuelidate/validators";

const props = defineProps({
  submit: Function,
  account: Object,
  closeForm: Function,
});

const rules = computed(() => ({
  username: {
    required,
    maxLength: maxLength(255),
  },
  password: {
    required,
    maxLength: maxLength(255),
  },
  passwordConfirmation: {
    required,
    maxLength: maxLength(255),
  },
}));

const username = ref("");

const password = ref("");

const passwordConfirmation = ref("");

const selectedRole = ref({});

const roles = ref([]);

const v$ = useVuelidate(rules, { username, password, passwordConfirmation });

const errorMessage = ref({});

// const permissions = ref([]);

// const selectedPermissions = ref([]);

// const searchPermission = ref("");

// const searchSelectedPermission = ref("");

// let filteredPermissions = computed(() =>
//   searchPermission.value === ""
//     ? permissions.value
//     : permissions.value.filter((permission) =>
//         permission.name
//           .toLowerCase()
//           .replace(/\s+/g, "")
//           .includes(searchPermission.value.toLowerCase().replace(/\s+/g, ""))
//       )
// );

// let filterdSelectedPermissions = computed(() =>
//   searchSelectedPermission.value === ""
//     ? selectedPermissions.value
//     : selectedPermissions.value.filter((permission) =>
//         permission.name
//           .toLowerCase()
//           .replace(/\s+/g, "")
//           .includes(
//             searchSelectedPermission.value.toLowerCase().replace(/\s+/g, "")
//           )
//       )
// );

function handleSubmit() {
  if (validate()) {
    let data = {
      username: username.value,
      password: password.value,
      password_confirmation: passwordConfirmation.value,
      role_id: selectedRole.value.id,
      // permissions: selectedPermissions.value.map((permission) => permission.id),
    };

    if (props.account) {
      data = { ...data, id: props.account.id };
    }
    props.submit(data).then(function (isSuccess) {
      if (isSuccess) {
        clearData;
        props.closeForm();
      }
    });
  }
}

function clearData() {
  username.value = "";
  password.value = "";
  passwordConfirmation.value = "";
  selectedRole.value = roles.value[0];
  errorMessage.value = {};
}

// function selectPermissions() {
//   const moveList = permissions.value.filter(
//     (permission) => permission.selected
//   );
//   permissions.value = permissions.value.filter(
//     (permission) => !permission.selected
//   );
//   selectedPermissions.value = [
//     ...selectedPermissions.value,
//     ...moveList.map((permission) => {
//       return { ...permission, selected: false };
//     }),
//   ];
// }

// function selectAllPermissions() {
//   selectedPermissions.value = [
//     ...selectedPermissions.value,
//     ...permissions.value.map((permission) => {
//       return { ...permission, selected: false };
//     }),
//   ];

//   permissions.value = [];
// }

// function deselectPermissions() {
//   const moveList = selectedPermissions.value.filter(
//     (permission) => permission.selected
//   );
//   selectedPermissions.value = selectedPermissions.value.filter(
//     (permission) => !permission.selected
//   );
//   permissions.value = [
//     ...permissions.value,
//     ...moveList.map((permission) => {
//       return { ...permission, selected: false };
//     }),
//   ];
// }

// function deselectedAllPermissions() {
//   permissions.value = [
//     ...permissions.value,
//     ...selectedPermissions.value.map((permission) => {
//       return { ...permission, selected: false };
//     }),
//   ];

//   selectedPermissions.value = [];
// }

// function resetPermissions() {
//   selectedPermissions.value = props.import.categories.map((permission) => {
//     return { ...permission, selected: false };
//   });

//   const selectedPermissionIds = selectedPermissions.value.map(
//     (permission) => permission.id
//   );

//   permissions.value = store.state.permissions.filter(
//     (permission) => selectedPermissionIds.indexOf(permission.id) < 0
//   );
// }

// function selectPermission(permissionId) {
//   let indexRowSelected = permissions.value.findIndex(function (permission) {
//     return permission.id == permissionId;
//   });

//   permissions.value[indexRowSelected].selected =
//     !permissions.value[indexRowSelected].selected;
// }

// function selectSelectedPermission(permissionId) {
//   let indexRowSelected = selectedPermissions.value.findIndex(function (
//     permission
//   ) {
//     return permission.id == permissionId;
//   });

//   selectedPermissions.value[indexRowSelected].selected =
//     !selectedPermissions.value[indexRowSelected].selected;
// }

// watch(selectedRole, async (newRole) => {
//   permissions.value = [];
//   selectedPermissions.value = [];
//   for (let i = 0; i < store.state.permissions.length; i++) {
//     if (newRole.permissions.includes(store.state.permissions[i].id)) {
//       selectedPermissions.value.push({
//         ...store.state.permissions[i],
//         selected: false,
//       });
//     } else {
//       permissions.value.push({
//         ...store.state.permissions[i],
//         selected: false,
//       });
//     }
//   }
// });

function resetPassword() {
  //
}

onMounted(() => {
  roles.value = store.state.roles;

  if (props.account) {
    username.value = props.account.username;
    selectedRole.value = roles.value.find(
      (role) => role.id === props.account.role_id
    );
    username.value = props.account.username;
  } else {
    selectedRole.value = roles.value[0];
  }
  // for (let i = 0; i < roles.value.length; i++) {
  //   let rolePermissionIds = roles.value[i].permissions.map(
  //     (permission) => permission.id
  //   );

  //   roles.value[i] = { ...roles.value[i], permissions: rolePermissionIds };
  // }
});

function validate() {
  errorMessage.value = {};

  v$.value.$validate();

  if (v$.value.$invalid) {
    errorMessage.value.oldPassword = v$.value.oldPassword.$error
      ? v$.value.oldPassword.$errors[0].$message
      : "";

    errorMessage.value.password = v$.value.password.$error
      ? v$.value.password.$errors[0].$message
      : "";

    errorMessage.value.passwordConfirmation = v$.value.passwordConfirmation
      .$error
      ? v$.value.passwordConfirmation.$errors[0].$message
      : "";

    return false;
  }

  if (passwordConfirmation.value !== password.value) {
    errorMessage.value.passwordConfirmation =
      "Password confirmation is not the same as the new password";
    return false;
  } else {
    errorMessage.value.passwordConfirmation = "";
    return true;
  }
}
</script>
<template>
  <form @submit.prevent="handleSubmit" class="grid grid-cols-6 gap-3 bg-white">
    <div class="col-span-3">
      <TextInput
        label="Username"
        type="text"
        name="name"
        placeHolder="Please fill username"
        v-model:value="username"
        :error-message="errorMessage.username"
      >
        <template v-slot:icon><PersonIcon class="text-gray-400" /></template>
      </TextInput>
    </div>

    <div class="col-span-3">
      <TextInput
        disabled
        label="Password"
        type="password"
        placeHolder="Please fill password"
        name="phone_number"
        v-model:value="password"
        :error-message="errorMessage.password"
      >
        <template v-slot:icon><PasswordIcon class="text-gray-400" /></template>
      </TextInput>
    </div>

    <div class="col-span-3">
      <TextInput
        disabled
        label="Password confirmation"
        type="password"
        placeHolder="Please fill password confirmation"
        v-model:value="passwordConfirmation"
        name="address"
        :error-message="errorMessage.passwordConfirmation"
      >
        <template v-slot:icon><PasswordIcon class="text-gray-400" /></template>
      </TextInput>
    </div>

    <div class="col-span-3 -mt-2">
      <div>
        <label
          for="default-input"
          class="p-1 bg-white z-50 ms-4 mb-2 text-xs font-medium text-gray-900 dark:text-white group-focus-within:text-primary-400 group-focus-within:text-sm ease-in duration-150"
        >
          Role account
        </label>
        <div class="fixed w-[46%]">
          <Listbox v-model="selectedRole">
            <div class="relative mt-1">
              <ListboxButton
                class="relative w-full cursor-default rounded-lg bg-white py-2 pl-3 pr-10 text-left shadow-md focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:text-sm"
              >
                <span class="block truncate">{{ selectedRole.name }}</span>
                <span
                  class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2"
                >
                  <ChevronUpDownIcon
                    class="h-5 w-5 text-gray-400"
                    aria-hidden="true"
                  />
                </span>
              </ListboxButton>

              <transition
                leave-active-class="transition duration-100 ease-in"
                leave-from-class="opacity-100"
                leave-to-class="opacity-0"
              >
                <ListboxOptions
                  class="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm"
                >
                  <ListboxOption
                    v-slot="{ active, selected }"
                    v-for="role in roles"
                    :key="role.name"
                    :value="role"
                    as="template"
                  >
                    <li
                      :class="[
                        active
                          ? 'bg-amber-100 text-amber-900'
                          : 'text-gray-900',
                        'relative cursor-default select-none py-2 pl-10 pr-4',
                      ]"
                    >
                      <span
                        :class="[
                          selected ? 'font-medium' : 'font-normal',
                          'block truncate',
                        ]"
                        >{{ role.name }}</span
                      >
                      <span
                        v-if="selected"
                        class="absolute inset-y-0 left-0 flex items-center pl-3 text-amber-600"
                      >
                        <CheckIcon class="h-5 w-5" aria-hidden="true" />
                      </span>
                    </li>
                  </ListboxOption>
                </ListboxOptions>
              </transition>
            </div>
          </Listbox>
        </div>
      </div>
    </div>
    <!-- <div class="col-span-6 grid grid-cols-9 max-h-40">
      <div class="col-span-4 border-gray-400 flex flex-col overflow-auto">
        <div
          class="flex text-gray-400 border-gray-400 focus:border-primary-500 border shadow-md rounded-lg"
        >
          <div class="pt-2 ps-2">
            <svg
              class="w-5 h-5"
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                fill-rule="evenodd"
                d="M14.53 15.59a8.25 8.25 0 111.06-1.06l5.69 5.69a.75.75 0 11-1.06 1.06l-5.69-5.69zM2.5 9.25a6.75 6.75 0 1111.74 4.547.746.746 0 00-.443.442A6.75 6.75 0 012.5 9.25z"
              ></path>
            </svg>
          </div>
          <input
            class="flex-1 p-1 text-black rounded-lg"
            type="text"
            v-model="searchPermission"
            placeholder="Search permission by name"
          />
        </div>

        <table class="mt-2">
          <thead class="p-2">
            <tr class="bg-slate-500 text-white text-xs">
              <th>
                <span class="p-2 font-semibold">ID</span>
              </th>
              <th>
                <span class="p-2 font-semibold">Name</span>
              </th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="permission in filteredPermissions"
              :key="`cateogry-${permission.id}`"
              :class="{
                'text-gray-800 text-xs hover:bg-slate-100 bg-slate-300':
                  permission.selected,
                'text-gray-800 text-xs hover:bg-slate-100 bg-white':
                  !permission.selected,
              }"
              @click="selectPermission(permission.id)"
            >
              <th>
                <span class="p-2 font-semibold">{{ permission.id }}</span>
              </th>
              <th>
                <span class="p-2 font-semibold">{{ permission.name }}</span>
              </th>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="col-span-1 flex gap-1 flex-col min-h-60 items-center mt-12">
        <button
          @click="resetPermissions"
          class="w-7 max:h-7 bg-slate-200 hover:bg-slate-300 hover:shadow-md shadow-sm p-1 rounded-lg text-slate-900"
          type="button"
        >
          <svg
            class="w-5 h-5"
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
            <path
              d="M19.933 13.041a8 8 0 1 1 -9.925 -8.788c3.899 -1.002 7.935 1.007 9.425 4.747"
            ></path>
            <path d="M20 4v5h-5"></path>
          </svg>
        </button>
        <button
          @click="selectPermissions"
          class="w-7 max:h-7 bg-slate-200 hover:bg-slate-300 hover:shadow-md shadow-sm p-1 rounded-lg text-slate-900"
          type="button"
        >
          <RightOneIcon />
        </button>
        <button
          @click="selectAllPermissions"
          class="w-7 max:h-7 bg-slate-200 hover:bg-slate-300 hover:shadow-md shadow-sm p-1 rounded-lg text-slate-900"
          type="button"
        >
          <RightDoubleIcon />
        </button>
        <button
          @click="deselectPermissions"
          class="w-7 max:h-7 bg-slate-200 hover:bg-slate-300 hover:shadow-md shadow-sm p-1 rounded-lg text-slate-900"
          type="button"
        >
          <LeftOneIcon />
        </button>
        <button
          @click="deselectedAllPermissions"
          class="w-7 max:h-7 bg-slate-200 hover:bg-slate-300 hover:shadow-md shadow-sm p-1 rounded-lg text-slate-900"
          type="button"
        >
          <LeftDoubleIcon />
        </button>
      </div>
      <div class="col-span-4 border-gray-400 flex flex-col overflow-auto">
        <div
          class="flex text-gray-400 border-gray-400 focus:border-primary-500 border shadow-md rounded-lg"
        >
          <div class="pt-2 ps-2">
            <svg
              class="w-5 h-5"
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                fill-rule="evenodd"
                d="M14.53 15.59a8.25 8.25 0 111.06-1.06l5.69 5.69a.75.75 0 11-1.06 1.06l-5.69-5.69zM2.5 9.25a6.75 6.75 0 1111.74 4.547.746.746 0 00-.443.442A6.75 6.75 0 012.5 9.25z"
              ></path>
            </svg>
          </div>
          <input
            class="p-1 text-black rounded-lg"
            type="text"
            v-model="searchSelectedPermission"
            placeholder="Search selected permission by name"
          />
        </div>

        <table class="overflow-auto mt-2">
          <thead class="p-2">
            <tr class="bg-slate-500 text-white text-xs">
              <th>
                <span class="p-2 font-semibold">ID</span>
              </th>
              <th>
                <span class="p-2 font-semibold">Name</span>
              </th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="permission in filterdSelectedPermissions"
              :key="`selected-permission-${permission.id}`"
              :class="{
                'text-gray-800 text-xs hover:bg-slate-100 bg-slate-300':
                  permission.selected,
                'text-gray-800 text-xs hover:bg-slate-100 bg-white':
                  !permission.selected,
              }"
              @click="selectSelectedPermission(permission.id)"
            >
              <th>
                <span class="p-2 font-semibold">{{ permission.id }}</span>
              </th>
              <th>
                <span class="p-2 font-semibold">{{ permission.name }}</span>
              </th>
            </tr>
          </tbody>
        </table>
      </div>
    </div> -->
    <div class="mt-12 flex">
      <button
        type="submit"
        class="inline-flex justify-center rounded-md border border-transparent bg-success-100 px-4 py-2 text-sm font-medium text-success-900 hover:bg-success-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-success-500 focus-visible:ring-offset-2"
      >
        Submit
      </button>

      <button
        type="button"
        @click="resetPassword"
        class="ms-4 inline-flex justify-center rounded-md border border-transparent bg-danger-100 px-4 py-2 text-sm font-medium text-danger-900 hover:bg-danger-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-danger-500 focus-visible:ring-offset-2"
      >
        Reset password
      </button>
      <button
        type="button"
        class="ms-4 inline-flex justify-center rounded-md border border-transparent bg-amber-100 px-4 py-2 text-sm font-medium text-amber-900 hover:bg-amber-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2"
        @click="
          props.closeForm();
          clearData();
        "
      >
        Close
      </button>
    </div>
  </form>
</template>
