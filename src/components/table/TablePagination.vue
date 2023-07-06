<script>
import { formatNumber } from "../../utilities";

export default {
  name: "table-pagination",

  props: {
    meta: Object,
    links: Array,
    changePage: Function,
  },

  computed: {
    from() {
      return formatNumber(this.meta?.from || 0);
    },
    to() {
      return formatNumber(this.meta?.to || 0);
    },
    total() {
      return formatNumber(this.meta?.total || 0);
    },
  },

  methods: {
    click(event) {
      this.changePage(event.target.getAttribute("href"));
    },
  },
};
</script>

<template>
  <div
    class="flex items-center justify-between border-t border-gray-200 px-4 py-3 dark:border-slate-200/10 sm:px-6"
  >
    <div class="flex flex-1 justify-between sm:hidden">
      <a
        :href="links[0]?.url"
        class="relative inline-flex items-center rounded-md bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:bg-slate-900 dark:text-slate-300"
        @click.prevent="click"
      >
        {{ __("Previous") }}
      </a>
      <a
        :href="links[links.length - 1]?.url"
        class="relative ms-3 inline-flex items-center rounded-md bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:bg-slate-900 dark:text-slate-300"
        @click.prevent="click"
      >
        {{ __("Next") }}
      </a>
    </div>
    <div class="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
      <div>
        <p
          class="text-sm text-gray-700 dark:text-slate-400"
          v-if="meta?.from && meta?.to && meta?.total"
          v-html="
            __('Showing :from to :to of :total results', {
              from: `<span class='font-medium'>${from}</span>`,
              to: `<span class='font-medium'>${to}</span>`,
              total: `<span class='font-medium'>${total}</span>`,
            })
          "
        />
      </div>
      <div>
        <nav
          class="isolate inline-flex -space-x-px rounded-md shadow-sm"
          aria-label="Pagination"
        >
          <template v-for="(link, linkIndex) in links">
            <a
              v-if="link.label !== '...'"
              :key="`pagination-links-${linkIndex}`"
              :href="link.url"
              :class="[
                'relative z-10 inline-flex items-center px-4 py-2 text-sm font-semibold focus:z-20',
                link.active
                  ? 'bg-primary-600 focus-visible:outline-primary-600 z-10 text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2'
                  : '',
                !link.active
                  ? 'text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:outline-offset-0 dark:text-slate-400 dark:ring-slate-700 hover:dark:bg-slate-900'
                  : '',
                linkIndex === 0 ? 'rounded-s-md' : '',
                linkIndex === links.length - 1 ? 'rounded-e-md' : '',
              ]"
              v-html="link.label"
              :aria-current="link.active ? 'page' : null"
              @click.prevent="click"
            ></a>
            <span
              v-else
              :key="`pagination-links-${linkIndex}`"
              class="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-700 ring-1 ring-inset ring-gray-300 focus:outline-offset-0 dark:text-slate-400 dark:ring-slate-700"
            >
              {{ link.label }}
            </span>
          </template>
        </nav>
      </div>
    </div>
  </div>
</template>
