import clsx from "clsx";
import type { CellContext, ColumnDef, DefaultRow } from "../../../types";

export type CellRenderWrapperProps<RowData extends DefaultRow> = {
  className?: string;
  level: number;
  context: CellContext<RowData>;
  column: ColumnDef<RowData>;
} & React.HTMLAttributes<HTMLDivElement>;

export function CellRenderWrapper<RowData extends DefaultRow>(
  props: React.PropsWithChildren<CellRenderWrapperProps<RowData>>,
) {
  const { column, context, level, className, style, ...rest } = props;

  return (
    <div
      {...rest}
      className={clsx(
        "ksd-table-cell-container",
        className,
        typeof column?.className === "function" ? column.className(context) : column?.className,
      )}
      style={{
        paddingLeft:
          column.expandedShift != undefined && level > 0 ? column.expandedShift * level : undefined,
        ...style,
      }}
    >
      {props.children}
    </div>
  );
}
