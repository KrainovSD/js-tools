import type { Cell } from "@tanstack/react-table";
import clsx from "clsx";
import React from "react";
import type { DefaultRow } from "../../types";
import { getPrevFrozenWidthCell } from "./lib";
import styles from "./table-cell.module.scss";

type Props<RowData extends DefaultRow> = {
  cell: Cell<RowData, unknown>;
  index: number;
  columnPosition: number;
  cells: Cell<RowData, unknown>[];
  virtualLeft?: number;
  selected: boolean;
  expanded: boolean;
};

export const TableCell = React.memo(function TableCell<RowData extends DefaultRow>(
  props: Props<RowData>,
) {
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

  return (
    <div
      role="cell"
      data-id="cell"
      data-column-id={props.cell.id}
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
        left: frozenPosition === "left" ? prevFrozen : undefined,
        right: frozenPosition === "right" ? prevFrozen : undefined,
        gridColumnStart: props.columnPosition,
      }}
    >
      {isGroupCell && Expander && <Expander context={cellContext} />}
      {CellRender && <CellRender context={cellContext} />}
    </div>
  );
}) as <RowData extends DefaultRow>(props: Props<RowData>) => React.JSX.Element;
