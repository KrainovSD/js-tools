import type { Cell } from "@tanstack/react-table";
import clsx from "clsx";
import { getPrevFrozenWidthCell } from "./lib";
import styles from "./table-cell.module.scss";

type Props<RowData extends Record<string, unknown>> = {
  cell: Cell<RowData, unknown>;
  index: number;
  cells: Cell<RowData, unknown>[];
  table?: boolean;
};

export function TableCell<RowData extends Record<string, unknown>>(props: Props<RowData>) {
  const cellContext = props.cell.getContext();
  const cellClass = props.cell.column.columnDef.cellClass;
  const cellClasses = cellClass.map((style) =>
    typeof style === "function" ? style(cellContext) : style,
  );
  const isGroupCell =
    props.cell.row.getIsGrouped() && props.cell.row.groupingColumnId === props.cell.column.id;
  const frozenPosition = props.cell.column.getIsPinned();
  const prevFrozen = getPrevFrozenWidthCell({
    frozenPosition,
    cells: props.cells,
    index: props.index,
  });
  const renderers = cellContext.table.options.meta?.renderers;
  const CellRender = props.cell.column.columnDef.cellRender;
  const Expander = renderers?.expander;

  if (!CellRender) return null;

  if (props.table) {
    return (
      <td
        data-id="cell"
        key={props.cell.id}
        className={clsx(
          styles.cell,
          frozenPosition === "left" && styles.cell__frozen_left,
          frozenPosition === "right" && styles.cell__frozen_right,
          frozenPosition === "left" &&
            props.cell.column.getIsLastColumn("left") &&
            styles.cell__frozen_left_last,
          frozenPosition === "right" &&
            props.cell.column.getIsFirstColumn("right") &&
            styles.cell__frozen_right_first,
          cellClasses,
        )}
        style={{
          width: props.cell.column.getSize(),
          maxWidth: props.cell.column.getSize(),
          minWidth: props.cell.column.getSize(),
          left: frozenPosition === "left" ? prevFrozen : 0,
          right: frozenPosition === "right" ? prevFrozen : 0,
        }}
      >
        {isGroupCell && Expander && <Expander context={cellContext} />}
        <CellRender context={cellContext} />
      </td>
    );
  }

  return (
    <div
      data-id="cell"
      key={props.cell.id}
      className={clsx(
        styles.cell,
        frozenPosition === "left" && styles.cell__frozen_left,
        frozenPosition === "right" && styles.cell__frozen_right,
        frozenPosition === "left" &&
          props.cell.column.getIsLastColumn("left") &&
          styles.cell__frozen_left_last,
        frozenPosition === "right" &&
          props.cell.column.getIsFirstColumn("right") &&
          styles.cell__frozen_right_first,
        cellClasses,
      )}
      style={{
        width: props.cell.column.getSize(),
        maxWidth: props.cell.column.getSize(),
        minWidth: props.cell.column.getSize(),
        left: frozenPosition === "left" ? prevFrozen : 0,
        right: frozenPosition === "right" ? prevFrozen : 0,
      }}
    >
      {isGroupCell && Expander && <Expander context={cellContext} />}
      <CellRender context={cellContext} />
    </div>
  );
}
