import type { HeaderContext } from "@tanstack/react-table";
import styles from "./header-renders.module.scss";

export function CommonHeaderRender<Row extends Record<string, unknown>>(props: {
  context: HeaderContext<Row, unknown>;
}) {
  return (
    <div className={styles.common__container}>
      <span className={styles.common__base}>{props.context.column.columnDef.name}</span>
    </div>
  );
}
