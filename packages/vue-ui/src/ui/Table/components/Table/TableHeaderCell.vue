<script setup lang="ts" generic="RowData extends DefaultRow">
  import { type CSSProperties, computed, onMounted, onUnmounted, ref } from "vue";
  import { DND_EVENT_BUS, HEADER_CELL_DND_HANDLERS, getPrevFrozenWidthHeader } from "../../lib";
  import type { ColumnFiltersState, DefaultRow, HeaderInterface, SortingState } from "../../types";

  type Props = {
    header: HeaderInterface<RowData>;
    index: number;
    headers: HeaderInterface<RowData>[];
    columnPosition: number;
    selectedPage: boolean;
    filterState?: ColumnFiltersState;
    sortState?: SortingState;
  };
  const RESIZE_HANDLE_WIDTH = 10;
  const THRESHOLD = 2;
  const props = defineProps<Props>();
  const headerContext = computed(() => props.header.getContext());
  const id = computed(() => `header-column-${headerContext.value.column.id}`);
  const draggable = computed(() =>
    frozenPosition.value ? false : props.header.column.columnDef.enableDraggable,
  );
  const dragging = ref(false);
  const dragOver = ref(false);

  const frozenPosition = computed(() => props.header.column.getIsPinned());
  const prevFrozen = computed(() =>
    getPrevFrozenWidthHeader({
      frozenPosition: frozenPosition.value,
      headers: props.headers,
      index: props.index,
    }),
  );
  const HeaderRender = computed(() => props.header.column.columnDef.headerRender);

  const headerClasses = computed(() => ({
    "frozen-left": frozenPosition.value === "left",
    "frozen-right": frozenPosition.value === "right",
    "frozen-left-last":
      frozenPosition.value === "left" && props.header.column.getIsLastColumn("left"),
    "frozen-right-last":
      frozenPosition.value === "right" && props.header.column.getIsFirstColumn("right"),
    dragging,
    "drag-over": dragOver,
  }));
  const headerConfigClasses = computed(() =>
    props.header.column.columnDef.headerClass.map((className) =>
      className instanceof Function
        ? className(headerContext.value, props.header.column.columnDef.headerClassProps)
        : className,
    ),
  );
  const headerStyles = computed<CSSProperties>(() => ({
    left: frozenPosition.value === "left" ? prevFrozen.value : undefined,
    right: frozenPosition.value === "right" ? prevFrozen.value : undefined,
    cursor: draggable.value ? "move" : "inherit",
    gridColumnStart: props.columnPosition,
  }));

  function handleDragStart(event: DragEvent) {
    const { left, width } = (event.currentTarget as HTMLElement).getBoundingClientRect();
    const isOverResize = event.clientX >= left + width - RESIZE_HANDLE_WIDTH - THRESHOLD;

    if (isOverResize) {
      event.preventDefault();

      return;
    }

    HEADER_CELL_DND_HANDLERS.handleDragStart(event);
  }
  function handleDrop(event: DragEvent) {
    const { source, target } = HEADER_CELL_DND_HANDLERS.handleDrop(event) ?? {};

    if (source == undefined || target == undefined || source === target) {
      return;
    }

    const columnOrderState = headerContext.value.table.getState().columnOrder;
    let sourceIndex: number = -1;
    let targetIndex: number = -1;
    for (let i = 0; i <= columnOrderState.length; i++) {
      const id = columnOrderState[i];
      if (source === id) {
        sourceIndex = i;
      }
      if (target === id) {
        targetIndex = i;
      }

      if (~sourceIndex && ~targetIndex) break;
    }

    if (!~sourceIndex || !~targetIndex) return;

    const order = [...columnOrderState];
    [order[+sourceIndex], order[+targetIndex]] = [order[+targetIndex], order[+sourceIndex]];
    /** TODO: Проверить реактивность без мутации */
    headerContext.value.table.setColumnOrder(order);
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
    role="columnheader"
    tabindex="0"
    :data-column-id="id"
    class="ksd-table__header-cell"
    :class="[headerClasses, headerConfigClasses]"
    :style="headerStyles"
    :draggable="draggable"
    @dragover="HEADER_CELL_DND_HANDLERS.handleDragOver"
    @dragstart="handleDragStart"
    @drop="handleDrop"
    @dragend="HEADER_CELL_DND_HANDLERS.handleDragEnd"
    @dragenter="HEADER_CELL_DND_HANDLERS.handleDragEnter"
    @dragleave="HEADER_CELL_DND_HANDLERS.handleDragLeave"
  >
    <component
      :is="HeaderRender"
      v-if="HeaderRender"
      :context="headerContext"
      :settings="headerContext.column.columnDef.headerRenderProps"
    />
    <div
      v-if="$props.header.column.getCanResize()"
      class="ksd-table__header-cell-resize"
      :style="{ width: RESIZE_HANDLE_WIDTH }"
      @mousedown="$props.header.getResizeHandler()"
      @touchstart="$props.header.getResizeHandler()"
    ></div>
  </div>
</template>

<style lang="scss">
  .ksd-table {
    &__header-cell {
      position: relative;
      display: block;

      &.frozen-left {
        position: sticky;
        z-index: 2;
      }
      &.frozen-right {
        position: sticky;
        z-index: 2;
      }
      &.frozen-left-last {
        box-shadow: var(--ksd-table-box-shadow-right);
      }
      &.frozen-right-first {
        box-shadow: var(--ksd-table-box-shadow-left);
        border-left: 1px solid var(--ksd-table-border);
      }
    }
    &__header-cell-resize {
      position: absolute;
      right: 0px;
      top: 0;
      z-index: 1;
      height: 100%;
      cursor: col-resize;
      user-select: none;
      touch-action: none;
    }
  }
</style>
