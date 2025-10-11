import { CaretDownFilled, CaretUpFilled } from "@krainovsd/react-icons";
import { Flex } from "@krainovsd/react-ui";
import clsx from "clsx";
import type { DefaultRow, HeaderContext } from "../../types";
import styles from "./double-arrow-sort-render.module.scss";

export function DoubleArrowSortRender<Row extends DefaultRow>(props: {
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
    <button className={clsx(styles.button)} onClick={onSort}>
      <span className={clsx(styles.index, direction && styles.index_active)}>
        {!!~sortIndex && sortIndex + 1}
      </span>
      <Flex vertical gap={-2} className={styles.iconContainer}>
        <CaretUpFilled
          className={clsx(styles.icon, styles.icon_asc, direction === "asc" && styles.icon_active)}
          color="inherit"
          size={12}
        />
        <CaretDownFilled
          className={clsx(
            styles.icon,
            styles.icon_desc,
            direction === "desc" && styles.icon_active,
          )}
          color="inherit"
          size={12}
        />
      </Flex>
    </button>
  );
}
