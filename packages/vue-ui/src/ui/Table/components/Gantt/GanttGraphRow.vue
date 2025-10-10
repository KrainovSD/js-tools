<script setup lang="ts" generic="RowData extends DefaultRow">
  import { computed } from "vue";
  import type { DefaultRow, GanttInfo, GanttRowInfo, RowInterface } from "../../types";
  import GanttGraphCell from "./GanttGraphCell.vue";

  type Props = {
    rowsMap: Record<string, GanttRowInfo | undefined>;
    bodyWidth: number | null;
    row: RowInterface<GanttInfo<RowData>>;
    rowHeight: number;
    virtualStart: number | undefined;
    todayShift: number;
  };

  const props = defineProps<Props>();
  defineEmits<{ cellClick: [row: RowInterface<GanttInfo<RowData>>, event: MouseEvent] }>();
  const rowStyles = computed(() => ({
    transform: props.virtualStart != undefined ? `translateY(${props.virtualStart}px)` : undefined,
    minHeight: `${props.rowHeight}px`,
    maxHeight: `${props.rowHeight}px`,
  }));
</script>

<template>
  <GanttGraphCell
    :body-width="$props.bodyWidth"
    :row="$props.row"
    :rows-map="$props.rowsMap"
    :row-height="$props.rowHeight"
    :today-shift="$props.todayShift"
    @click="(row, event) => $emit('cellClick', row, event)"
  >
    <template v-if="$slots['graphCell']" #graphCell="graphCellProps">
      <slot name="graphCell" v-bind="graphCellProps"></slot>
    </template>
  </GanttGraphCell>
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
