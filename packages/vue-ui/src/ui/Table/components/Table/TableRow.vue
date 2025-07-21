<script setup lang="ts" generic="RowData extends DefaultRow">
  import type { VirtualItem, Virtualizer } from "@tanstack/vue-virtual";
  import {
    type CSSProperties,
    type Component,
    type ComponentPublicInstance,
    computed,
    h,
    shallowRef,
  } from "vue";
  import { useDrag, useDrop } from "../../../../hooks";
  import { ROW_DND_PREFIX } from "../../constants";
  import type { CellInterface, DefaultRow, RowInterface } from "../../types";
  import TableCell from "./TableCell.vue";
  import TableRowGhost from "./TableRowGhost.vue";

  type Props = {
    rows: RowInterface<RowData>[];
    selected: boolean;
    row: RowInterface<RowData>;
    columnsVirtual: string[];
    virtualRow: VirtualItem | null;
    rowVirtualizer: Virtualizer<HTMLDivElement, HTMLElement>;
    rowClassName: ((row: RowInterface<RowData>) => string | undefined) | string | undefined;
    columnVirtualEnabled: boolean;
    expanded: boolean;
    Row: ((row: RowInterface<RowData>) => Component | undefined) | undefined;
    visibleCells: CellInterface<RowData>[];
    height: number | undefined;
    draggableRow: boolean;
  };
  type Emits = {
    dragRow: [sourceId: string, targetId: string];
    click: [row: RowInterface<RowData>, event: MouseEvent];
    dblclick: [row: RowInterface<RowData>, event: MouseEvent];
  };

  const props = defineProps<Props>();
  const emit = defineEmits<Emits>();

  const rowIndex = computed(() => (props.virtualRow ? props.virtualRow.index : props.row.index));
  const id = computed(() => props.row.id);

  // eslint-disable-next-line new-cap
  const CustomRow = computed(() => props.Row?.(props.row));
  const leftVisibleCells = computed(() => props.row.getLeftVisibleCells());
  const centerVisibleCells = computed(() => props.row.getCenterVisibleCells());
  const rightVisibleCells = computed(() => props.row.getRightVisibleCells());

  function onDrop(dragId: string, dropId: string) {
    emit("dragRow", dragId, dropId);
  }
  const DragGhost = computed(() =>
    h(TableRowGhost<RowData>, {
      selected: props.selected,
      row: props.row,
      rowClassName: props.rowClassName,
      visibleCells: props.visibleCells,
      height: props.height,
      expanded: props.expanded,
    }),
  );
  const rowRef = shallowRef<HTMLElement | null>(null);
  const scrollContainer = computed(() =>
    rowRef.value?.closest?.<HTMLElement>(".ksd-table__container"),
  );
  const { cursorPosition, dragRef, dragging } = useDrag({
    group: ROW_DND_PREFIX,
    id,
    dragSelector: ".ksd-table-row-drag-handle",
    onDrop,
    scrollContainer,
    dragGhost: DragGhost,
  });
  const { dropRef, dragOver } = useDrop({ group: ROW_DND_PREFIX, id });
  const extractRef = computed(() => {
    return (node: Element | ComponentPublicInstance | null) => {
      dragRef(node);
      dropRef(node);

      if (node instanceof HTMLElement) {
        if (props.virtualRow) {
          props.rowVirtualizer.measureElement(node);
        }
        rowRef.value = node;
      }
    };
  });
  const rowGhostStyle = computed<CSSProperties>(() => ({
    left: `${cursorPosition.value.x}px`,
    top: `${cursorPosition.value.y}px`,
  }));

  const rowClasses = computed(() => ({
    selected: props.selected,
    virtual: props.virtualRow,
    dragging: dragging.value,
    "drag-over": dragOver.value,
  }));
  const rowConfigClasses = computed(() =>
    props.rowClassName instanceof Function ? props.rowClassName(props.row) : props.rowClassName,
  );
  const rowStyles = computed<CSSProperties>(() => ({
    transform: props.virtualRow ? `translateY(${props.virtualRow.start}px)` : undefined,
    minHeight: props.height != undefined ? `${props.height}px` : undefined,
    maxHeight: props.height != undefined ? `${props.height}px` : undefined,
  }));

  function onKeyDown(event: KeyboardEvent) {
    const target = event.target as HTMLDivElement;
    const currentTarget = event.currentTarget as HTMLDivElement;

    if ((event.key === " " || event.key === "Enter") && target === currentTarget) {
      event.preventDefault();
      currentTarget.click();
    }
    if (event.key === "ArrowUp" && currentTarget.previousElementSibling instanceof HTMLDivElement) {
      currentTarget.previousElementSibling.focus();
      event.preventDefault();
    }
    if (event.key === "ArrowDown" && currentTarget.nextElementSibling instanceof HTMLDivElement) {
      currentTarget.nextElementSibling.focus();
      event.preventDefault();
    }
  }
</script>

<template>
  <div
    :ref="extractRef"
    role="row"
    tabindex="0"
    class="ksd-table__row"
    :class="[rowClasses, rowConfigClasses]"
    :style="rowStyles"
    :data-index="rowIndex"
    :data-row-id="id"
    @click="(event) => $emit('click', $props.row, event)"
    @dblclick="(event) => $emit('dblclick', $props.row, event)"
    @keydown="onKeyDown"
  >
    <template v-if="props.columnVirtualEnabled && !CustomRow">
      <TableCell
        v-for="(cell, index) in leftVisibleCells"
        :key="cell.column.columnDef.id"
        :cell="cell"
        :cells="leftVisibleCells"
        :column-position="index + 1"
        :index="index"
        :selected="$props.selected"
        :expanded="$props.expanded"
      />
      <TableCell
        v-for="index in props.columnsVirtual"
        :key="centerVisibleCells[+index].column.columnDef.id"
        :cell="centerVisibleCells[+index]"
        :cells="centerVisibleCells"
        :column-position="leftVisibleCells.length + +index + 1"
        :index="+index"
        :selected="$props.selected"
        :expanded="$props.expanded"
      />
      <TableCell
        v-for="(cell, index) in rightVisibleCells"
        :key="cell.column.columnDef.id"
        :cell="cell"
        :cells="rightVisibleCells"
        :column-position="leftVisibleCells.length + centerVisibleCells.length + index + 1"
        :index="index"
        :selected="$props.selected"
        :expanded="$props.expanded"
      />
    </template>
    <template v-if="!props.columnVirtualEnabled && !CustomRow">
      <TableCell
        v-for="(cell, index) in $props.visibleCells"
        :key="cell.column.columnDef.id"
        :cell="cell"
        :cells="$props.visibleCells"
        :column-position="index + 1"
        :index="index"
        :selected="$props.selected"
        :expanded="$props.expanded"
      />
    </template>
    <component :is="CustomRow" v-if="CustomRow" />
  </div>
  <Teleport v-if="dragging" to="body">
    <div :style="[rowGhostStyle, { position: 'absolute', zIndex: 200, pointerEvents: 'none' }]">
      row
    </div>
  </Teleport>
</template>

<style lang="scss">
  .ksd-table {
    &__row {
      display: grid;
      background-color: var(--ksd-table-row-bg);
      position: relative;
      width: calc(var(--table-total-width) * 1px);
      grid-template-columns: var(--table-template-columns);

      &:hover {
        background-color: var(--ksd-table-row-hover-bg);
      }
      &:focus-visible {
        background-color: var(--ksd-table-row-hover-bg);
        outline: none;
      }

      &.selected {
        background-color: var(--ksd-table-selected-row-bg);

        &:hover {
          background-color: var(--ksd-table-selected-row-hover-bg);
        }
        &:focus-visible {
          background-color: var(--ksd-table-selected-row-hover-bg);
          outline: none;
        }
      }
      &.virtual {
        position: absolute;
      }
      &.dragging {
        opacity: var(--ksd-table-row-drag-opacity);
      }
      &.drag-over {
        background-color: var(--ksd-table-row-drag-bg);
      }
    }
  }
</style>
