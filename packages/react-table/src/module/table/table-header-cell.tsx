import type {
  ColumnFiltersState,
  ColumnOrderState,
  Header,
  SortingState,
  Updater,
} from "@tanstack/react-table";
import clsx from "clsx";
import React from "react";
import type { DefaultRow } from "../../types";
import { getPrevFrozenWidthHeader } from "./lib";
import styles from "./table-header-cell.module.scss";

const RESIZE_HANDLE_WIDTH = 10;
const THRESHOLD = 2;

type Props<RowData extends DefaultRow> = {
  header: Header<RowData, unknown>;
  index: number;
  headers: Header<RowData, unknown>[];
  columnPosition: number;
  selectedPage: boolean;
  filterState?: ColumnFiltersState;
  sortState?: SortingState;
};

export const TableHeaderCell = React.memo(function TableHeaderCell<RowData extends DefaultRow>(
  props: Props<RowData>,
) {
  const headerContext = props.header.getContext();
  const headerClass = props.header.column.columnDef.headerClass;
  const headerClasses = headerClass.map((style) =>
    typeof style === "function" ? style(headerContext) : style,
  );
  const frozenPosition = props.header.column.getIsPinned();
  const prevFrozen = getPrevFrozenWidthHeader({
    frozenPosition,
    headers: props.headers,
    index: props.index,
  });
  const HeaderRender = props.header.column.columnDef.headerRender;
  const draggable = frozenPosition ? false : props.header.column.columnDef.enableDraggable;

  if (!HeaderRender) return null;

  return (
    <div
      role="columnheader"
      tabIndex={0}
      data-id="header-cell"
      data-column-id={headerContext.column.id}
      key={props.header.id}
      className={clsx(
        styles.headerCell,
        frozenPosition === "left" && styles.headerCell__frozen_left,
        frozenPosition === "right" && styles.headerCell__frozen_right,
        frozenPosition === "left" &&
          props.header.column.getIsLastColumn("left") &&
          styles.headerCell__frozen_left_last,
        frozenPosition === "right" &&
          props.header.column.getIsFirstColumn("right") &&
          styles.headerCell__frozen_right_first,
        headerClasses,
      )}
      style={{
        left: frozenPosition === "left" ? prevFrozen : undefined,
        right: frozenPosition === "right" ? prevFrozen : undefined,
        cursor: draggable ? "move" : "inherit",
        gridColumnStart: props.columnPosition,
      }}
      draggable={draggable}
      onDragOver={draggable ? (event) => event.preventDefault() : undefined}
      onDragStart={draggable ? handleDragStart : undefined}
      onDragEnd={draggable ? handleDragEnd : undefined}
      onDragEnter={draggable ? handleDragEnter : undefined}
      onDragLeave={draggable ? handleDragLeave : undefined}
      onDrop={
        draggable
          ? handleDropGetter(
              headerContext.table.getState().columnOrder,
              headerContext.table.setColumnOrder,
            )
          : undefined
      }
    >
      <HeaderRender context={headerContext} />

      {props.header.column.getCanResize() && (
        // eslint-disable-next-line jsx-a11y/no-static-element-interactions
        <div
          onMouseDown={props.header.getResizeHandler()}
          onTouchStart={props.header.getResizeHandler()}
          className={styles.headerResize}
          style={{
            width: RESIZE_HANDLE_WIDTH,
          }}
        />
      )}
    </div>
  );
}) as <RowData extends DefaultRow>(props: Props<RowData>) => React.JSX.Element;

function handleDragStart(event: React.DragEvent<HTMLElement>) {
  const { left, width } = event.currentTarget.getBoundingClientRect();
  const isOverResize = event.clientX >= left + width - RESIZE_HANDLE_WIDTH - THRESHOLD;

  if (isOverResize) {
    event.preventDefault();

    return;
  }

  if (event.dataTransfer) {
    const id = event.currentTarget.getAttribute("data-column-id");
    if (!id) return;

    event.dataTransfer.effectAllowed = "move";
    event.dataTransfer.setData("text", id);
    event.currentTarget.style.opacity = "var(--table-header-drag-opacity)";
  }
}

function handleDragEnd(event: React.DragEvent<HTMLElement>) {
  event.preventDefault();
  event.currentTarget.style.opacity = "1";
}

function handleDragEnter(event: React.DragEvent<HTMLElement>) {
  event.currentTarget.style.background = "var(--table-header-drag-bg)";
}

function handleDragLeave(event: React.DragEvent<HTMLElement>) {
  if (event.relatedTarget && !event.currentTarget.contains(event.relatedTarget as Node))
    event.currentTarget.style.background = "";
}

function handleDropGetter(
  columnOrderState: ColumnOrderState,
  setColumnOrderState: (updater: Updater<ColumnOrderState>) => void,
) {
  return function handleDrop(event: React.DragEvent<HTMLElement>) {
    event.preventDefault();
    event.currentTarget.style.background = "";
    const draggableId = event.dataTransfer?.getData?.("text");
    const droppableId = event.currentTarget.getAttribute("data-column-id");

    if (draggableId == undefined || droppableId == undefined || draggableId === droppableId) return;

    let draggableIndex: number = -1;
    let droppableIndex: number = -1;
    for (let i = 0; i <= columnOrderState.length; i++) {
      const id = columnOrderState[i];
      if (draggableId === id) {
        draggableIndex = i;
      }
      if (droppableId === id) {
        droppableIndex = i;
      }

      if (~draggableIndex && ~droppableIndex) break;
    }

    if (!~draggableIndex || !~droppableIndex) return;

    const order = [...columnOrderState];
    [order[+draggableIndex], order[+droppableIndex]] = [
      order[+droppableIndex],
      order[+draggableIndex],
    ];
    setColumnOrderState(order);
  };
}
