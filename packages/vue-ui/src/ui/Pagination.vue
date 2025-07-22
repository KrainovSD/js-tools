<script setup lang="ts">
  import {
    VDoubleLeftOutlined,
    VDoubleRightOutlined,
    VEllipsisOutlined,
    VLeftOutlined,
    VRightOutlined,
  } from "@krainovsd/vue-icons";
  import { computed, useTemplateRef, watch } from "vue";
  import { createInteractiveChildrenController } from "../lib";
  import Select, { type SelectItem } from "./Select.vue";

  export type PaginationSize = "default" | "small";
  export type PaginationPlacement = "left" | "center" | "right";

  export type PaginationProps = {
    totalRows: number;
    pageSizes: number[];
    size?: PaginationSize;
    showItems?: number;
    placement?: PaginationPlacement;
    showQuickJumper?: boolean;
    showLastsPages?: boolean;
  };

  const props = withDefaults(defineProps<PaginationProps>(), {
    size: "default",
    showItems: 7,
    placement: "left",
    showLastsPages: true,
    showQuickJumper: true,
  });
  const pageIndex = defineModel<number>({ default: 0 });
  const pageSize = defineModel<number>("page-size", { default: 100 });
  const paginationRef = useTemplateRef("pagination");

  const totalPages = computed(() => Math.max(Math.ceil(props.totalRows / pageSize.value), 1));

  const componentClasses = computed(() => ({ [`size-${props.size}`]: true }));
  const rootClasses = computed(() => ({ [`placement-${props.placement}`]: true }));
  const pages = computed(() => {
    const visiblePages: number[] = [pageIndex.value];

    const visibleItemsSide = Math.floor(props.showItems / 2);
    let visibleItems = props.showItems - 1;

    for (let i = pageIndex.value - 1; i >= 0 && i >= pageIndex.value - visibleItemsSide; i--) {
      visiblePages.unshift(i);
      visibleItems -= 1;
    }
    const tempVisibleItems = visibleItems;
    for (
      let i = pageIndex.value + 1;
      i < totalPages.value && i <= pageIndex.value + tempVisibleItems;
      i++
    ) {
      visiblePages.push(i);
      visibleItems -= 1;
    }
    if (visibleItems > 0) {
      const tempVisibleItems = visibleItems;

      for (
        let i = pageIndex.value - visibleItemsSide - 1;
        i >= 0 && i >= pageIndex.value - visibleItemsSide - tempVisibleItems;
        i--
      ) {
        visiblePages.unshift(i);
        visibleItems -= 1;
      }
    }

    if (visiblePages[0] !== 0) {
      if (props.showQuickJumper && visiblePages.length > 1) {
        visiblePages.shift();
      }
      if (props.showLastsPages && visiblePages.length > 1) {
        visiblePages.shift();
      }
    }

    if (visiblePages[visiblePages.length - 1] !== totalPages.value - 1) {
      if (props.showQuickJumper && visiblePages.length > 1) {
        visiblePages.pop();
      }
      if (props.showLastsPages && visiblePages.length > 1) {
        visiblePages.pop();
      }
    }

    return visiblePages;
  });
  const pageSizeOptions = computed(() =>
    props.pageSizes.map<SelectItem>((size) => ({ label: size.toString(), value: size })),
  );

  watch<[HTMLDivElement | null, number[]], true>(
    () => [paginationRef.value, pages.value],
    ([paginationRef], _, clean) => {
      if (!paginationRef) return;

      const interactiveChildrenController = createInteractiveChildrenController(paginationRef);

      function keyBoardInteractive(event: KeyboardEvent) {
        if (event.key === "ArrowLeft") {
          interactiveChildrenController.focusPrev();
        }
        if (event.key === "ArrowRight") {
          interactiveChildrenController.focusNext();
        }
      }

      paginationRef.addEventListener("keydown", keyBoardInteractive);

      clean(() => {
        paginationRef?.removeEventListener?.("keydown", keyBoardInteractive);
      });
    },
    { immediate: true, flush: "post" },
  );

  watch(pageSize, () => {
    pageIndex.value = 0;
  });
</script>

<template>
  <div ref="pagination" class="ksd-pagination" :class="[componentClasses, rootClasses]">
    <div class="ksd-pagination__buttons">
      <button
        class="ksd-pagination__button"
        :class="[componentClasses]"
        :disabled="pageIndex === 0"
        @click="() => (pageIndex -= 1)"
      >
        <VLeftOutlined />
      </button>

      <button
        v-if="$props.showLastsPages && pages[0] !== 0"
        class="ksd-pagination__button"
        :class="[componentClasses]"
        @click="() => (pageIndex = 0)"
      >
        {{ 1 }}
      </button>
      <button
        v-if="$props.showQuickJumper && pages[0] !== 0"
        class="ksd-pagination__button quick"
        :class="[componentClasses]"
        @click="
          () => {
            pageIndex -= Math.round(pageIndex / 2);
          }
        "
      >
        <VEllipsisOutlined />
        <VDoubleLeftOutlined />
      </button>

      <button
        v-for="page in pages"
        :key="page"
        class="ksd-pagination__button"
        :class="[componentClasses, { active: page === pageIndex }]"
        @click="() => (pageIndex = page)"
      >
        {{ page + 1 }}
      </button>

      <button
        v-if="$props.showQuickJumper && pages[pages.length - 1] !== totalPages - 1"
        class="ksd-pagination__button quick"
        :class="[componentClasses]"
        @click="
          () => {
            pageIndex += Math.floor((totalPages - 1 - pageIndex) / 2);
          }
        "
      >
        <VEllipsisOutlined />
        <VDoubleRightOutlined />
      </button>
      <button
        v-if="$props.showLastsPages && pages[pages.length - 1] !== totalPages - 1"
        class="ksd-pagination__button"
        :class="[componentClasses]"
        @click="() => (pageIndex = totalPages - 1)"
      >
        {{ totalPages }}
      </button>

      <button
        class="ksd-pagination__button"
        :class="[componentClasses]"
        :disabled="pageIndex === totalPages - 1"
        @click="() => (pageIndex += 1)"
      >
        <VRightOutlined />
      </button>
    </div>
    <Select
      v-model="pageSize"
      :size="size"
      :options="pageSizeOptions"
      :clear="false"
      class="ksd-pagination__select"
    />
  </div>
</template>

<style lang="scss">
  .ksd-pagination {
    display: flex;
    align-items: center;
    width: 100%;

    &.placement {
      &-left {
        justify-content: start;
      }
      &-right {
        justify-content: end;
      }
      &-center {
        justify-content: center;
      }
    }

    &__select {
      min-width: 100px;
    }

    &__buttons {
      display: flex;
      margin-inline-start: var(--ksd-margin);
      align-items: center;
    }

    &__button {
      outline: none;
      display: flex;
      align-items: center;
      justify-content: center;
      display: inline-block;
      min-width: var(--ksd-pagination-item-size);
      height: var(--ksd-pagination-item-size);
      line-height: calc(var(--ksd-pagination-item-size) - 2px);
      margin-inline-end: var(--ksd-margin-xs);
      font-family: var(--ksd-font-family);
      background-color: var(--ksd-pagination-item-bg);
      border: var(--ksd-line-width) var(--ksd-line-type) transparent;
      border-radius: var(--ksd-border-radius);
      color: var(--ksd-text-main-color);
      outline: 0;
      cursor: pointer;
      user-select: none;

      &:focus-visible {
        outline: var(--ksd-outline-width) var(--ksd-outline-type) var(--ksd-outline-color);
        outline-offset: 1px;
        transition:
          outline-offset 0s,
          outline 0s;
      }

      &.size-small {
        min-width: var(--ksd-pagination-item-size-sm);
        height: var(--ksd-pagination-item-size-sm);
        line-height: calc(var(--ksd-pagination-item-size-sm) - 2px);
        font-size: var(--ksd-font-size-sm);
      }

      &:hover {
        background-color: var(--ksd-bg-hover-color);
        transition: all var(--ksd-transition-mid);
      }

      &:active {
        background-color: var(--ksd-bg-active-color);
      }

      &.active {
        font-weight: var(--ksd-font-weight-strong);
        background-color: var(--ksd-pagination-item-active-bg);
        border-color: var(--ksd-accent-color);
        color: var(--ksd-accent-color);

        &:hover {
          border-color: var(--ksd-accent-hover-color);
          color: var(--ksd-accent-hover-color);
        }
      }

      &:disabled {
        color: var(--ksd-text-main-disabled-color);
        cursor: not-allowed;

        &:hover {
          background-color: var(--ksd-pagination-item-bg);
        }
      }

      &.quick {
        transition:
          color var(--ksd-transition-mid) ease,
          background-color var(--ksd-transition-mid) ease;
        color: var(--ksd-icon-color);

        & > svg:last-child {
          display: none;
        }

        &:hover {
          color: var(--ksd-accent-hover-color);
          background-color: var(--ksd-pagination-item-bg);

          & > svg:last-child {
            display: inline-block;
          }
          & > svg:not(:last-child) {
            display: none;
          }
        }
      }
    }
  }
</style>
