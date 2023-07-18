<script>
export default {
  props: {
    name: {
      type: String,
      required: true,
    },
    src: {
      type: String,
    },
    value: {
      type: String,
      required: true,
    },
    defaultUrl: {
      type: String,
    },
    helperText: {
      type: String,
      default: "",
    },
  },

  data() {
    return {
      fileImage: null,
      previousValue: this.value,
      preview: this.src || this.defaultUrl,
    };
  },

  methods: {
    change(event) {
      this.fileImage = event.target.files[0];
      this.previousValue = null;

      if (!this.fileImage) {
        this.preview = this.src || this.defaultUrl;
        return;
      }

      const reader = new FileReader();
      reader.readAsDataURL(this.fileImage);
      reader.addEventListener("load", () => {
        this.preview = reader.result.toString();
      });
    },

    clear() {
      this.fileImage = null;
      this.preview = this.defaultUrl;
      this.previousValue = null;
      this.$refs.fileRef.value = "";
    },
  },
};
</script>

<template>
  <div>
    <input
      type="hidden"
      :name="`${name}_previous_value`"
      :value="previousValue"
    />
    <input
      ref="fileRef"
      type="file"
      accept=".png, .jpg, .jpeg"
      class="hidden"
      :name="name"
      :id="name"
      @change.prevent="change"
    />
    <div class="relative me-4 mt-3 flex-shrink-0 self-center rounded-full">
      <div class="relative h-32 w-32">
        <img
          :src="preview"
          :alt="name"
          class="group absolute h-full w-full overflow-hidden rounded border-none object-cover align-middle shadow"
        />
      </div>
      <div
        class="absolute top-0 flex h-32 w-32 justify-center rounded text-white opacity-0 backdrop-brightness-50 duration-300 ease-in-out hover:opacity-100"
      >
        <button type="button" @click="$refs.fileRef.click()">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            class="h-6 w-6 text-slate-300 hover:text-white"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M2.25 12.75V12A2.25 2.25 0 014.5 9.75h15A2.25 2.25 0 0121.75 12v.75m-8.69-6.44l-2.12-2.12a1.5 1.5 0 00-1.061-.44H4.5A2.25 2.25 0 002.25 6v12a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9a2.25 2.25 0 00-2.25-2.25h-5.379a1.5 1.5 0 01-1.06-.44z"
            />
          </svg>
        </button>

        <button
          type="button"
          v-if="fileImage || previousValue"
          @click.prevent="clear"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            class="ms-6 h-6 w-6 text-slate-300 hover:text-white"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
            />
          </svg>
        </button>
      </div>
    </div>
    <span
      v-if="helperText"
      class="mt-1 inline-block cursor-help py-2 text-xs text-slate-400 dark:text-slate-300"
    >
      {{ helperText }}
    </span>
  </div>
</template>
