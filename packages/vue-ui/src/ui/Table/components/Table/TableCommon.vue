<script setup lang="ts" generic="RowData extends DefaultRow">
  import type { VirtualItem, Virtualizer } from "@tanstack/vue-virtual";
  import { type CSSProperties, type Component, computed, onMounted, useTemplateRef } from "vue";
  import type {
    DefaultRow,
    DragRowHandler,
    HeaderGroupInterface,
    RowInterface,
    TableEmptyProps,
    TableInterface,
  } from "../../types";

  type Props = {
    rubberColumn: boolean;
    columnVirtualEnabled: boolean;
    rowVirtualEnabled: boolean;
    table: TableInterface<RowData>;
    frozenHeader: boolean;
    columnsVirtual: VirtualItem[];
    rowsVirtual: VirtualItem[];
    rows: RowInterface<RowData>[];
    rowVirtualizer: Virtualizer<HTMLDivElement, HTMLElement>;
    onClickRow:
      | ((row: RowInterface<RowData>, event: React.MouseEvent<HTMLElement>) => void)
      | undefined;
    onDoubleClickRow:
      | ((row: RowInterface<RowData>, event: React.MouseEvent<HTMLElement>) => void)
      | undefined;
    rowClassName: ((row: RowInterface<RowData>) => string | undefined) | string | undefined;
    headerRowClassName:
      | ((header: HeaderGroupInterface<RowData>) => string | undefined)
      | string
      | undefined;
    Row:
      | ((row: RowInterface<RowData>) => Component<{ row: RowInterface<RowData> }> | undefined)
      | undefined;
    Empty: Component<TableEmptyProps> | undefined;
    draggableRow: boolean;
    onDraggableRow: DragRowHandler | undefined;
  };
  type Emits = {};

  const props = defineProps<Props>();
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
  }));

  /** TODO: Rubber column logic */
  onMounted(() => {});
</script>

<template>
  <div ref="table" role="table" class="ksd-table" :style="tableStyles">
    <div role="rowgroup" class="ksd-table__header" :class="{ frozen: props.frozenHeader }"></div>
    <div role="rowgroup" class="ksd-table__body" :style="tableBodyStyles"></div>
  </div>
</template>

<style lang="scss">
  .ksd-table {
    &__header {
      &.frozen {
      }
    }

    &__body {
    }
  }
</style>
