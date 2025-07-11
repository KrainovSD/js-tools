<script
  setup
  lang="ts"
  generic="
    RowData extends DefaultRow,
    GanttData extends DefaultGanttData,
    CellRender extends Record<string, CellRenderComponent<RowData>>,
    HeaderRender extends Record<string, HeaderRenderComponent<RowData>>,
    FilterRender extends Record<string, FilterRenderComponent<RowData>>,
    SortRender extends Record<string, SortRenderComponent<RowData>>,
    CellClass extends Record<string, CellClassInterface<RowData>>,
    HeaderClass extends Record<string, HeaderClassInterface<RowData>>,
    FilterType extends Record<string, FilterFn<RowData>>,
    SortType extends Record<string, SortFn<RowData>>
  "
>
  import { computed, useTemplateRef } from "vue";
  import { useWatchDebug } from "../../hooks";
  import { Gantt, TableCommon, TableFilter, TableFooter, TableLoading } from "./components";
  import { useColumns, useTableOptions, useVirtualizer } from "./lib";
  import type {
    CellClassInterface,
    CellRenderComponent,
    ColumnFiltersState,
    ColumnOrderState,
    ColumnPinningState,
    ColumnSizingState,
    ColumnsVisibleState,
    DefaultGanttData,
    DefaultRow,
    ExpandedState,
    FilterFn,
    FilterRenderComponent,
    GroupingState,
    HeaderClassInterface,
    HeaderRenderComponent,
    PaginationState,
    RowSelectionState,
    SortFn,
    SortRenderComponent,
    SortingState,
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
  const sorting = defineModel<SortingState>("sorting");
  const columnFilters = defineModel<ColumnFiltersState>("columnFilters");
  const columnOrder = defineModel<ColumnOrderState>("columnOrder");
  const columnPinning = defineModel<ColumnPinningState>("columnPinning");
  const columnSizing = defineModel<ColumnSizingState>("columnSizing");
  const columnVisibility = defineModel<ColumnsVisibleState>("columnVisibility");
  const expanded = defineModel<ExpandedState>("expanded");
  const grouping = defineModel<GroupingState>("grouping");
  const pagination = defineModel<PaginationState>("pagination");
  const rowSelection = defineModel<RowSelectionState>("rowSelection");

  const rootRef = useTemplateRef("root");
  const ganttComponentRef = useTemplateRef("gantt");
  const ganttContainerRef = computed(() => ganttComponentRef.value?.ganttContainerRef);
  const tableContainerRef = useTemplateRef("table-container");
  const containerRef = computed(() =>
    props.withGantt ? ganttContainerRef.value : tableContainerRef.value,
  );

  const { columnsDef, initialState } = useColumns(props);
  const table = useTableOptions(
    props,
    {
      columnsDef,
      initialState,
    },
    {
      columnFilters,
      columnOrder,
      columnPinning,
      columnSizing,
      columnVisibility,
      expanded,
      grouping,
      pagination,
      rowSelection,
      sorting,
    },
  );
  const tableState = computed(() => table.getState());
  useWatchDebug(() => table.getRowModel().rows, "ROWS");
  useWatchDebug(() => table.getLeftVisibleLeafColumns(), "COLUMNS");
  useWatchDebug(() => table.options.meta, "META");
  useWatchDebug(() => table.getState().columnFilters, "STATE FILTERS");
  useWatchDebug(() => table.getState().columnOrder, "STATE ORDER");

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

  defineExpose({ rootRef, tableInstance: table });
</script>

<template>
  <div ref="root" v-bind="$attrs" class="ksd-table-wrapper" :class="{ full: $props.fullSize }">
    <TableLoading v-if="!$props.Loader && $props.loading" />
    <component :is="$props.Loader" v-if="$props.Loader && $props.loading" />
    <TableFilter />
    <div
      v-if="!$props.withGantt"
      ref="table-container"
      class="ksd-table-container"
      :class="{ full: $props.fullSize }"
    >
      <TableCommon />
    </div>
    <Gantt v-if="$props.withGantt" ref="gantt" />
    <TableFooter />
  </div>
</template>

<style lang="scss"></style>
