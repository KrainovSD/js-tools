import { computed } from "vue";
import type { CellContext, DefaultRow } from "../../types";

function checkVisible<Row extends DefaultRow>(props: CellContext<Row>) {
  const isGroupChildrenRow = props.column.getIsGrouped() && !props.row.getIsGrouped();
  const isGroupRow = props.row.getIsGrouped();

  if (isGroupRow && props.row.groupingColumnId !== props.column.id) return false;
  if (isGroupChildrenRow) return false;

  return true;
}

export function useVisibleCell<Row extends DefaultRow>(props: CellContext<Row>) {
  const isVisible = computed(() => checkVisible(props));
  const level = computed(() =>
    props.row.getParentRows().reduce((acc: number, row) => {
      if (row.getIsExpanded() && !row.getIsGrouped()) acc++;

      return acc;
    }, 0),
  );

  return { isVisible, level };
}
