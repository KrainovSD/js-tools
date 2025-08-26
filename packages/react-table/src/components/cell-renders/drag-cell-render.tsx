import { DragOutlined } from "@krainovsd/react-icons";
import clsx from "clsx";
import { useVisibleCell } from "../../lib/hooks";
import type { CellRenderProps, DefaultRow } from "../../types";
import styles from "./drag-cell-render.module.scss";
import { CellRenderWrapper } from "./wrappers/cell-render-wrapper";

export type DragCellRenderProps<Row extends DefaultRow> = {
  dragCondition?: (row: Row, index: number) => boolean;
};

export function DragCellRender<Row extends DefaultRow>(props: CellRenderProps<Row>) {
  const column = props.context.column.columnDef;
  const cellRenderProps = (column.cellRenderProps as DragCellRenderProps<Row>) ?? {};
  const draggable =
    typeof cellRenderProps.dragCondition === "function"
      ? cellRenderProps.dragCondition(props.context.row.original, props.context.row.index)
      : true;

  const { isVisible, level } = useVisibleCell(props.context);

  if (!isVisible || level > 0) return;

  return (
    <CellRenderWrapper
      column={column}
      context={props.context}
      level={level}
      className={clsx(
        draggable && "ksd-table-drag-handle",
        draggable && styles.drag,
        !draggable && styles.forbidden,
      )}
      onClick={(event) => event.stopPropagation()}
      onDoubleClick={(event) => event.stopPropagation()}
    >
      <DragOutlined size={16} />
    </CellRenderWrapper>
  );
}
