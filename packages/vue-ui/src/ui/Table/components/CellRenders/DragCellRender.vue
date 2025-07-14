<script setup lang="ts" generic="RowData extends DefaultRow">
  import { VDragOutlined } from "@krainovsd/vue-icons";
  import { computed } from "vue";
  import { checkCellVisible } from "../../lib/check-cell-visible";
  import type { CellRenderProps, DefaultRow } from "../../types";

  export type DragCellRenderProps<Row extends DefaultRow> = {
    dragCondition?: (row: Row, index: number) => boolean;
  };

  const props = defineProps<CellRenderProps<RowData, DragCellRenderProps<RowData>>>();
  const draggable = computed(() =>
    props.settings?.dragCondition instanceof Function
      ? props.settings.dragCondition(props.context.row.original, props.context.row.index)
      : true,
  );
  const visible = computed(() => checkCellVisible(props.context));
</script>

<template>
  <div
    v-if="visible"
    class="ksd-table__cell-drag ksd-table-row-drag-handle"
    :class="{ drag: draggable, forbidden: !draggable }"
  >
    <VDragOutlined />
  </div>
</template>

<style lang="scss">
  div.ksd-table__cell-drag {
    & > svg {
      font-size: var(--ksd-font-size-lg);
    }

    &.drag {
      cursor: move;
    }
    &.forbidden {
      cursor: not-allowed;
    }
  }
</style>
