import React from "react";
import type {
  DefaultGanttData,
  DefaultRow,
  GanttDate,
  GanttInfo,
  GanttViewType,
  RowInterface,
} from "../../types";

type UseGanttColumnsProps<RowData extends DefaultRow, GanttData extends DefaultGanttData> = {
  firstGanttDate?: string;
  lastGanttDate?: string;
  ganttInfoGetter?: (row: RowInterface<RowData>) => GanttInfo<GanttData>;
  rows: RowInterface<RowData>[];
  ganttView: GanttViewType;
};

export type HeaderItem = {
  year: number;
  months: number[];
};

export function useGanttColumns<RowData extends DefaultRow, GanttData extends DefaultGanttData>(
  props: UseGanttColumnsProps<RowData, GanttData>,
) {
  const firstGanttDate = React.useMemo<GanttDate | null>(() => {
    if (props.rows.length === 0) return null;
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
    if (props.rows.length === 0) return null;
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
    if (!firstGanttDate || !lastGanttDate || firstGanttDate.year > lastGanttDate.year) return [];

    const items: HeaderItem[] = [];

    for (let i = firstGanttDate.year; i <= lastGanttDate.year; i++) {
      const startMonth = firstGanttDate.year === i ? firstGanttDate.month : 0;
      const endMonth = lastGanttDate.year === i ? lastGanttDate.month : 11;
      const diff = endMonth - startMonth;
      const months: number[] = [];

      for (let j = 0; j <= diff; j++) {
        months.push(startMonth + j);
      }

      items.push({ year: i, months });
    }

    switch (props.ganttView) {
      case "years": {
        items.unshift({ year: items[0].year - 1, months: Array.from({ length: 12 }, (_, i) => i) });
        items.push({
          year: items[items.length - 1].year + 1,
          months: Array.from({ length: 12 }, (_, i) => i),
        });
        break;
      }
      case "quarters":
      case "months": {
        if (items[0].months[0] > 0) {
          items[0].months.unshift(items[0].months[0] - 1);
        } else {
          items.unshift({ year: items[0].year - 1, months: [11] });
        }

        const itemsLastIndex = items.length - 1;
        if (items[itemsLastIndex].months[items[itemsLastIndex].months.length - 1] < 11) {
          items[itemsLastIndex].months.push(
            items[itemsLastIndex].months[items[itemsLastIndex].months.length - 1] + 1,
          );
        } else {
          items.push({ year: items[itemsLastIndex].year + 1, months: [0] });
        }
        break;
      }
      case "weeks": {
        break;
      }
      default: {
        break;
      }
    }

    return items;
  }, [firstGanttDate, lastGanttDate, props.ganttView]);
  const columnsCount = React.useMemo(() => {
    if (!headerItems) return 0;

    switch (props.ganttView) {
      case "years": {
        return headerItems.length;
      }
      case "quarters":
      case "months": {
        return headerItems.reduce((acc, item) => {
          acc += item.months.length;

          return acc;
        }, 0);
      }

      case "weeks": {
        return (
          headerItems.reduce((acc, item) => {
            acc += item.months.length;

            return acc;
          }, 0) * 4
        );
      }
      default: {
        return 0;
      }
    }
  }, [headerItems, props.ganttView]);

  return { headerItems, columnsCount };
}
