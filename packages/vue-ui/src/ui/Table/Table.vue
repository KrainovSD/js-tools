<script
  setup
  lang="ts"
  generic="
    RowData extends DefaultRow,
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
  import {
    TableCommon,
    TableFilter,
    TableLoading,
    TablePagination,
    TableTotal,
  } from "./components";
  import TableEmpty from "./components/Table/TableEmpty.vue";
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
    GroupingState,
    HeaderClassInterface,
    HeaderRenderComponent,
    PaginationState,
    RowInterface,
    RowSelectionState,
    SortFn,
    SortRenderComponent,
    SortingState,
    TableProps,
  } from "./types";

  type Emits = {
    dragRow: [sourceId: string, targetId: string];
    click: [row: RowInterface<RowData>, event: MouseEvent];
    dblclick: [row: RowInterface<RowData>, event: MouseEvent];
  };

  const props = withDefaults(
    defineProps<
      TableProps<
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
  const tableComponentRef = useTemplateRef("table-component");
  const defineRubberColumnSize = computed(() => tableComponentRef.value?.defineRubberColumnSize);

  const tableContainerRef = useTemplateRef<HTMLDivElement>("table-container");

  const { columnsDef, initialState } = useColumns(props, { gantt: false });
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
    ganttSize: undefined,
  });

  defineExpose({
    element: rootRef,
    tableInstance: table,
    defineRubberColumnSize,
  });
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
      <TableEmpty v-if="rows.length === 0 && !$props.Empty" />
      <component :is="$props.Empty" v-if="rows.length === 0 && $props.Empty" />
      <TableLoading v-if="$props.loading && !$props.Loader" />
      <component :is="$props.Loader" v-if="$props.loading && $props.Loader" />
      <div ref="table-container" class="ksd-table__container" :class="{ full: $props.fullSize }">
        <TableCommon
          ref="table-component"
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
          :header-height="$props.headerHeight"
          :row-height="$props.rowHeight"
          :can-drop-to-row="$props.canDropToRow"
          @drag-row="
            (sid, tid) => {
              $emit('dragRow', sid, tid);
            }
          "
          @click="(row, event) => $emit('click', row, event)"
          @dblclick="(row, event) => $emit('dblclick', row, event)"
        />
      </div>
      <TableTotal v-if="$props.withTotal" :total-rows="totalRows" />
    </div>

    <TablePagination
      v-if="$props.withPagination"
      :-pagination="$props.Pagination"
      :table="table"
      :total-rows="totalRows"
      :page-sizes="$props.pageSizes"
    />
  </div>
</template>

<style lang="scss">
  .ksd-table {
    &__wrapper {
      width: 100%;
      height: fit-content;
      max-height: 100%;
      display: flex;
      flex-direction: column;
      position: relative;

      &.full {
        height: 100%;
      }
    }
    &__overlay {
      display: flex;
      position: relative;
      overflow: hidden;
      width: 100%;
      height: fit-content;
      flex-direction: column;

      &.full {
        height: 100%;
      }
    }
    &__container {
      overflow: auto;
      position: relative;
      width: 100%;
      border: 1px solid var(--ksd-table-border);
      background-color: var(--ksd-table-container-color);
      height: fit-content;
      scrollbar-gutter: stable;

      &.full {
        height: 100%;
      }

      &.gantt {
        overflow-y: auto;
        overflow-x: hidden;
      }
    }
  }
</style>
