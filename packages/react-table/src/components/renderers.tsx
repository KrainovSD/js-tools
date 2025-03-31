import { ArrowUpFillLegacy } from "@krainovsd/react-icons";
import type { CellContext } from "@tanstack/react-table";
import clsx from "clsx";
import styles from "./renderers.module.scss";

export function Expander<Row extends Record<string, unknown>>(props: {
  context: CellContext<Row, unknown>;
}) {
  const isExpanded = props.context.row.getIsExpanded();

  return (
    <button
      className={styles.expander__button}
      onClick={(event) => {
        event.stopPropagation();
        props.context.row.toggleExpanded(!isExpanded);
      }}
      onDoubleClick={(event) => event.stopPropagation()}
    >
      <ArrowUpFillLegacy
        className={clsx(styles.expander__icon, isExpanded && styles.expander__icon_open)}
      />
    </button>
  );
}
