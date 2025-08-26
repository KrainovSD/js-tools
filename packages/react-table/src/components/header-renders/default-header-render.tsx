import type { DefaultRow, HeaderRenderProps } from "../../types";
import styles from "./default-header-render.module.scss";

export function DefaultHeaderRender<RowData extends DefaultRow>(props: HeaderRenderProps<RowData>) {
  const SortRender = props.context.column.columnDef.sortRender;
  const canSort = props.context.column.getCanSort();

  return (
    <div className="ksd-table-header-cell-container">
      <span className={styles.text}>{props.context.column.columnDef.name}</span>
      {canSort && SortRender && (
        <SortRender
          context={props.context}
          settings={props.context.column.columnDef.sortRenderProps}
        />
      )}
    </div>
  );
}
