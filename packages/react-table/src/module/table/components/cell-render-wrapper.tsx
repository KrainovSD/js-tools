import clsx from "clsx";
import type { CellContext, ColumnDef, DefaultRow } from "../../../types";

export type CellRenderWrapperProps<RowData extends DefaultRow> = {
  className?: string;
  level: number;
  context: CellContext<RowData>;
  column: ColumnDef<RowData>;
  onClick?: (event: React.MouseEvent) => void;
  onDoubleClick?: (event: React.MouseEvent) => void;
};

export function CellRenderWrapper<RowData extends DefaultRow>(
  props: React.PropsWithChildren<CellRenderWrapperProps<RowData>>,
) {
  return (
    // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions
    <div
      className={clsx(
        "ksd-table-cell-container",
        props.className,
        typeof props.column?.className === "function"
          ? props.column.className(props.context)
          : props.column?.className,
      )}
      style={{
        paddingLeft:
          props.column.expandedShift != undefined
            ? props.column.expandedShift * props.level
            : undefined,
      }}
      onClick={props.onClick}
      onDoubleClick={props.onDoubleClick}
    >
      {props.children}
    </div>
  );
}
