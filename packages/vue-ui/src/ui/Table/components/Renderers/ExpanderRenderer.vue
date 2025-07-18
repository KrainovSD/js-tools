<script setup lang="ts" generic="RowData extends DefaultRow">
  import { computed } from "vue";
  import type { CellRenderProps, DefaultRow } from "../../types";

  const props = defineProps<Omit<CellRenderProps<RowData, never>, "settings">>();
  const isExpanded = computed(() => props.context.row.getIsExpanded());
  const rootClasses = computed(() => ({ expanded: isExpanded.value }));
</script>

<template>
  <button class="ksd-table__cell-expanded" :class="rootClasses"></button>
</template>

<style lang="scss">
  .ksd-table__cell-expanded {
    color: inherit;
    outline: none;
    cursor: pointer;
    transition: all var(--ksd-transition-slow);
    border: var(--ksd-line-width) var(--ksd-line-type) #303030;
    padding: 0;
    background: var(--ksd-bg-container-color);
    position: relative;
    float: left;
    width: var(--ksd-table-expander-outer-size);
    height: var(--ksd-table-expander-outer-size);
    line-height: var(--ksd-table-expander-outer-size);
    min-width: var(--ksd-table-expander-outer-size);
    min-height: var(--ksd-table-expander-outer-size);
    border-radius: var(--ksd-border-radius);
    color: var(--ksd-text-main-color);

    &:focus-visible {
      outline: var(--ksd-outline-width) var(--ksd-outline-type) var(--ksd-outline-color);
      outline-offset: 1px;
      transition:
        outline-offset 0s,
        outline 0s;
    }

    &:hover {
      color: var(--ksd-table-expander-hover-color);
      border-color: var(--ksd-table-expander-hover-color);
    }

    &::before {
      position: absolute;
      background: currentcolor;
      transition: transform var(--ksd-transition-slow) ease-out;
      content: "";

      top: var(--ksd-table-expander-inner-size);
      inset-inline-end: calc(var(--ksd-padding-xxs) - var(--ksd-line-width));
      inset-inline-start: calc(var(--ksd-padding-xxs) - var(--ksd-line-width));
      height: var(--ksd-line-width);
    }
    &::after {
      position: absolute;
      background: currentcolor;
      transition: transform var(--ksd-transition-slow) ease-out;
      content: "";

      top: calc(var(--ksd-padding-xxs) - var(--ksd-line-width));
      bottom: calc(var(--ksd-padding-xxs) - var(--ksd-line-width));
      inset-inline-start: var(--ksd-table-expander-inner-size);
      width: var(--ksd-line-width);
      transform: rotate(90deg);
    }

    &:not(.expanded) {
      &::before {
        transform: rotate(-180deg);
      }
      &::after {
        transform: rotate(0deg);
      }
    }
  }
</style>
