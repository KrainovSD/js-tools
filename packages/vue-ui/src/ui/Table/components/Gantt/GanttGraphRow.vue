<script setup lang="ts" generic="RowData extends DefaultRow">
  import { computed } from "vue";
  import type {
    DefaultRow,
    GanttInfo,
    GanttLinkStyleGetter,
    GanttRowInfo,
    GanttSize,
    RowInterface,
  } from "../../types";
  import GanttGraphCell from "./GanttGraphCell.vue";

  type Props = {
    ganttLinkStyleGetter: GanttLinkStyleGetter<RowData> | undefined;
    rowsMap: Record<string, GanttRowInfo | undefined>;
    bodyWidth: number | null;
    ganttSize: GanttSize;
    row: RowInterface<GanttInfo<RowData>>;
    rowHeight: number;
    virtualStart: number | undefined;
    arrowContainer: HTMLElement | null;
  };

  const props = defineProps<Props>();
  const rowStyles = computed(() => ({
    transform: props.virtualStart != undefined ? `translateY(${props.virtualStart}px)` : undefined,
    minHeight: `${props.rowHeight}px`,
    maxHeight: `${props.rowHeight}px`,
  }));
</script>

<template>
  <GanttGraphCell
    :body-width="$props.bodyWidth"
    :gantt-link-style-getter="$props.ganttLinkStyleGetter"
    :gantt-size="$props.ganttSize"
    :row="$props.row"
    :row-height="$props.rowHeight"
    :rows-map="$props.rowsMap"
    :arrow-container="$props.arrowContainer"
  />
  <div
    class="ksd-gantt-graph__row"
    :class="{ virtual: $props.virtualStart != undefined }"
    :style="rowStyles"
  ></div>
</template>

<style lang="scss">
  .ksd-gantt-graph {
    &__row {
      display: flex;
      width: 100%;
      border-bottom: 1px solid var(--ksd-table-border);

      &.virtual {
        position: absolute;
        z-index: 1;
        display: block;
      }
    }
  }
</style>
