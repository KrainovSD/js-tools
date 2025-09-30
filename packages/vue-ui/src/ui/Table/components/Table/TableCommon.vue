<script setup lang="ts" generic="RowData extends DefaultRow">
  import type { VirtualItem, Virtualizer } from "@tanstack/vue-virtual";
  import { type CSSProperties, type Component, computed, useTemplateRef, watch } from "vue";
  import { defineRubberColumnSize } from "../../lib";
  import type {
    DefaultRow,
    HeaderGroupInterface,
    RowInterface,
    TableEmptyProps,
    TableInterface,
  } from "../../types";
  import TableHeaderRow from "./TableHeaderRow.vue";
  import TableRow from "./TableRow.vue";

  type Props = {
    rowHeight: number | undefined;
    headerHeight: number | undefined;
    rubberColumn: boolean;
    columnVirtualEnabled: boolean;
    rowVirtualEnabled: boolean;
    table: TableInterface<RowData>;
    frozenHeader: boolean;
    columnsVirtual: VirtualItem[];
    rowsVirtual: VirtualItem[];
    rows: RowInterface<RowData>[];
    rowVirtualizer: Virtualizer<HTMLDivElement, HTMLElement>;
    rowClassName: ((row: RowInterface<RowData>) => string | undefined) | string | undefined;
    headerRowClassName:
      | ((header: HeaderGroupInterface<RowData>) => string | undefined)
      | string
      | undefined;
    Row: ((row: RowInterface<RowData>) => Component | undefined) | undefined;
    Empty: Component<TableEmptyProps> | undefined;
    draggableRow: boolean;
    canDropToRow: ((dropId: string) => boolean | undefined) | undefined;
  };
  type Emits = {
    dragRow: [sourceId: string, targetId: string];
    click: [row: RowInterface<RowData>, event: MouseEvent];
    dblclick: [row: RowInterface<RowData>, event: MouseEvent];
  };

  const props = defineProps<Props>();
  defineEmits<Emits>();
  const tableRef = useTemplateRef("table");

  const tableState = computed(() => props.table.getState());
  const leftHeadersGroup = computed(() => props.table.getLeftHeaderGroups());
  const rightHeadersGroup = computed(() => props.table.getRightHeaderGroups());
  const centerHeadersGroup = computed(() => props.table.getCenterHeaderGroups());
  const visibleHeadersGroup = computed(() => props.table.getHeaderGroups());

  const virtualColumnIndexesKey = computed(() =>
    props.columnsVirtual.length === 0
      ? null
      : props.columnsVirtual.map((virtual) => virtual.index).join(";"),
  );
  const virtualColumns = computed(() =>
    virtualColumnIndexesKey.value ? virtualColumnIndexesKey.value.split(";") : [],
  );
  const templateColumns = computed(
    () =>
      visibleHeadersGroup.value[0]?.headers?.map?.((header) => `${header.column.getSize()}px`) ??
      [],
  );
  const tableStyles = computed<CSSProperties>(() => ({
    "--table-template-columns": templateColumns.value.join(" "),
    "--table-total-width": props.table.getTotalSize(),
  }));
  const tableBodyStyles = computed<CSSProperties>(() => ({
    height:
      props.rowVirtualEnabled && props.rowsVirtual.length > 0
        ? `${props.rowVirtualizer.getTotalSize()}px`
        : undefined,
    "--table-body-height":
      props.rowVirtualEnabled && props.rowsVirtual.length > 0
        ? `${props.rowVirtualizer.getTotalSize()}px`
        : undefined,
  }));

  function defineRubberColumnSizeFn() {
    defineRubberColumnSize({
      setColumnSizing: props.table.setColumnSizing,
      table: tableRef.value,
      visibleHeadersGroup: visibleHeadersGroup.value,
    });
  }

  watch(
    () => [visibleHeadersGroup.value, tableRef.value],
    () => {
      if (!props.rubberColumn) return;

      defineRubberColumnSizeFn();
    },
    { immediate: true },
  );
  watch(
    tableRef,
    (table, _, clean) => {
      if (!table || !props.rubberColumn) return;

      const resizeObserver = new ResizeObserver(() => {
        defineRubberColumnSizeFn();
      });
      resizeObserver.observe(table);

      clean(() => {
        resizeObserver.disconnect();
      });
    },
    { immediate: true },
  );

  defineExpose({ defineRubberColumnSize: defineRubberColumnSizeFn });
</script>

<template>
  <div ref="table" role="table" class="ksd-table" :style="tableStyles">
    <div role="rowgroup" class="ksd-table__header" :class="{ frozen: $props.frozenHeader }">
      <TableHeaderRow
        v-for="(headerGroup, index) in visibleHeadersGroup"
        :key="headerGroup.id"
        :column-virtual-enabled="$props.columnVirtualEnabled"
        :columns-virtual="virtualColumns"
        :header-group="headerGroup"
        :left-headers="leftHeadersGroup[index].headers"
        :center-headers="centerHeadersGroup[index].headers"
        :right-headers="rightHeadersGroup[index].headers"
        :header-row-class-name="$props.headerRowClassName"
        :selected-page="$props.table.getIsAllPageRowsSelected()"
        :page="tableState.pagination.pageIndex"
        :filter-state="tableState.columnFilters"
        :sort-state="tableState.sorting"
        :height="$props.headerHeight"
      />
    </div>
    <div role="rowgroup" class="ksd-table__body" :style="tableBodyStyles">
      <template v-if="$props.rowVirtualEnabled">
        <TableRow
          v-for="virtualRow in $props.rowsVirtual"
          :key="virtualRow.index"
          :column-virtual-enabled="$props.columnVirtualEnabled"
          :columns-virtual="virtualColumns"
          :rows="$props.rows"
          :row-virtualizer="$props.rowVirtualizer"
          :row="$props.rows[virtualRow.index]"
          :selected="$props.rows[virtualRow.index]?.getIsSelected?.()"
          :expanded="$props.rows[virtualRow.index]?.getIsExpanded()"
          :-row="$props.Row"
          :visible-cells="$props.rows[virtualRow.index]?.getVisibleCells?.() ?? []"
          :height="$props.rowHeight"
          :draggable-row="$props.draggableRow"
          :row-class-name="$props.rowClassName"
          :virtual-row="virtualRow"
          :can-drop-to-row="$props.canDropToRow"
          @click="(row, event) => $emit('click', row, event)"
          @dblclick="(row, event) => $emit('dblclick', row, event)"
          @drag-row="
            (sid, tid) => {
              $emit('dragRow', sid, tid);
            }
          "
        />
      </template>
      <template v-if="!$props.rowVirtualEnabled">
        <TableRow
          v-for="row in $props.rows"
          :key="row.id"
          :column-virtual-enabled="$props.columnVirtualEnabled"
          :columns-virtual="virtualColumns"
          :rows="$props.rows"
          :row-virtualizer="$props.rowVirtualizer"
          :row="row"
          :selected="row?.getIsSelected?.()"
          :expanded="row?.getIsExpanded()"
          :-row="$props.Row"
          :visible-cells="row?.getVisibleCells?.() ?? []"
          :height="$props.rowHeight"
          :draggable-row="$props.draggableRow"
          :row-class-name="$props.rowClassName"
          :virtual-row="null"
          :can-drop-to-row="$props.canDropToRow"
          @click="(row, event) => $emit('click', row, event)"
          @dblclick="(row, event) => $emit('dblclick', row, event)"
          @drag-row="(sid, tid) => $emit('dragRow', sid, tid)"
        />
      </template>
    </div>
  </div>
</template>

<style lang="scss">
  .ksd-table {
    border-spacing: 0px;
    table-layout: fixed;
    border-collapse: collapse;
    height: fit-content;
    width: 100%;
    display: flex;
    flex-direction: column;

    &__header {
      display: grid;
      display: flex;
      flex-direction: column;
      &.frozen {
        position: sticky;
        top: 0;
        z-index: 2;
      }
    }

    &__body {
      position: relative;
      background-color: var(--ksd-table-body-bg);
      display: flex;
      flex-direction: column;
      min-height: var(--table-body-height, 120px);
      flex: 1;
    }
  }
</style>
