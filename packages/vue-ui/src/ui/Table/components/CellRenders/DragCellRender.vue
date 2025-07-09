<script setup lang="ts" generic="RowData extends DefaultRow">
  import type { CellRenderProps, DefaultRow } from "../../types";

  export type DragCellRenderProps<Row extends DefaultRow> = {
    dragCondition?: (row: Row, index: number) => boolean;
  };

  defineProps<CellRenderProps<RowData, DragCellRenderProps<RowData>>>();
</script>

<template>
  <div>component</div>
</template>

<style lang="scss" module></style>
