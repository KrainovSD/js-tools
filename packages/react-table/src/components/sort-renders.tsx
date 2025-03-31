import { ArrowUpFillLegacy, CaretDownFilled, CaretUpFilled } from "@krainovsd/react-icons";
import { Flex } from "@krainovsd/react-ui";
import type { HeaderContext } from "@tanstack/react-table";
import clsx from "clsx";
import styles from "./sort-renders.module.scss";

export function SingleArrowSortRender<Row extends Record<string, unknown>>(props: {
  context: HeaderContext<Row, unknown>;
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
    <button
      className={clsx(styles.singleArrow__button, direction && styles.singleArrow__button_active)}
      onClick={onSort}
    >
      <span className={styles.singleArrow__index}>{!!~sortIndex && sortIndex + 1}</span>
      <ArrowUpFillLegacy
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

export function DoubleArrowSortRender<Row extends Record<string, unknown>>(props: {
  context: HeaderContext<Row, unknown>;
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
    <button className={clsx(styles.doubleArrow__button)} onClick={onSort}>
      <span
        className={clsx(styles.doubleArrow__index, direction && styles.doubleArrow__index_active)}
      >
        {!!~sortIndex && sortIndex + 1}
      </span>
      <Flex vertical gap={-2} className={styles.doubleArrow__iconContainer}>
        <CaretUpFilled
          className={clsx(
            styles.doubleArrow__icon,
            styles.doubleArrow__icon_asc,
            direction === "asc" && styles.doubleArrow__icon_active,
          )}
          color="inherit"
          size={12}
        />
        <CaretDownFilled
          className={clsx(
            styles.doubleArrow__icon,
            styles.doubleArrow__icon_desc,
            direction === "desc" && styles.doubleArrow__icon_active,
          )}
          color="inherit"
          size={12}
        />
      </Flex>
    </button>
  );
}
