import type { HeaderContext } from "@tanstack/react-table";
import styles from "./header-renders.module.scss";

export function CommonHeaderRender<Row extends Record<string, unknown>>(
  props: HeaderContext<Row, unknown>,
) {
  return (
    <div className={styles.common__container}>
      <span className={styles.common__base}>{props.column.columnDef.name}</span>
    </div>
  );
}
