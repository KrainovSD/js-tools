import type { ColumnOrderState, Header, Updater } from "@tanstack/react-table";
import clsx from "clsx";
import { getPrevFrozenWidthHeader } from "./lib";
import styles from "./table-header-cell.module.scss";

type Props<RowData extends Record<string, unknown>> = {
  header: Header<RowData, unknown>;
  index: number;
  headers: Header<RowData, unknown>[];
  left?: number;
  table?: boolean;
};

const RESIZE_HANDLE_WIDTH = 10;
const THRESHOLD = 2;

function handleDragStart(event: React.DragEvent<HTMLElement>) {
  const { left, width } = event.currentTarget.getBoundingClientRect();
  const isOverResize = event.clientX >= left + width - RESIZE_HANDLE_WIDTH - THRESHOLD;

  if (isOverResize) {
    event.preventDefault();

    return;
  }

  if (event.dataTransfer) {
    const index = event.currentTarget.getAttribute("data-column-index");
    if (!index) return;

    event.dataTransfer.effectAllowed = "move";
    event.dataTransfer.setData("text", index);
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
    const draggableIndex = event.dataTransfer?.getData?.("text");
    const droppableIndex = event.currentTarget.getAttribute("data-column-index");

    if (
      draggableIndex == undefined ||
      droppableIndex == undefined ||
      draggableIndex === droppableIndex
    )
      return;

    const order = [...columnOrderState];
    [order[+draggableIndex], order[+droppableIndex]] = [
      order[+droppableIndex],
      order[+draggableIndex],
    ];
    setColumnOrderState(order);
  };
}

export function TableHeaderCell<RowData extends Record<string, unknown>>(props: Props<RowData>) {
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
  const draggable = props.header.column.columnDef.enableDraggable;

  if (!HeaderRender) return null;

  if (props.table) {
    return (
      <th
        data-id="header-cell"
        data-column-index={props.index}
        key={props.header.id}
        colSpan={props.header.colSpan}
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
          width: props.header.getSize(),
          maxWidth: props.header.getSize(),
          minWidth: props.header.getSize(),
          left: frozenPosition === "left" ? prevFrozen : (props.left ?? 0),
          right: frozenPosition === "right" ? prevFrozen : 0,
          cursor: draggable ? "move" : "inherit",
          position: props.left ? "absolute" : undefined,
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
      </th>
    );
  }

  return (
    <div
      data-id="header-cell"
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
        width: props.header.column.getSize(),
        maxWidth: props.header.column.getSize(),
        minWidth: props.header.column.getSize(),
        left: frozenPosition === "left" ? prevFrozen : 0,
        right: frozenPosition === "right" ? prevFrozen : 0,
      }}
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
}
