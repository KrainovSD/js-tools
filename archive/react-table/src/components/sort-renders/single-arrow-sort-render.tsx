import { ArrowUpFillLegacy } from "@krainovsd/react-icons";
import clsx from "clsx";
import type { DefaultRow, HeaderContext } from "../../types";
import styles from "./single-arrow-sort-render.module.scss";

export function SingleArrowSortRender<Row extends DefaultRow>(props: {
  context: HeaderContext<Row>;
}) {
  const sortIndex = props.context.column.getSortIndex();
  const direction = props.context.column.getIsSorted();
  const firstDirection = props.context.column.getFirstSortDir();

  function onSort() {
    if (!direction) {
      props.context.column.toggleSorting(firstDirection === "desc", true);
    } else if (direction !== firstDirection) {
      props.context.column.clearSorting();
    } else {
      props.context.column.toggleSorting(direction === "asc", true);
    }
  }

  return (
    <button className={clsx(styles.button, direction && styles.button_active)} onClick={onSort}>
      <span className={styles.index}>{!!~sortIndex && sortIndex + 1}</span>
      <ArrowUpFillLegacy
        className={clsx(
          styles.icon,
          firstDirection === "asc" && styles.icon_asc,
          firstDirection === "desc" && styles.icon_desc,
          direction === "asc" && styles.icon_asc,
          direction === "desc" && styles.icon_desc,
        )}
      />
    </button>
  );
}
