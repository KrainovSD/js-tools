<script setup lang="ts" generic="RowData extends DefaultRow">
  import { type CSSProperties, computed } from "vue";
  import { getPrevFrozenWidthCell } from "../../lib";
  import type { CellInterface, DefaultRow } from "../../types";

  type Props = {
    cell: CellInterface<RowData>;
    index: number;
    columnPosition: number;
    cells: CellInterface<RowData>[];
    virtualLeft?: number;
    selected: boolean;
    expanded: boolean;
  };

  const props = defineProps<Props>();
  const cellContext = computed(() => props.cell.getContext());

  const level = computed(() =>
    cellContext.value.row.getParentRows().reduce((acc: number, row) => {
      if (row.getIsExpanded() && !row.getIsGrouped()) acc++;

      return acc;
    }, 0),
  );
  const frozenPosition = computed(() => props.cell.column.getIsPinned());
  const prevFrozen = computed(() =>
    getPrevFrozenWidthCell({
      cells: props.cells,
      index: props.index,
      frozenPosition: frozenPosition.value,
    }),
  );

  const CellRender = computed(() => props.cell.column.columnDef.cellRender);

  const cellConfigClasses = computed(() => {
    return cellContext.value.column.columnDef.cellClass?.map?.((className) =>
      className instanceof Function
        ? className(cellContext.value, cellContext.value.column.columnDef.cellClassProps)
        : className,
    );
  });
  const cellClasses = computed(() => ({
    "frozen-left": frozenPosition.value === "left",
    "frozen-right": frozenPosition.value === "right",
    "frozen-left-last":
      frozenPosition.value === "left" && props.cell.column.getIsLastColumn("left"),
    "frozen-right-first":
      frozenPosition.value === "right" && props.cell.column.getIsFirstColumn("right"),
  }));
  const cellStyles = computed<CSSProperties>(() => ({
    left: frozenPosition.value === "left" ? `${prevFrozen.value}px` : undefined,
    right: frozenPosition.value === "right" ? `${prevFrozen.value}px` : undefined,
    gridColumnStart: props.columnPosition,
    "--table-cell-shift":
      level.value > 0 && cellContext.value.cell.column.columnDef.expandedShift != undefined
        ? `${cellContext.value.cell.column.columnDef.expandedShift * level.value}px`
        : undefined,
  }));
</script>

<template>
  <div
    role="cell"
    :data-column-id="$props.cell.id"
    class="ksd-table__cell"
    :class="[cellClasses, cellConfigClasses]"
    :style="cellStyles"
  >
    <component
      :is="CellRender"
      v-if="CellRender"
      :context="cellContext"
      :settings="cellContext.column.columnDef.cellRenderProps"
    />
  </div>
</template>

<style lang="scss">
  .ksd-table {
    &__cell {
      background: inherit;
      display: block;

      &.frozen-left {
        position: sticky;
        left: 0;
        z-index: 1;
        height: auto;
      }
      &.frozen-right {
        position: sticky;
        right: 0;
        z-index: 1;
        height: auto;
      }
      &.frozen-left-last {
        box-shadow: var(--ksd-table-box-shadow-right);
      }
      &.frozen-right-first {
        box-shadow: var(--ksd-table-box-shadow-left);
        border-left: 1px solid var(--ksd-table-border);
      }

      &:where(.common) {
        border-block-end: 1px solid var(--ksd-table-border);
        border-inline-end: 1px solid var(--ksd-table-border);
        border-spacing: 0px;
        border-collapse: collapse;
        overflow: hidden;
        white-space: pre-wrap;
        display: flex;
        color: var(--ksd-table-text-color);
        line-height: var(--ksd-line-height);
        font-size: 14px;
        font-weight: var(--ksd-font-weight);
        font-family: var(--ksd-table-font-family);
        background-color: inherit;

        & > div {
          padding: 6px 8px;
          padding-left: calc(8px + var(--table-cell-shift, 0px));
          width: 100%;
          height: 100%;
          max-width: 100%;
          overflow: hidden;
          text-overflow: ellipsis;
          gap: 10px;
          display: flex;
        }
      }
      &:where(.empty) {
        border-inline-end: none;
      }
      &:where(.hCenter) {
        height: 100%;
        align-items: center;

        & > div {
          height: 100%;
          align-items: center;
        }
      }
      &:where(.wCenter) {
        width: 100%;
        justify-content: center;

        & > div {
          width: 100%;
          justify-content: center;
        }
      }
      &:where(.lineClamp) {
        & span {
          display: -webkit-box;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 2;
          line-clamp: 2;
          align-self: stretch;
        }
      }
      &:where(.nowrap) {
        white-space: nowrap;
      }
    }
  }
</style>
