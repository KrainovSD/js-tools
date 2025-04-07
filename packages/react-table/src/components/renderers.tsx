import { MinusOutlined, PlusOutlined } from "@krainovsd/react-icons";
import type { CellContext } from "@tanstack/react-table";
import styles from "./renderers.module.scss";

export function Expander<Row extends Record<string, unknown>>(props: {
  context: CellContext<Row, unknown>;
}) {
  const isExpanded = props.context.row.getIsExpanded();

  return (
    <button
      onClick={(event) => {
        event.stopPropagation();
        props.context.row.toggleExpanded(!isExpanded);
      }}
      className={styles.expander__button}
    >
      {isExpanded && <MinusOutlined size={16} />}
      {!isExpanded && <PlusOutlined size={16} />}
    </button>
  );
}
