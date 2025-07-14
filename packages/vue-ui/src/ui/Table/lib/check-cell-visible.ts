import type { CellContext, DefaultRow } from "../types";

export function checkCellVisible<Row extends DefaultRow>(context: CellContext<Row>) {
  const isGroupChildrenRow = context.column.getIsGrouped() && !context.row.getIsGrouped();
  const isGroupRow = context.row.getIsGrouped();

  if (isGroupRow && context.row.groupingColumnId !== context.column.id) return false;
  if (isGroupChildrenRow) return false;

  return true;
}
