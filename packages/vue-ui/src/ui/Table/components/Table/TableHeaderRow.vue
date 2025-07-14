<script setup lang="ts" generic="RowData extends DefaultRow">
  import { type CSSProperties, computed } from "vue";
  import type {
    ColumnFiltersState,
    DefaultRow,
    HeaderGroupInterface,
    SortingState,
  } from "../../types";
  import TableHeaderCell from "./TableHeaderCell.vue";

  type Props<RowData extends DefaultRow> = {
    headerGroup: HeaderGroupInterface<RowData>;
    columnVirtualEnabled: boolean;
    columnsVirtual: string[];
    leftHeaders: HeaderGroupInterface<RowData>["headers"];
    rightHeaders: HeaderGroupInterface<RowData>["headers"];
    centerHeaders: HeaderGroupInterface<RowData>["headers"];
    headerRowClassName:
      | ((header: HeaderGroupInterface<RowData>) => string | undefined)
      | string
      | undefined;
    page: number;
    selectedPage: boolean;
    filterState: ColumnFiltersState;
    sortState: SortingState;
    height: number | undefined;
  };

  const props = defineProps<Props<RowData>>();
  const headerRowStyles = computed<CSSProperties>(() => ({
    minHeight: props.height,
    maxHeight: props.height,
  }));
  const headerRowClasses = computed(() => {
    return props.headerRowClassName instanceof Function
      ? props.headerRowClassName(props.headerGroup)
      : props.headerRowClassName;
  });
</script>

<template>
  <div
    role="rowheader"
    class="ksd-table__header-row"
    :class="headerRowClasses"
    :style="headerRowStyles"
  >
    <template v-if="$props.columnVirtualEnabled">
      <TableHeaderCell
        v-for="(header, index) in $props.leftHeaders"
        :key="header.column.columnDef.id"
        :header="header"
        :headers="$props.leftHeaders"
        :index="index"
        :column-position="index + 1"
        :filter-state="$props.filterState"
        :selected-page="$props.selectedPage"
        :sort-state="$props.sortState"
      />
      <TableHeaderCell
        v-for="index in $props.columnsVirtual"
        :key="props.centerHeaders[+index].column.columnDef.id"
        :header="props.centerHeaders[+index]"
        :headers="$props.centerHeaders"
        :index="+index"
        :column-position="props.leftHeaders.length + +index + 1"
        :filter-state="$props.filterState"
        :selected-page="$props.selectedPage"
        :sort-state="$props.sortState"
      />
      <TableHeaderCell
        v-for="(header, index) in $props.rightHeaders"
        :key="header.column.columnDef.id"
        :header="header"
        :headers="$props.rightHeaders"
        :index="index"
        :column-position="props.leftHeaders.length + props.centerHeaders.length + index + 1"
        :filter-state="$props.filterState"
        :selected-page="$props.selectedPage"
        :sort-state="$props.sortState"
      />
    </template>
    <template v-if="!$props.columnVirtualEnabled">
      <TableHeaderCell
        v-for="(header, index) in $props.headerGroup.headers"
        :key="header.column.columnDef.id"
        :header="header"
        :headers="$props.headerGroup.headers"
        :index="index"
        :column-position="index + 1"
        :filter-state="$props.filterState"
        :selected-page="$props.selectedPage"
        :sort-state="$props.sortState"
      />
    </template>
  </div>
</template>

<style lang="scss">
  .ksd-table {
    &__header-row {
      background-color: var(--ksd-table-header-bg);
      overflow: initial;
      display: grid;
      position: relative;
      width: calc(var(--table-total-width) * 1px);
      grid-template-columns: var(--table-template-columns);
    }
  }
</style>
