import type { CellContext } from "@tanstack/react-table";
import type { DefaultRow } from "../../../types";

function checkVisible<Row extends DefaultRow>(props: CellContext<Row, unknown>) {
  const isGroupChildrenRow = props.column.getIsGrouped() && !props.row.getIsGrouped();
  const isGroupRow = props.row.getIsGrouped();

  if (isGroupRow && props.row.groupingColumnId !== props.column.id) return false;
  if (isGroupChildrenRow) return false;

  return true;
}

export function useVisibleCell<Row extends DefaultRow>(props: CellContext<Row, unknown>) {
  const isVisible = checkVisible(props);
  const level = props.row.getParentRows().reduce((acc: number, row) => {
    if (row.getIsExpanded() && !row.getIsGrouped()) acc++;

    return acc;
  }, 0);

  return { isVisible, level };
}
