import type { HeaderContext } from "@tanstack/react-table";
import styles from "./header-renders.module.scss";

export function CommonHeaderRender<Row extends Record<string, unknown>>(props: {
  context: HeaderContext<Row, unknown>;
}) {
  const SortRender = props.context.column.columnDef.sortRender;
  const canSort = props.context.column.getCanSort();

  return (
    <div className={styles.common__container}>
      <span className={styles.common__base}>{props.context.column.columnDef.name}</span>
      {canSort && SortRender && <SortRender context={props.context} />}
    </div>
  );
}
