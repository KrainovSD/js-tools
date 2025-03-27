import { ArrowUpFill } from "@krainovsd/react-icons";
import type { HeaderContext } from "@tanstack/react-table";
import clsx from "clsx";
import styles from "./sort-renders.module.scss";

export function SingleArrowSortRender<Row extends Record<string, unknown>>(
  props: HeaderContext<Row, unknown>,
) {
  const sortIndex = props.column.getSortIndex();
  const direction = props.column.getIsSorted();
  const firstDirection = props.column.getFirstSortDir();

  function onSort() {
    if (!direction) {
      props.column.toggleSorting(firstDirection === "desc", true);
    } else if (direction !== firstDirection) {
      props.column.clearSorting();
    } else {
      props.column.toggleSorting(direction === "asc", true);
    }
  }

  return (
    <button
      className={clsx(styles.singleArrow__button, direction && styles.singleArrow__button_active)}
      onClick={onSort}
    >
      <span className={styles.singleArrow__index}>{!!~sortIndex && sortIndex + 1}</span>
      <ArrowUpFill
        className={clsx(
          styles.singleArrow__icon,
          firstDirection === "asc" && styles.singleArrow__icon_asc,
          firstDirection === "desc" && styles.singleArrow__icon_desc,
          direction === "asc" && styles.singleArrow__icon_asc,
          direction === "desc" && styles.singleArrow__icon_desc,
        )}
      />
    </button>
  );
}

export function DoubleArrowSortRender<Row extends Record<string, unknown>>(
  props: HeaderContext<Row, unknown>,
) {
  return props.column.id;
}
