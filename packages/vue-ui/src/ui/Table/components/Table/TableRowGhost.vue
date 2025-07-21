<script setup lang="ts" generic="RowData extends DefaultRow">
  import { type CSSProperties, computed } from "vue";
  import type { CellInterface, DefaultRow, RowInterface } from "../../types";
  import TableCell from "./TableCell.vue";

  type Props = {
    selected: boolean;
    row: RowInterface<RowData>;
    rowClassName: ((row: RowInterface<RowData>) => string | undefined) | string | undefined;
    expanded: boolean;
    visibleCells: CellInterface<RowData>[];
    height: number | undefined;
  };

  const props = defineProps<Props>();

  const rowIndex = computed(() => props.row.index);
  const id = computed(() => props.row.id);

  const rowConfigClasses = computed(() =>
    props.rowClassName instanceof Function ? props.rowClassName(props.row) : props.rowClassName,
  );
  const rowStyles = computed<CSSProperties>(() => ({
    minHeight: props.height != undefined ? `${props.height}px` : undefined,
    maxHeight: props.height != undefined ? `${props.height}px` : undefined,
  }));
  const splicedVisibleCells = computed(() => props.visibleCells.toSpliced(5));
</script>

<template>
  <div
    role="row"
    tabindex="0"
    class="ksd-table__row ghost"
    :class="[rowConfigClasses]"
    :style="rowStyles"
    :data-index="rowIndex"
    :data-row-id="id"
  >
    <TableCell
      v-for="(cell, index) in splicedVisibleCells"
      :key="cell.column.columnDef.id"
      :cell="cell"
      :cells="splicedVisibleCells"
      :column-position="index + 1"
      :index="index"
      :selected="$props.selected"
      :expanded="$props.expanded"
    />
  </div>
</template>

<style lang="scss">
  .ksd-table {
    &__row {
      &.ghost {
      }
    }
  }
</style>
