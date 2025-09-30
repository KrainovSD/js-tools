<script
  setup
  lang="ts"
  generic="
    RowData extends DefaultRow,
    CellRender extends Record<string, CellRenderComponent<GanttInfo<RowData>>>,
    HeaderRender extends Record<string, HeaderRenderComponent<GanttInfo<RowData>>>,
    FilterRender extends Record<string, FilterRenderComponent<GanttInfo<RowData>>>,
    SortRender extends Record<string, SortRenderComponent<GanttInfo<RowData>>>,
    CellClass extends Record<string, CellClassInterface<GanttInfo<RowData>>>,
    HeaderClass extends Record<string, HeaderClassInterface<GanttInfo<RowData>>>,
    FilterType extends Record<string, FilterFn<GanttInfo<RowData>>>,
    SortType extends Record<string, SortFn<GanttInfo<RowData>>>
  "
>
  import { computed, useTemplateRef } from "vue";
  import { GanttContainer, TableFilter, TableLoading, TableTotal } from "./components";
  import { useColumns, useTableOptions, useVirtualizer } from "./lib";
  import type {
    CellClassInterface,
    CellRenderComponent,
    ColumnFiltersState,
    ColumnOrderState,
    ColumnPinningState,
    ColumnSizingState,
    ColumnsVisibleState,
    DefaultRow,
    ExpandedState,
    FilterFn,
    FilterRenderComponent,
    GanttInfo,
    GanttProps,
    GroupingState,
    HeaderClassInterface,
    HeaderRenderComponent,
    PaginationState,
    RowInterface,
    RowSelectionState,
    SortFn,
    SortRenderComponent,
    SortingState,
  } from "./types";

  type Emits = {
    dragRow: [sourceId: string, targetId: string];
    click: [row: RowInterface<GanttInfo<RowData>>, event: MouseEvent];
    dblclick: [row: RowInterface<GanttInfo<RowData>>, event: MouseEvent];
    graphTaskClick: [row: RowInterface<GanttInfo<RowData>>, event: MouseEvent];
  };

  const props = withDefaults(
    defineProps<
      GanttProps<
        RowData,
        CellRender,
        HeaderRender,
        FilterRender,
        SortRender,
        CellClass,
        HeaderClass,
        FilterType,
        SortType
      >
    >(),
    {
      frozenHeader: true,
      rubberColumn: false,
      virtualRows: true,
      withFilters: false,
      withPagination: false,
      withTotal: true,
      draggableRow: false,
      ganttGraphGrid: false,
      ganttSize: "sm",
      ganttView: "months",
      ganttSplitterInstant: true,
      gantt: false,
      ganttLinkGetAround: true,
      ganttLinkVisibleInRange: true,
      ganttLinkHighlight: true,
    },
  );
  defineEmits<Emits>();

  const sorting = defineModel<SortingState | undefined>("sorting", { required: false });
  const columnFilters = defineModel<ColumnFiltersState | undefined>("columnFilters", {
    required: false,
  });
  const columnOrder = defineModel<ColumnOrderState | undefined>("columnOrder", { required: false });
  const columnPinning = defineModel<ColumnPinningState | undefined>("columnPinning", {
    required: false,
  });
  const columnSizing = defineModel<ColumnSizingState | undefined>("columnSizing", {
    required: false,
  });
  const columnVisibility = defineModel<ColumnsVisibleState | undefined>("columnVisibility", {
    required: false,
  });
  const expanded = defineModel<ExpandedState | undefined>("expanded", { required: false });
  const grouping = defineModel<GroupingState | undefined>("grouping", { required: false });
  const pagination = defineModel<PaginationState | undefined>("pagination", { required: false });
  const rowSelection = defineModel<RowSelectionState | undefined>("rowSelection", {
    required: false,
  });

  const rootRef = useTemplateRef<HTMLDivElement>("root");

  const ganttContainerComponent = useTemplateRef<{
    element: HTMLDivElement;
    defineRubberColumnSize: () => void;
  }>("table-container");
  const tableContainerRef = computed(() => ganttContainerComponent.value?.element);
  const defineRubberColumnSize = computed(
    () => ganttContainerComponent.value?.defineRubberColumnSize,
  );

  const { columnsDef, initialState } = useColumns(props, { gantt: true });
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

  const ganttSize = computed(() => props.ganttSize);
  const totalRows = computed(() => props.totalRows ?? table.getFilteredRowModel().rows.length);
  const {
    columnVirtualEnabled,
    columnsVirtual,
    rowVirtual,
    rowVirtualEnabled,
    rowVirtualizer,
    rows,
  } = useVirtualizer(props, {
    table,
    tableContainerRef,
    ganttSize,
  });

  defineExpose({ element: rootRef, tableInstance: table, defineRubberColumnSize });
</script>

<template>
  <div ref="root" v-bind="$attrs" class="ksd-table__wrapper" :class="{ full: $props.fullSize }">
    <TableFilter
      v-if="$props.withFilters && !$props.Filter"
      :with-filters="$props.withFilters ?? false"
      :table="table"
    />
    <component :is="$props.Filter" v-if="$props.withFilters && $props.Filter" :table="table" />

    <div class="ksd-table__overlay" :class="{ full: $props.fullSize }">
      <TableLoading v-if="$props.loading && !$props.Loader" />
      <component :is="$props.Loader" v-if="$props.loading && $props.Loader" />
      <GanttContainer
        ref="table-container"
        :full-size="$props.fullSize ?? false"
        :locale="$props.locale"
        :column-virtual-enabled="columnVirtualEnabled"
        :row-virtual-enabled="rowVirtualEnabled"
        :columns-virtual="columnsVirtual"
        :frozen-header="$props.frozenHeader ?? true"
        :rubber-column="$props.rubberColumn ?? false"
        :row-virtualizer="rowVirtualizer"
        :rows="rows"
        :table="table"
        :row-class-name="$props.rowClassName"
        :-empty="$props.Empty"
        :-row="$props.Row"
        :draggable-row="$props.draggableRow ?? false"
        :header-row-class-name="$props.headerRowClassName"
        :rows-virtual="rowVirtual"
        :can-drop-to-row="$props.canDropToRow"
        :gantt-interval-date="$props.ganttIntervalDate"
        :gantt-graph-grid="$props.ganttGraphGrid ?? false"
        :gantt-size="$props.ganttSize ?? 'sm'"
        :gantt-splitter-instant="$props.ganttSplitterInstant ?? true"
        :gantt-view="$props.ganttView ?? 'months'"
        :gantt-link-style-getter="$props.ganttLinkStyleGetter"
        :gantt-link-get-around="$props.ganttLinkGetAround ?? true"
        :gantt-link-visible-in-range="$props.ganttLinkVisibleInRange ?? true"
        :gantt-link-highlight="$props.ganttLinkHighlight ?? true"
        @drag-row="
          (sid, tid) => {
            $emit('dragRow', sid, tid);
          }
        "
        @click="(row, event) => $emit('click', row, event)"
        @dblclick="(row, event) => $emit('dblclick', row, event)"
        @graph-task-click="(row, event) => $emit('graphTaskClick', row, event)"
      >
        <template v-if="$slots['graphCell']" #graphCell="graphCellProps">
          <slot name="graphCell" v-bind="graphCellProps"></slot>
        </template>
      </GanttContainer>
      <TableTotal v-if="$props.withTotal" :total-rows="totalRows" />
    </div>
  </div>
</template>
