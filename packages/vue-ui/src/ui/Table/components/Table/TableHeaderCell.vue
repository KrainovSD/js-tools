<script setup lang="ts" generic="RowData extends DefaultRow">
  import { type CSSProperties, type ComponentPublicInstance, computed, h, shallowRef } from "vue";
  import { useDrag, useDrop } from "../../../../hooks";
  import { extractDnDPosition } from "../../../../lib";
  import { HEADER_CELL_DND_PREFIX } from "../../constants";
  import { getPrevFrozenWidthHeader } from "../../lib";
  import type { ColumnFiltersState, DefaultRow, HeaderInterface, SortingState } from "../../types";
  import TableHeaderCellGhost from "./TableHeaderCellGhost.vue";

  type Props = {
    header: HeaderInterface<RowData>;
    index: number;
    headers: HeaderInterface<RowData>[];
    columnPosition: number;
    selectedPage: boolean;
    filterState?: ColumnFiltersState;
    sortState?: SortingState;
    dragGhost?: boolean;
  };
  const RESIZE_HANDLE_WIDTH = 10;
  const THRESHOLD = 2;
  const props = defineProps<Props>();
  const headerContext = computed(() => props.header.getContext());
  const id = computed(() => headerContext.value.column.id);
  const draggable = computed(() =>
    frozenPosition.value ? false : props.header.column.columnDef.enableDraggable,
  );

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
    "frozen-right-first":
      frozenPosition.value === "right" && props.header.column.getIsFirstColumn("right"),
    dragging: dragging.value,
    "drag-over": dragOver.value,
  }));
  const headerConfigClasses = computed(() =>
    props.header.column.columnDef.headerClass.map((className) =>
      className instanceof Function
        ? className(headerContext.value, props.header.column.columnDef.headerClassProps)
        : className,
    ),
  );

  const headerStyles = computed<CSSProperties>(() => ({
    left: frozenPosition.value === "left" ? `${prevFrozen.value}px` : undefined,
    right: frozenPosition.value === "right" ? `${prevFrozen.value}px` : undefined,
    cursor: draggable.value ? "move" : "inherit",
    gridColumnStart: props.columnPosition,
  }));

  function canDrag(event: TouchEvent | MouseEvent) {
    const { left, width } = (event.currentTarget as HTMLElement).getBoundingClientRect();
    const { clientX } = extractDnDPosition(event);
    const isOverResize = clientX >= left + width - RESIZE_HANDLE_WIDTH - THRESHOLD;

    if (isOverResize) {
      event.preventDefault();

      return false;
    }

    return true;
  }

  function onDrop(dragId: string, dropId: string) {
    let columnOrderState = [...headerContext.value.table.getState().columnOrder];
    if (columnOrderState.length === 0) {
      columnOrderState = headerContext.value.table.getAllColumns().map((column) => column.id);
    }

    let sourceIndex: number = -1;
    let targetIndex: number = -1;
    for (let i = 0; i <= columnOrderState.length - 1; i++) {
      const id = columnOrderState[i];
      if (dragId === id) {
        sourceIndex = i;
      }
      if (dropId === id) {
        targetIndex = i;
      }

      if (~sourceIndex && ~targetIndex) break;
    }

    if (!~sourceIndex || !~targetIndex) return;

    [columnOrderState[+sourceIndex], columnOrderState[+targetIndex]] = [
      columnOrderState[+targetIndex],
      columnOrderState[+sourceIndex],
    ];

    headerContext.value.table.setColumnOrder(columnOrderState);
  }

  const DragGhost = computed(() =>
    h(TableHeaderCellGhost<RowData>, {
      header: props.header,
    }),
  );
  const headerCellRef = shallowRef<HTMLElement | null>(null);
  const scrollContainer = computed(() =>
    headerCellRef.value?.closest?.<HTMLElement>(".ksd-table__container"),
  );

  const { dragRef, dragging } = useDrag({
    group: HEADER_CELL_DND_PREFIX,
    id,
    canDrag,
    onDrop,
    dragGhost: DragGhost,
    scrollContainer,
  });
  const { dropRef, dragOver } = useDrop({ group: HEADER_CELL_DND_PREFIX, id });
  const extractRef = computed(() => {
    return (node: Element | ComponentPublicInstance | null) => {
      dragRef(node);
      dropRef(node);
      if (node instanceof HTMLElement) {
        headerCellRef.value = node;
      }
    };
  });
</script>

<template>
  <div
    :ref="draggable ? extractRef : undefined"
    role="columnheader"
    tabindex="0"
    :data-column-id="id"
    class="ksd-table__header-cell"
    :class="[headerClasses, headerConfigClasses]"
    :style="headerStyles"
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
      :style="{ width: `${RESIZE_HANDLE_WIDTH}px` }"
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

      &.dragging {
        opacity: var(--ksd-table-header-drag-opacity);
        pointer-events: none;
      }
      &.drag-over {
        background-color: var(--ksd-table-header-drag-bg);
      }

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

      &:where(.common) {
        border-block-end: 1px solid var(--ksd-table-border);
        border-inline-end: 1px solid var(--ksd-table-border);
        border-spacing: 0px;
        overflow: hidden;
        white-space: pre-wrap;
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 8px;
        color: var(--ksd-table-text-color);
        line-height: 22px;
        font-size: 14px;
        font-weight: 500;
        font-family: var(--ksd-table-font-family);
        min-height: 35px;
        background: inherit;
        padding: 0 8px;

        & > div:first-child {
          height: fit-content;
          display: flex;
          align-items: center;
          max-width: 100%;
          overflow: hidden;
          justify-content: space-between;
          width: 100%;
        }
      }
      &:where(.empty) {
        border-inline-end: none;
      }
      &:where(.hCenter) {
        & > div:first-child {
          height: 100%;
          align-items: center;
        }
      }
      &:where(.wCenter) {
        & > div:first-child {
          width: 100%;
          justify-content: center;
        }
      }
      &:where(.lineClamp) {
        & span {
          display: -webkit-box;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 2;
          line-clamp: 2;
          align-self: stretch;
        }
      }
      &:where(.nowrap) {
        white-space: nowrap;
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
