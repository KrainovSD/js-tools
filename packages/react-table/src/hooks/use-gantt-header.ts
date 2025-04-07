import React from "react";
import type { GanttDate, GanttInfo, RowInterface } from "../types";

type UseGanttHeaderProps<RowData extends Record<string, unknown>> = {
  firstGanttDate?: string;
  lastGanttDate?: string;
  ganttInfoGetter?: (row: RowInterface<RowData>) => GanttInfo;
  rows: RowInterface<RowData>[];
};

type HeaderItem = {
  main: number;
  inner: number[];
};

export function useGanttHeader<RowData extends Record<string, unknown>>(
  props: UseGanttHeaderProps<RowData>,
) {
  const firstGanttDate = React.useMemo<GanttDate | null>(() => {
    const firstDate = props.firstGanttDate ?? props.ganttInfoGetter?.(props.rows[0])?.start;
    if (!firstDate) return null;

    const correctDate = new Date(firstDate);
    const firstGanttDate: GanttDate = {
      day: correctDate.getDate(),
      month: correctDate.getMonth(),
      year: correctDate.getFullYear(),
    };
    if (
      Number.isNaN(firstGanttDate.year) ||
      Number.isNaN(firstGanttDate.month) ||
      Number.isNaN(firstGanttDate.year)
    )
      return null;

    return firstGanttDate;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.firstGanttDate, props.rows, props.ganttInfoGetter]);
  const lastGanttDate = React.useMemo<GanttDate | null>(() => {
    const lastDate = props.lastGanttDate ?? props.ganttInfoGetter?.(props.rows[0])?.end;
    if (!lastDate) return null;

    const correctDate = new Date(lastDate);
    const lastGanttDate: GanttDate = {
      day: correctDate.getDate(),
      month: correctDate.getMonth(),
      year: correctDate.getFullYear(),
    };
    if (
      Number.isNaN(lastGanttDate.year) ||
      Number.isNaN(lastGanttDate.month) ||
      Number.isNaN(lastGanttDate.year)
    )
      return null;

    return lastGanttDate;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.lastGanttDate, props.rows, props.ganttInfoGetter]);
  const headerItems = React.useMemo(() => {
    if (!firstGanttDate || !lastGanttDate || firstGanttDate.year > lastGanttDate.year) return null;

    const items: HeaderItem[] = [];

    for (let i = firstGanttDate.year; i <= lastGanttDate.year; i++) {
      const startMonth = firstGanttDate.year === i ? firstGanttDate.month : 0;
      const endMonth = lastGanttDate.year === i ? lastGanttDate.month : 11;
      const diff = endMonth - startMonth;
      const inner: number[] = [];

      for (let j = 0; j <= diff; j++) {
        inner.push(startMonth + j);
      }

      items.push({ main: i, inner });
    }

    if (items[0].inner[0] > 0) {
      items[0].inner.unshift(items[0].inner[0] - 1);
    } else {
      items.unshift({ main: items[0].main - 1, inner: [11] });
    }

    const itemsLastIndex = items.length - 1;
    if (items[itemsLastIndex].inner[items[itemsLastIndex].inner.length - 1] < 11) {
      items[itemsLastIndex].inner.push(
        items[itemsLastIndex].inner[items[itemsLastIndex].inner.length - 1] + 1,
      );
    } else {
      items.push({ main: items[itemsLastIndex].main + 1, inner: [0] });
    }

    return items;
  }, [firstGanttDate, lastGanttDate]);

  console.log(firstGanttDate, lastGanttDate, headerItems);

  return headerItems;
}
