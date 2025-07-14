<script setup lang="ts" generic="RowData extends DefaultRow">
  import type { VirtualItem, Virtualizer } from "@tanstack/vue-virtual";
  import {
    type CSSProperties,
    type Component,
    type ComponentPublicInstance,
    computed,
    onMounted,
    onUnmounted,
    ref,
  } from "vue";
  import { DND_EVENT_BUS, ROW_DND_HANDLERS } from "../../lib";
  import type { CellInterface, DefaultRow, RowInterface } from "../../types";
  import TableCell from "./TableCell.vue";

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
    dragRow: [
      sourceIndex: number,
      targetIndex: number,
      sourceId: number | string,
      targetId: number | string,
    ];
    click: [row: RowInterface<RowData>, event: MouseEvent];
    dblclick: [row: RowInterface<RowData>, event: MouseEvent];
  };

  const props = defineProps<Props>();
  const emit = defineEmits<Emits>();

  const rowIndex = computed(() => (props.virtualRow ? props.virtualRow.index : props.row.index));
  const id = computed(() => `row-${rowIndex.value}`);
  const dragging = ref(false);
  const dragOver = ref(false);
  // eslint-disable-next-line new-cap
  const CustomRow = computed(() => props.Row?.(props.row));
  const leftVisibleCells = computed(() => props.row.getLeftVisibleCells());
  const centerVisibleCells = computed(() => props.row.getCenterVisibleCells());
  const rightVisibleCells = computed(() => props.row.getRightVisibleCells());

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
    minHeight: props.height,
    maxHeight: props.height,
  }));
  const rowRef = computed(() => {
    return props.virtualRow
      ? (node: Element | ComponentPublicInstance | null) =>
          node instanceof HTMLElement && props.rowVirtualizer.measureElement(node)
      : undefined;
  });

  function handleDragStart(event: DragEvent) {
    const target = document.elementFromPoint(event.clientX, event.clientY) as HTMLElement | null;

    const isDragHandle =
      target?.classList?.contains?.("ksd-table-drag-handle") ||
      target?.closest?.(".ksd-table-drag-handle");
    if (!target || !isDragHandle) {
      event.stopPropagation();
      event.preventDefault();

      return;
    }

    ROW_DND_HANDLERS.handleDragStart(event);
  }

  function handleDrop(event: DragEvent) {
    const { source, target } = ROW_DND_HANDLERS.handleDrop(event);
    if (source == undefined || target == undefined || source === target) return;

    const sourceIndex = +source.replace("row-", "");
    const targetIndex = +target.replace("row-", "");

    if (Number.isNaN(sourceIndex) || Number.isNaN(targetIndex)) {
      return;
    }

    const sourceId = props.rows[sourceIndex].id;
    const targetId = props.rows[targetIndex].id;

    emit("dragRow", sourceIndex, targetIndex, sourceId, targetId);
  }

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

  onMounted(() => {
    DND_EVENT_BUS.subscribe(id.value, {
      enterDrag: function enterDrag() {
        dragOver.value = true;
      },
      leaveDrag: function leaveDrag() {
        dragOver.value = false;
      },
      startDrag: function startDrag() {
        dragging.value = true;
      },
      stopDrag: function stopDrag() {
        dragging.value = false;
      },
    });
  });

  onUnmounted(() => {
    DND_EVENT_BUS.unsubscribe(id.value);
  });
</script>

<template>
  <div
    :ref="rowRef"
    role="row"
    tabindex="0"
    class="ksd-table__row"
    :class="[rowClasses, rowConfigClasses]"
    :style="rowStyles"
    :data-index="rowIndex"
    :data-row-id="id"
    :draggable="$props.draggableRow"
    @click="(event) => $emit('click', $props.row, event)"
    @dblclick="(event) => $emit('dblclick', $props.row, event)"
    @keydown="onKeyDown"
    @dragstart="handleDragStart"
    @drop="handleDrop"
    @dragend="ROW_DND_HANDLERS.handleDragEnd"
    @dragover="ROW_DND_HANDLERS.handleDragOver"
    @dragenter="ROW_DND_HANDLERS.handleDragEnter"
    @dragleave="ROW_DND_HANDLERS.handleDragLeave"
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
