import { ArrowUpFill } from "@krainovsd/react-icons";
import type { CellContext } from "@tanstack/react-table";
import clsx from "clsx";
import styles from "./renderers.module.scss";

export function Expander<Row extends Record<string, unknown>>(props: CellContext<Row, unknown>) {
  const isExpanded = props.row.getIsExpanded();

  return (
    <button
      className={styles.expander__button}
      onClick={(event) => {
        event.stopPropagation();
        props.row.toggleExpanded(!isExpanded);
      }}
      onDoubleClick={(event) => event.stopPropagation()}
    >
      <ArrowUpFill
        className={clsx(styles.expander__icon, isExpanded && styles.expander__icon_open)}
      />
    </button>
  );
}
