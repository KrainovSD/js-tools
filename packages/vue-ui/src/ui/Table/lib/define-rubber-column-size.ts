import type { ColumnSizingState, HeaderGroup } from "@tanstack/vue-table";
import type { ColumnSizingSettings, DefaultRow } from "../types";

type DefineRubberColumnSizeOptions<RowData extends DefaultRow> = {
  table: HTMLElement | null;
  visibleHeadersGroup: HeaderGroup<RowData>[];
  setColumnSizing: (state: ColumnSizingState) => void;
};

export function defineRubberColumnSize<RowData extends DefaultRow>(
  opts: DefineRubberColumnSizeOptions<RowData>,
) {
  if (!opts.table) return;

  const tableWidth = opts.table.getBoundingClientRect().width;
  const visibleHeaders = opts.visibleHeadersGroup?.[0]?.headers ?? [];

  const columnSizing: ColumnSizingState = {};
  const columnSizingSettings: ColumnSizingSettings = {};
  let totalWidth = 0;
  let flexColumnCount = 0;

  for (let i = 0; i < visibleHeaders.length; i++) {
    const column = visibleHeaders[i].column;
    const size = column.columnDef.size;
    const maxSize = column.columnDef.maxSize;
    const minSize = column.columnDef.minSize;

    const width = column.getSize();
    const id = column.id;

    if (size === 0) {
      flexColumnCount += 1;
    } else {
      totalWidth += width;
    }
    columnSizing[id] = size === 0 ? 0 : width;
    columnSizingSettings[id] = {
      maxSize,
      minSize,
    };
  }

  if (flexColumnCount === 0) return;

  let hasConflictSize = true;
  /** Processing max size less then flex size and min size greater than flex size  */
  while (hasConflictSize) {
    hasConflictSize = false;
    let flexColumnSize = (tableWidth - totalWidth) / flexColumnCount;

    for (const [key, value] of Object.entries(columnSizing)) {
      if (value === 0) {
        const maxSize = columnSizingSettings[key].maxSize;

        if (maxSize != undefined && maxSize < flexColumnSize) {
          columnSizing[key] = maxSize;
          totalWidth += maxSize;
          flexColumnCount -= 1;
          hasConflictSize = true;
          continue;
        }
      }
    }

    flexColumnSize = (tableWidth - totalWidth) / flexColumnCount;

    for (const [key, value] of Object.entries(columnSizing)) {
      if (value === 0) {
        const minSize = columnSizingSettings[key].minSize;

        if (minSize != undefined && minSize > flexColumnSize) {
          columnSizing[key] = minSize;
          totalWidth += minSize;
          flexColumnCount -= 1;
          hasConflictSize = true;
          continue;
        }
      }
    }
  }

  if (flexColumnCount === 0) {
    opts.setColumnSizing(columnSizing);

    return;
  }

  /** Processing flex size  */
  const flexColumnSize = (tableWidth - totalWidth) / flexColumnCount;
  for (const [key, value] of Object.entries(columnSizing)) {
    if (value === 0) {
      columnSizing[key] = flexColumnSize;
    }
  }

  opts.setColumnSizing(columnSizing);
}
