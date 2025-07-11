<script
  setup
  lang="ts"
  generic="
    RowData extends DefaultRow,
    GanttData extends DefaultGanttData,
    CellRender extends Record<string, CellRenderComponent<RowData>> = {},
    HeaderRender extends Record<string, HeaderRenderComponent<RowData>> = {},
    FilterRender extends Record<string, FilterRenderComponent<RowData>> = {},
    SortRender extends Record<string, SortRenderComponent<RowData>> = {},
    CellClass extends Record<string, CellClassInterface<RowData>> = {},
    HeaderClass extends Record<string, HeaderClassInterface<RowData>> = {},
    FilterType extends Record<string, FilterFn<RowData>> = {},
    SortType extends Record<string, SortFn<RowData>> = {}
  "
>
  import { computed, useTemplateRef } from "vue";
  import { Gantt, TableCommon, TableFilter, TableFooter, TableLoading } from "./components";
  import { useColumns, useTableOptions, useVirtualizer } from "./lib";
  import type {
    CellClassInterface,
    CellRenderComponent,
    DefaultGanttData,
    DefaultRow,
    FilterFn,
    FilterRenderComponent,
    HeaderClassInterface,
    HeaderRenderComponent,
    SortFn,
    SortRenderComponent,
    TableProps,
  } from "./types";

  const props =
    defineProps<
      TableProps<
        RowData,
        GanttData,
        CellRender,
        HeaderRender,
        FilterRender,
        SortRender,
        CellClass,
        HeaderClass,
        FilterType,
        SortType
      >
    >();

  const rootRef = useTemplateRef("root");
  const ganttComponentRef = useTemplateRef("gantt");
  const ganttContainerRef = computed(() => ganttComponentRef.value?.ganttContainerRef);
  const tableContainerRef = useTemplateRef("table-container");
  const containerRef = computed(() =>
    props.withGantt ? ganttContainerRef.value : tableContainerRef.value,
  );

  const { initialColumnPinning, initialColumns, initialGrouping } = useColumns({
    columns: props.columns,
    cellRenders: props.cellRenders,
    headerRenders: props.headerRenders,
    filterRenders: props.filterRenders,
    sortRenders: props.sortRenders,
    cellClasses: props.cellClasses,
    headerClasses: props.headerClasses,
    defaultColumnOptions: props.defaultColumnOptions,
    filterTypes: props.filterTypes,
    sortTypes: props.sortTypes,
    withGantt: props.withGantt,
    withFilters: props.withFilters ?? false,
    rubberColumn: props.rubberColumn ?? false,
  });

  const table = useTableOptions({
    ...props,
    initialColumnPinning,
    columns: initialColumns,
    initialGrouping,
  });
  const tableState = computed(() => table.getState());

  const {
    // columnVirtualEnabled,
    // columnVirtualizer,
    // columnsVirtual,
    // rowVirtual,
    // rowVirtualEnabled,
    // rowVirtualizer,
    rows,
  } = useVirtualizer({
    initialColumns: props.columns,
    rows: props.rows,
    table,
    tableContainerRef: containerRef,
    virtualColumn: props.virtualColumn,
    virtualRows: props.virtualRows,
    virtualRowSize: props.virtualRowSize,
    gantt: props.withGantt,
    ganttMini: props.ganttRowMini,
    virtualColumnOverScan: props.virtualColumnOverScan,
    virtualRowOverScan: props.virtualRowOverScan,
  });

  console.log(rows, tableState);

  defineExpose({ rootRef, tableInstance: table });
</script>

<template>
  <div ref="root" v-bind="$attrs" class="ksd-table-wrapper" :class="{ full: props.fullSize }">
    <TableLoading v-if="!props.Loader && props.loading" />
    <component :is="props.Loader" v-if="props.Loader && props.loading" />
    <TableFilter />
    <div
      v-if="!props.withGantt"
      ref="table-container"
      class="ksd-table-container"
      :class="{ full: props.fullSize }"
    >
      <TableCommon />
    </div>
    <Gantt v-if="props.withGantt" ref="gantt" />
    <TableFooter />
  </div>
</template>

<style lang="scss"></style>
