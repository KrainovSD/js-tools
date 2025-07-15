<script setup lang="ts" generic="RowData extends DefaultRow">
  import { VCaretDownFilled, VCaretUpFilled } from "@krainovsd/vue-icons";
  import { computed } from "vue";
  import Tag from "../../../Tag.vue";
  import type { DefaultRow, SortRenderProps } from "../../types";

  const props = defineProps<SortRenderProps<RowData, unknown>>();
  const sortIndex = computed(() => props.context.column.getSortIndex());
  const direction = computed(() => props.context.column.getIsSorted());
  const firstDirection = computed(() => props.context.column.getFirstSortDir());

  function onSort() {
    if (!direction.value) {
      props.context.column.toggleSorting(firstDirection.value === "desc", true);
    } else if (direction.value !== firstDirection.value) {
      props.context.column.clearSorting();
    } else {
      props.context.column.toggleSorting(direction.value === "asc", true);
    }
  }
</script>

<template>
  <button class="ksd-table-sort-double-arrow__container" @click="onSort">
    <Tag v-if="!!~sortIndex" color="blue"> {{ sortIndex + 1 }} </Tag>
    <div class="ksd-table-sort-double-arrow__arrow-container">
      <VCaretUpFilled
        class="ksd-table-sort-double-arrow__arrow asc"
        :class="{ active: direction === 'asc' }"
      />
      <VCaretDownFilled
        class="ksd-table-sort-double-arrow__arrow desc"
        :class="{ active: direction === 'desc' }"
      />
    </div>
  </button>
</template>

<style lang="scss">
  .ksd-table-sort-double-arrow {
    &__container {
      padding: 0px;
      background-color: transparent;
      outline: none;
      border: none;
      width: fit-content;
      height: fit-content;
      display: flex;
      cursor: pointer;
      height: 100%;
      align-items: center;
      gap: 8px;
      min-width: 30px;
      justify-content: end;
    }

    &__arrow {
      transition: all var(--ksd-transition-mid) ease;
      position: relative;
      color: var(--ksd-table-off-sort);
      font-size: 14px;

      &.asc {
        top: 2px;
      }
      &.desc {
        top: -2px;
      }

      &.active {
        color: var(--ksd-table-active-sort);
      }
    }

    &__arrow-container {
      position: relative;
      display: flex;
      flex-direction: column;
      gap: -2px;
    }

    &__index {
      min-width: 20px;

      &.active {
        color: var(--ksd-table-active-sort);
      }
    }
  }
</style>
