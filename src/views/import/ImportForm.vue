<script setup>
import { ref, onMounted, computed } from "vue";
import store from "../../store";
import {
  Combobox,
  ComboboxInput,
  ComboboxButton,
  ComboboxOptions,
  ComboboxOption,
  TransitionRoot,
} from "@headlessui/vue";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/vue/20/solid";
import IdenfifyIcon from "@/components/icons/Identify.vue";
import PersonIcon from "@/components/icons/Person.vue";
import LocationIcon from "@/components/icons/Location.vue";
import PhoneIcon from "@/components/icons/Phone.vue";
import RightOneIcon from "@/components/icons/RightOne.vue";
import RightDoubleIcon from "@/components/icons/RightDouble.vue";
import LeftOneIcon from "@/components/icons/LeftOne.vue";
import LeftDoubleIcon from "@/components/icons/LeftDouble.vue";
import { useToast } from "vue-toast-notification";
import "vue-toast-notification/dist/theme-sugar.css";
import TickIcon from "@/components/icons/Tick.vue";

const toast = useToast();

const props = defineProps({
  import: Object,
  staff: Object,
  submit: Function,
  closeForm: Function,
});

const status = ref("");

const providers = ref([]);

const selectedProvider = ref({});

const query = ref("");

const warehouseBranches = ref([]);

const categories = ref([]);

const selectedCategories = ref([]);

const selectedWarehouseBranch = ref({});

const searchCategory = ref("");

const searchSelectedCategory = ref("");

const warehouseBranchQuery = ref("");

let filteredWarehouseBranches = computed(() =>
  warehouseBranchQuery.value === ""
    ? warehouseBranches.value
    : warehouseBranches.value.filter((warehoueBranch) =>
        warehoueBranch.name
          .toLowerCase()
          .replace(/\s+/g, "")
          .includes(
            warehouseBranchQuery.value.toLowerCase().replace(/\s+/g, "")
          )
      )
);

let filteredCategories = computed(() =>
  searchCategory.value === ""
    ? categories.value
    : categories.value.filter((category) =>
        category.name
          .toLowerCase()
          .replace(/\s+/g, "")
          .includes(searchCategory.value.toLowerCase().replace(/\s+/g, ""))
      )
);

let filterdSelectedCategories = computed(() =>
  searchSelectedCategory.value === ""
    ? selectedCategories.value
    : selectedCategories.value.filter((category) =>
        category.name
          .toLowerCase()
          .replace(/\s+/g, "")
          .includes(
            searchSelectedCategory.value.toLowerCase().replace(/\s+/g, "")
          )
      )
);

let filteredProviders = computed(() =>
  query.value === ""
    ? providers.value
    : providers.value.filter((provider) =>
        provider.name
          .toLowerCase()
          .replace(/\s+/g, "")
          .includes(query.value.toLowerCase().replace(/\s+/g, ""))
      )
);

const permissions = JSON.parse(store.state.user.data.permissions);

const steps = ref([
  {
    status_id: 1,
    id: "01",
    name: "Khởi tạo",
    description: "Nhân viên quản lí tạo phiếu nhập hàng.",
    status: "complete",
  },
  {
    status_id: 2,
    id: "02",
    name: "Đang kiểm tra",
    description: "Thủ kho chi nhánh phiếu nhập hàng kiểm tra phiếu nhập hàng.",
    status: "complete",
  },
  {
    status_id: 3,
    id: "03",
    name: "Hoàn thành",
    description: "Thủ kho hoàn thành phiếu nhập hàng.",
    status: "complete",
  },
  // upcoming
]);

const stepsHover = ref([
  {
    status_id: 1,
    id: "01",
    name: "Khởi tạo",
    description: "Nhân viên quản lí tạo phiếu nhập hàng.",
    status: "complete",
  },
  {
    status_id: 2,
    id: "02",
    name: "Đang kiểm tra",
    description: "Thủ kho chi nhánh phiếu nhập hàng kiểm tra phiếu nhập hàng.",
    status: "complete",
  },
  {
    status_id: 3,
    id: "03",
    name: "Hoàn thành",
    description: "Thủ kho hoàn thành phiếu nhập hàng.",
    status: "complete",
  },
]);

const stepsLeaveHover = ref([]);

function checkPermissions(permissionList) {
  return permissions.some(
    (permission) => permissionList.indexOf(permission.name) != -1
  );
}

function handleSubmit() {
  if (validate()) {
    let data = {
      staff_id: props.staff.id,
      provider_id: selectedProvider.value.id,
      status: 1,
      warehouse_branch_id: selectedWarehouseBranch.value.id,
      categories: selectedCategories.value.map((category) => category.id),
      amounts: selectedCategories.value.map((category) => category.amount),
      unit_prices: selectedCategories.value.map(
        (category) => category.unit_price
      ),
    };

    if (props.import) {
      data = {
        ...data,
        id: props.import.id,
      };

      if (checkPermissions(["update-import-status"])) {
        data = { ...data, status: props.import.status_id + 1 };
      }
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
  status.value = "";
}

function selectProvider(proivder) {
  selectedProvider.value = proivder;
}

function validateButton() {
  if (!checkPermissions(["manage-import"])) {
    toast.info("You don't have access to do this action");
    return false;
  }

  if (props.import?.status_id === 0) {
    toast.info("Import is canceled. Could not change");
    return false;
  }

  if (props.import?.status_id === 3) {
    toast.info("Import is completed. Could not change");
    return false;
  }

  return true;
}

function selectCategories() {
  if (validateButton()) {
    const moveList = categories.value.filter((category) => category.selected);
    categories.value = categories.value.filter(
      (category) => !category.selected
    );
    selectedCategories.value = [
      ...selectedCategories.value,
      ...moveList.map((category) => {
        return { ...category, selected: false, amount: 0, unit_price: 0 };
      }),
    ];
  }
}

function selectAllCategories() {
  if (validateButton()) {
    selectedCategories.value = [
      ...selectedCategories.value,
      ...categories.value.map((category) => {
        return { ...category, selected: false, amount: 0, unit_price: 0 };
      }),
    ];

    categories.value = [];
  }
}

function deselectCategories() {
  if (validateButton()) {
    const moveList = selectedCategories.value.filter(
      (category) => category.selected
    );
    selectedCategories.value = selectedCategories.value.filter(
      (category) => !category.selected
    );
    categories.value = [
      ...categories.value,
      ...moveList.map((category) => {
        return { ...category, selected: false };
      }),
    ];
  }
}

function deselectedAllCategories() {
  if (validateButton()) {
    categories.value = [
      ...categories.value,
      ...selectedCategories.value.map((category) => {
        return { ...category, selected: false };
      }),
    ];

    selectedCategories.value = [];
  }
}

function resetCategories() {
  selectedCategories.value = props.import.categories.map((category) => {
    return { ...category, selected: false };
  });

  const selectedCategoryIds = selectedCategories.value.map(
    (category) => category.id
  );

  categories.value = store.state.categories.filter(
    (category) => selectedCategoryIds.indexOf(category.id) < 0
  );
}

onMounted(() => {
  providers.value = store.state.providers;
  warehouseBranches.value = store.state.warehouseBranches;

  if (props.import) {
    for (let i = 0; i < steps.value.length; i++) {
      if (steps.value[i].status_id > props.import?.status_id) {
        steps.value[i] = { ...steps.value[i], status: "upcoming" };
      } else if (
        steps.value[i].status_id === props.import?.status_id &&
        props.import?.status_id !== 3
      ) {
        steps.value[i] = { ...steps.value[i], status: "current" };
      }
    }

    for (let i = 0; i < stepsHover.value.length; i++) {
      if (stepsHover.value[i].status_id > props.import?.status_id + 1) {
        stepsHover.value[i] = {
          ...stepsHover.value[i],
          status: "upcoming",
        };
      } else if (
        stepsHover.value[i].status_id - 1 === props.import?.status_id &&
        props.import?.status_id !== 3
      ) {
        stepsHover.value[i] = {
          ...stepsHover.value[i],
          status: "current",
        };
      }
    }

    stepsLeaveHover.value = steps.value;

    selectedProvider.value = props.import.provider;
    selectedWarehouseBranch.value = warehouseBranches.value.find(
      (warehouseBranch) =>
        warehouseBranch.id === props.import.warehouse_branch_id
    );

    selectedCategories.value = props.import.categories.map((category) => {
      return { ...category, selected: false };
    });

    const selectedCategoryIds = selectedCategories.value.map(
      (category) => category.id
    );

    categories.value = store.state.categories.filter(
      (category) => selectedCategoryIds.indexOf(category.id) < 0
    );

    categories.value = categories.value.map((category) => {
      return { ...category, selected: false };
    });
  } else {
    selectedProvider.value = providers.value[0];
    selectedWarehouseBranch.value = warehouseBranches.value[0];
    categories.value = store.state.categories.map((category) => {
      return { ...category, selected: false };
    });
  }
  if (warehouseBranches.value.length === 0) {
    toast.info("Please add warehouse branch, before create import.");
    props.closeForm();
  }
  if (providers.value.length === 0) {
    toast.info("Please add provider, before create import.");
    props.closeForm();
  }
  if (categories.value.length === 0) {
    toast.info("Please add categories, before create import.");
    props.closeForm();
  }
});

function selectCategory(categoryId) {
  let indexRowSelected = categories.value.findIndex(function (row) {
    return row.id == categoryId;
  });

  categories.value[indexRowSelected].selected =
    !categories.value[indexRowSelected].selected;
}

function selectSelectedCategory(categoryId) {
  let indexRowSelected = selectedCategories.value.findIndex(function (row) {
    return row.id == categoryId;
  });

  selectedCategories.value[indexRowSelected].selected =
    !selectedCategories.value[indexRowSelected].selected;
}

function validate() {
  if (selectedCategories.value.length > 0) {
    const isInvalid = selectedCategories.value.some(
      (category) => category.amount <= 0 || category.unit_price <= 0
    );
    if (isInvalid) {
      toast.warning(
        "Please check your amount and unit price of selected categories"
      );
      return false;
    }
    return true;
  }
  toast.warning("Please select at least one category");
  return false;
}

function hoverSubmit() {
  if (props.import?.status_id !== 0 && props.import?.status_id !== 3) {
    steps.value = stepsHover.value;
  }
}

function leaveHoverSubmit() {
  if (props.import?.status_id !== 0 && props.import?.status_id !== 3) {
    steps.value = stepsLeaveHover.value;
  }
}
</script>
<template>
  <form @submit.prevent="handleSubmit" class="grid grid-cols-6 gap-3 bg-white">
    <div class="col-span-3">
      <label
        for="default-input"
        class="mt-4 p-1 bg-white z-50 ms-4 text-xs font-medium text-gray-900 dark:text-white"
      >
        Staff information
      </label>
      <div
        class="grid grid-cols-3 border-2 focus-within:border-primary-400 py-2 px-2 rounded-2xl mb-4"
      >
        <div class="col-span-1 flex gap-1 text-xs text-gray-500 mb-1">
          <div>
            <IdenfifyIcon></IdenfifyIcon>
          </div>
          <span class="inline-block align-middle">Staff ID</span>
        </div>
        <div class="col-span-2 text-xs mb-1 ps-1">
          <span>{{ staff?.id }}</span>
        </div>

        <div class="col-span-1 flex gap-1 text-xs text-gray-500 mb-1">
          <div>
            <PersonIcon></PersonIcon>
          </div>
          <span class="inline-block align-middle">Full Name</span>
        </div>
        <div class="col-span-2 text-xs mb-1">
          <span>{{ staff?.name }}</span>
        </div>

        <div class="col-span-1 flex gap-1 text-xs text-gray-500 mb-1">
          <div>
            <PhoneIcon></PhoneIcon>
          </div>
          <span class="inline-block align-middle">Phone Number</span>
        </div>
        <div class="col-span-2 text-xs mb-1">
          <span>{{ staff?.phone_number }}</span>
        </div>

        <div class="col-span-1 flex gap-1 text-xs text-gray-500 mb-1">
          <div>
            <LocationIcon></LocationIcon>
          </div>
          <span class="inline-block align-middle">Address</span>
        </div>
        <div class="col-span-2 text-xs mb-1">
          <span class="">{{ staff?.address }}</span>
        </div>
      </div>
    </div>
    <div class="col-span-3">
      <label
        for="default-input"
        class="mt-4 p-1 bg-white z-50 ms-4 text-xs font-medium text-gray-900 dark:text-white"
      >
        Provider information
      </label>
      <div
        class="grid grid-cols-3 border-2 focus-within:border-primary-400 py-2 px-3 rounded-2xl mb-4"
      >
        <div class="col-span-1 flex gap-1 text-xs text-gray-500 mb-1">
          <div>
            <IdenfifyIcon></IdenfifyIcon>
          </div>
          <span class="inline-block align-middle">Provider ID</span>
        </div>
        <div class="col-span-2 text-xs mb-1 ps-1">
          <span>{{ selectedProvider.id }}</span>
        </div>

        <div class="col-span-1 flex gap-1 text-xs text-gray-500 mb-1">
          <div>
            <PersonIcon></PersonIcon>
          </div>
          <span class="inline-block align-middle">Provider Name</span>
        </div>
        <div class="col-span-2 text-xs mb-1">
          <div v-if="props.import" class="col-span-2 text-xs mb-1 ps-1">
            <span>{{ selectedProvider.name }}</span>
          </div>
          <div v-else class="fixed w-[26%]">
            <Combobox v-model="selectedProvider">
              <div class="relative">
                <div
                  class="relative w-full cursor-default overflow-hidden rounded-lg bg-white text-left shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-teal-300 sm:text-sm"
                >
                  <ComboboxInput
                    class="w-full border-none text-xs pr-10 leading-5 text-gray-900 focus:ring-0"
                    :displayValue="(provider) => provider.name"
                    @change="query = $event.target.value"
                  />
                  <ComboboxButton
                    class="absolute inset-y-0 right-0 flex items-center pr-2"
                  >
                    <ChevronUpDownIcon
                      class="h-5 w-5 text-gray-400"
                      aria-hidden="true"
                    />
                  </ComboboxButton>
                </div>
                <TransitionRoot
                  leave="transition ease-in duration-100"
                  leaveFrom="opacity-100"
                  leaveTo="opacity-0"
                  @after-leave="query = ''"
                >
                  <ComboboxOptions
                    class="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-xs"
                  >
                    <div
                      v-if="filteredProviders.length === 0 && query !== ''"
                      class="relative cursor-default select-none py-2 px-4 text-gray-700"
                    >
                      Nothing found.
                    </div>

                    <ComboboxOption
                      v-for="provider in filteredProviders"
                      as="template"
                      :key="provider.id"
                      :value="provider"
                      v-slot="{ selectedProvider, active }"
                    >
                      <li
                        class="relative cursor-default select-none py-2 pl-10 pr-4"
                        @click="selectProvider(provider)"
                        :class="{
                          'text-amber-600 bg-amber-100': active,
                          'text-gray-900': !active,
                        }"
                      >
                        <span
                          class="block truncate"
                          :class="{
                            'font-medium': selectedProvider,
                            'font-normal': !selectedProvider,
                          }"
                        >
                          {{ provider.name }}
                        </span>
                        <span
                          v-if="selectedProvider"
                          class="absolute inset-y-0 left-0 flex items-center pl-3"
                          :class="{
                            'text-white': active,
                            'text-teal-600': !active,
                          }"
                        >
                          <CheckIcon class="h-5 w-5" aria-hidden="true" />
                        </span>
                      </li>
                    </ComboboxOption>
                  </ComboboxOptions>
                </TransitionRoot>
              </div>
            </Combobox>
          </div>
        </div>

        <div class="col-span-1 flex gap-1 text-xs text-gray-500 mb-1">
          <div>
            <PhoneIcon></PhoneIcon>
          </div>
          <span class="inline-block align-middle">Phone Number</span>
        </div>
        <div class="col-span-2 text-xs mb-1">
          <span>{{ selectedProvider.phone_number }}</span>
        </div>

        <div class="col-span-1 flex gap-1 text-xs text-gray-500 mb-1">
          <div>
            <LocationIcon></LocationIcon>
          </div>
          <span class="inline-block align-middle">Address</span>
        </div>
        <div class="col-span-2 text-xs mb-1">
          <span class="">{{ selectedProvider.address }}</span>
        </div>
      </div>
    </div>

    <div v-if="!props.import" class="col-span-3">
      <label
        for="default-input"
        class="p-1 bg-white z-50 ms-4 mb-2 text-xs font-medium text-gray-900 dark:text-white group-focus-within:text-primary-400 group-focus-within:text-sm ease-in duration-150"
      >
        Warehouse branch
      </label>

      <div class="fixed w-[46%]">
        <Combobox v-model="selectedWarehouseBranch">
          <div class="relative mt-1">
            <div
              class="relative w-full cursor-default overflow-hidden rounded-lg bg-white text-left shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-teal-300 sm:text-sm"
            >
              <ComboboxInput
                class="w-full border-none py-2 pl-3 pr-10 text-sm leading-5 text-gray-900 focus:ring-0"
                :displayValue="(warehouseBranch) => warehouseBranch.name"
                @change="query = $event.target.value"
              />
              <ComboboxButton
                class="absolute inset-y-0 right-0 flex items-center pr-2"
              >
                <ChevronUpDownIcon
                  class="h-5 w-5 text-gray-400"
                  aria-hidden="true"
                />
              </ComboboxButton>
            </div>
            <TransitionRoot
              leave="transition ease-in duration-100"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
              @after-leave="warehouseBranchQuery = ''"
            >
              <ComboboxOptions
                class="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm"
              >
                <div
                  v-if="
                    filteredWarehouseBranches.length === 0 &&
                    warehouseBranchQuery !== ''
                  "
                  class="relative cursor-default select-none py-2 px-4 text-gray-700"
                >
                  Nothing found.
                </div>

                <ComboboxOption
                  v-for="warehouseBranch in filteredWarehouseBranches"
                  as="template"
                  :key="warehouseBranch.id"
                  :value="warehouseBranch"
                  v-slot="{ selectedWarehouseBranch, active }"
                >
                  <li
                    class="relative cursor-default select-none py-2 pl-10 pr-4"
                    :class="{
                      'text-amber-600 bg-amber-100': active,
                      'text-gray-900': !active,
                    }"
                  >
                    <span
                      class="block truncate"
                      :class="{
                        'font-medium': selectedWarehouseBranch,
                        'font-normal': !selectedWarehouseBranch,
                      }"
                    >
                      {{ warehouseBranch.name }}
                    </span>
                    <span
                      v-if="selectedWarehouseBranch"
                      class="absolute inset-y-0 left-0 flex items-center pl-3"
                      :class="{
                        'text-white': active,
                        'text-teal-600': !active,
                      }"
                    >
                      <CheckIcon class="h-5 w-5" aria-hidden="true" />
                    </span>
                  </li>
                </ComboboxOption>
              </ComboboxOptions>
            </TransitionRoot>
          </div>
        </Combobox>
      </div>
    </div>
    <div class="col-span-3" v-else>
      <label
        for="default-input"
        class="mt-4 p-1 bg-white z-50 ms-4 text-xs font-medium text-gray-900 dark:text-white"
      >
        Branch information
      </label>
      <div
        class="grid grid-cols-3 border-2 focus-within:border-primary-400 py-2 px-2 rounded-2xl -mb-8"
      >
        <div class="col-span-1 flex gap-1 text-xs text-gray-500 mb-1">
          <div>
            <IdenfifyIcon></IdenfifyIcon>
          </div>
          <span class="inline-block align-middle">Branch ID</span>
        </div>
        <div class="col-span-2 text-xs mb-1 ps-1">
          <span>{{ staff?.id }}</span>
        </div>

        <div class="col-span-1 flex gap-1 text-xs text-gray-500 mb-1">
          <div>
            <PersonIcon></PersonIcon>
          </div>
          <span class="inline-block align-middle">Branch Name</span>
        </div>
        <div class="col-span-2 text-xs mb-1">
          <span>{{ selectedWarehouseBranch?.name }}</span>
        </div>

        <div class="col-span-1 flex gap-1 text-xs text-gray-500 mb-1">
          <div>
            <PhoneIcon></PhoneIcon>
          </div>
          <span class="inline-block align-middle">Phone Number</span>
        </div>
        <div class="col-span-2 text-xs mb-1">
          <span>{{ selectedWarehouseBranch?.phone_number }}</span>
        </div>

        <div class="col-span-1 flex gap-1 text-xs text-gray-500 mb-1">
          <div>
            <LocationIcon></LocationIcon>
          </div>
          <span class="inline-block align-middle">Address</span>
        </div>
        <div class="col-span-2 text-xs mb-1">
          <span class="">{{ selectedWarehouseBranch?.address }}</span>
        </div>
      </div>
    </div>
    <div class="mt-12 col-span-6 grid grid-cols-9 max-h:4">
      <div class="col-span-4 border-gray-400 flex flex-col">
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
            v-model="searchCategory"
            placeholder="Search category by name"
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
              <th>
                <span class="p-2 font-semibold">Unit</span>
              </th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="category in filteredCategories"
              :key="`cateogry-${category.id}`"
              :class="{
                'text-gray-800 text-xs hover:bg-slate-100 bg-slate-300':
                  category.selected,
                'text-gray-800 text-xs hover:bg-slate-100 bg-white':
                  !category.selected,
              }"
              @click="selectCategory(category.id)"
            >
              <th>
                <span class="p-2 font-semibold">{{ category.id }}</span>
              </th>
              <th>
                <span class="p-2 font-semibold">{{ category.name }}</span>
              </th>
              <th>
                <span class="p-2 font-semibold">{{ category.unit }}</span>
              </th>
            </tr>
          </tbody>
        </table>
      </div>
      <div
        v-if="![0, 3].includes(props.import?.status_id)"
        class="col-span-1 flex gap-1 flex-col min-h-60 items-center mt-12"
      >
        <button
          v-if="props.import && checkPermissions(['manage-import'])"
          @click="resetCategories"
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
          @click="selectCategories"
          class="w-7 max:h-7 bg-slate-200 hover:bg-slate-300 hover:shadow-md shadow-sm p-1 rounded-lg text-slate-900"
          type="button"
        >
          <RightOneIcon />
        </button>
        <button
          @click="selectAllCategories"
          class="w-7 max:h-7 bg-slate-200 hover:bg-slate-300 hover:shadow-md shadow-sm p-1 rounded-lg text-slate-900"
          type="button"
        >
          <RightDoubleIcon />
        </button>
        <button
          @click="deselectCategories"
          class="w-7 max:h-7 bg-slate-200 hover:bg-slate-300 hover:shadow-md shadow-sm p-1 rounded-lg text-slate-900"
          type="button"
        >
          <LeftOneIcon />
        </button>
        <button
          @click="deselectedAllCategories"
          class="w-7 max:h-7 bg-slate-200 hover:bg-slate-300 hover:shadow-md shadow-sm p-1 rounded-lg text-slate-900"
          type="button"
        >
          <LeftDoubleIcon />
        </button>
      </div>
      <div v-else></div>
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
            v-model="searchSelectedCategory"
            placeholder="Search selected category by name"
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
              <th>
                <span class="p-2 font-semibold">Unit</span>
              </th>
              <th>
                <span class="p-2 font-semibold">Unit price</span>
              </th>
              <th>
                <span class="p-2 font-semibold">Amount</span>
              </th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="category in filterdSelectedCategories"
              :key="`selected-category-${category.id}`"
              :class="{
                'text-gray-800 text-xs hover:bg-slate-100 bg-slate-300':
                  category.selected,
                'text-gray-800 text-xs hover:bg-slate-100 bg-white':
                  !category.selected,
              }"
              @click="selectSelectedCategory(category.id)"
            >
              <th>
                <span class="p-2 font-semibold">{{ category.id }}</span>
              </th>
              <th>
                <span class="p-2 font-semibold">{{ category.name }}</span>
              </th>
              <th>
                <span class="p-2 font-semibold">{{ category.unit }}</span>
              </th>
              <th
                v-if="
                  checkPermissions(['manage-import']) &&
                  (!props.import ||
                    props.import?.status_id === 1 ||
                    props.import?.status_id === 2)
                "
              >
                <input
                  type="number"
                  class="p-2 font-semibold"
                  v-model="category.unit_price"
                />
              </th>
              <th v-else>
                <span class="p-2 font-semibold">{{ category.unit_price }}</span>
              </th>
              <th
                v-if="
                  checkPermissions(['manage-import']) &&
                  (!props.import ||
                    props.import?.status_id === 1 ||
                    props.import?.status_id === 2)
                "
              >
                <input
                  type="number"
                  class="p-2 font-semibold"
                  v-model="category.amount"
                />
              </th>
              <th v-else>
                <span class="p-2 font-semibold">{{ category.amount }}</span>
              </th>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <div v-if="props.import" class="col-span-6">
      <div class="lg:border-b lg:border-t lg:border-gray-200">
        <nav
          class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8"
          aria-label="Progress"
        >
          <ol
            role="list"
            class="overflow-hidden rounded-md lg:flex lg:rounded-none lg:border-l lg:border-r lg:border-gray-200"
          >
            <li
              v-for="(step, stepIdx) in steps"
              :key="step.id"
              class="relative overflow-hidden lg:flex-1"
            >
              <div
                :class="[
                  stepIdx === 0 ? 'rounded-t-md border-b-0' : '',
                  stepIdx === steps.length - 1 ? 'rounded-b-md border-t-0' : '',
                  'overflow-hidden border border-gray-200 lg:border-0',
                ]"
              >
                <span v-if="step.status === 'complete'" class="group">
                  <span
                    class="absolute left-0 top-0 h-full w-1 bg-transparent group-hover:bg-gray-200 lg:bottom-0 lg:top-auto lg:h-1 lg:w-full"
                    aria-hidden="true"
                  />
                  <span
                    :class="[
                      stepIdx !== 0 ? 'lg:pl-9' : '',
                      'flex items-start px-6 py-5 text-sm font-medium',
                    ]"
                  >
                    <span class="flex-shrink-0">
                      <span
                        class="flex h-10 w-10 items-center justify-center rounded-full bg-success-600 text-white"
                      >
                        <TickIcon />
                      </span>
                    </span>
                    <span class="ml-4 mt-0.5 flex min-w-0 flex-col">
                      <span class="text-sm font-medium">{{ step.name }}</span>
                      <span class="text-sm font-medium text-gray-500">{{
                        step.description
                      }}</span>
                    </span>
                  </span>
                </span>
                <span v-else-if="step.status === 'current'" aria-current="step">
                  <span
                    class="absolute left-0 top-0 h-full w-1 bg-success-600 lg:bottom-0 lg:top-auto lg:h-1 lg:w-full"
                    aria-hidden="true"
                  />
                  <span
                    :class="[
                      stepIdx !== 0 ? 'lg:pl-9' : '',
                      'flex items-start px-6 py-5 text-sm font-medium',
                    ]"
                  >
                    <span class="flex-shrink-0">
                      <span
                        class="flex h-10 w-10 items-center justify-center rounded-full border-2 border-success-600"
                      >
                        <span class="text-success-600">{{ step.id }}</span>
                      </span>
                    </span>
                    <span class="ml-4 mt-0.5 flex min-w-0 flex-col">
                      <span class="text-sm font-medium text-success-600">{{
                        step.name
                      }}</span>
                      <span class="text-sm font-medium text-gray-500">{{
                        step.description
                      }}</span>
                    </span>
                  </span>
                </span>
                <span v-else class="group">
                  <span
                    class="absolute left-0 top-0 h-full w-1 bg-transparent group-hover:bg-gray-200 lg:bottom-0 lg:top-auto lg:h-1 lg:w-full"
                    aria-hidden="true"
                  />
                  <span
                    :class="[
                      stepIdx !== 0 ? 'lg:pl-9' : '',
                      'flex items-start px-6 py-5 text-sm font-medium',
                    ]"
                  >
                    <span class="flex-shrink-0">
                      <span
                        class="flex h-10 w-10 items-center justify-center rounded-full border-2 border-gray-300"
                      >
                        <span class="text-gray-500">{{ step.id }}</span>
                      </span>
                    </span>
                    <span class="ml-4 mt-0.5 flex min-w-0 flex-col">
                      <span class="text-sm font-medium text-gray-500">{{
                        step.name
                      }}</span>
                      <span class="text-sm font-medium text-gray-500">{{
                        step.description
                      }}</span>
                    </span>
                  </span>
                </span>
                <template v-if="stepIdx !== 0">
                  <!-- Separator -->
                  <div
                    class="absolute inset-0 left-0 top-0 hidden w-3 lg:block"
                    aria-hidden="true"
                  >
                    <svg
                      class="h-full w-full text-gray-300"
                      viewBox="0 0 12 82"
                      fill="none"
                      preserveAspectRatio="none"
                    >
                      <path
                        d="M0.5 0V31L10.5 41L0.5 51V82"
                        stroke="currentcolor"
                        vector-effect="non-scaling-stroke"
                      />
                    </svg>
                  </div>
                </template>
              </div>
            </li>
          </ol>
        </nav>
      </div>
    </div>
    <div class="col-span-6">
      <button
        v-if="
          ![0, 3].includes(props.import?.status_id) &&
          checkPermissions(['update-import-status'])
        "
        @mouseover="hoverSubmit"
        @mouseleave="leaveHoverSubmit"
        type="submit"
        class="inline-flex justify-center rounded-md border border-transparent bg-success-100 px-4 py-2 text-sm font-medium text-success-900 hover:bg-success-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-success-500 focus-visible:ring-offset-2"
      >
        Submit
      </button>

      <button
        v-else
        type="submit"
        class="inline-flex justify-center rounded-md border border-transparent bg-success-100 px-4 py-2 text-sm font-medium text-success-900 hover:bg-success-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-success-500 focus-visible:ring-offset-2"
      >
        Submit
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
