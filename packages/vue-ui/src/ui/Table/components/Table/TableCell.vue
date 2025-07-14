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
  const isGroupCell = computed(
    () => props.cell.row.getIsGrouped() && props.cell.row.groupingColumnId === props.cell.column.id,
  );
  const frozenPosition = computed(() => props.cell.column.getIsPinned());
  const prevFrozen = computed(() =>
    getPrevFrozenWidthCell({
      cells: props.cells,
      index: props.index,
      frozenPosition: frozenPosition.value,
    }),
  );
  const Expander = computed(() => cellContext.value.table.options.meta?.renderers?.expander);
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
    left: frozenPosition.value === "left" ? prevFrozen.value : undefined,
    right: frozenPosition.value === "right" ? prevFrozen.value : undefined,
    gridColumnStart: props.columnPosition,
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
    <component :is="Expander" v-if="Expander && isGroupCell" :context="cellContext" />
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
    }
  }
</style>
