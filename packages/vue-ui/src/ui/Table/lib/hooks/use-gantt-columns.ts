import { type ComputedRef, computed } from "vue";
import type {
  DefaultRow,
  GanttDate,
  GanttDateInfo,
  GanttHeaderInfo,
  GanttInfo,
  GanttViewType,
  RowInterface,
} from "../../types";

export type UseGanttColumnOptions<RowData extends DefaultRow> = {
  ganttIntervalDate: ComputedRef<GanttDate | undefined>;
  rows: ComputedRef<RowInterface<GanttInfo<RowData>>[]>;
  ganttView: ComputedRef<GanttViewType>;
};

export function useGanttColumn<RowData extends DefaultRow>(opts: UseGanttColumnOptions<RowData>) {
  const ganttIntervalDate = computed<GanttDate>(() => {
    if (opts.ganttIntervalDate.value) return opts.ganttIntervalDate.value;

    let start = new Date();
    let end = new Date();

    function recursiveCheckDate(rows: RowInterface<GanttInfo<RowData>>[]) {
      const rowsLength = rows.length;

      for (let i = 0; i < rowsLength; i++) {
        const row = rows[i];
        if (row.subRows) {
          recursiveCheckDate(row.subRows);
        }

        const rowStart = new Date(row.original.start);
        const rowEnd = new Date(row.original.end);
        if (rowStart < start) start = rowStart;
        if (rowEnd > end) end = rowEnd;
      }
    }

    recursiveCheckDate(opts.rows.value);

    return [start.getTime(), end.getTime()];
  });

  const headerInfoItems = computed<GanttHeaderInfo[]>(() => {
    const startDate = new Date(ganttIntervalDate.value[0]);
    const endDate = new Date(ganttIntervalDate.value[1]);
    const startDateInfo: GanttDateInfo = {
      day: startDate.getDate(),
      month: startDate.getMonth(),
      year: startDate.getFullYear(),
    };
    const endDateInfo: GanttDateInfo = {
      day: endDate.getDate(),
      month: endDate.getMonth(),
      year: endDate.getFullYear(),
    };
    if (
      Number.isNaN(startDateInfo.day) ||
      Number.isNaN(startDateInfo.month) ||
      Number.isNaN(startDateInfo.year) ||
      Number.isNaN(endDateInfo.day) ||
      Number.isNaN(endDateInfo.month) ||
      Number.isNaN(endDateInfo.year)
    ) {
      return [];
    }

    const headerInfoItems: GanttHeaderInfo[] = [];
    for (let i = startDateInfo.year; i <= endDateInfo.year; i++) {
      const startMonth = startDateInfo.year === i ? startDateInfo.month : 0;
      const endMonth = endDateInfo.year === i ? endDateInfo.month : 11;
      const diff = endMonth - startMonth;
      const months: number[] = [];

      for (let j = 0; j <= diff; j++) {
        months.push(startMonth + j);
      }

      headerInfoItems.push({ year: i, months });
    }

    switch (opts.ganttView.value) {
      case "weeks": {
        break;
      }
      case "months":
      case "quarters": {
        /** Insert prev month before start or last month of prev year */
        if (headerInfoItems[0]?.months[0] > 0) {
          headerInfoItems[0].months.unshift(headerInfoItems[0].months[0] - 1);
        } else {
          headerInfoItems.unshift({ year: headerInfoItems[0].year - 1, months: [11] });
        }

        /** Insert next month after end of first month of next year */
        const lastIndex = headerInfoItems.length - 1;
        const lastMonthIndex = headerInfoItems[lastIndex].months.length - 1;
        if (headerInfoItems[lastIndex].months[lastMonthIndex] < 11) {
          headerInfoItems[lastIndex].months.push(
            headerInfoItems[lastIndex].months[lastMonthIndex] + 1,
          );
        } else {
          headerInfoItems.push({ year: headerInfoItems[lastIndex].year + 1, months: [0] });
        }

        break;
      }
      case "years": {
        /** Insert prev and next year */
        const fullOfYear = Array.from({ length: 12 }, (_, i) => i);
        headerInfoItems.unshift({
          year: headerInfoItems[0].year - 1,
          months: fullOfYear,
        });
        headerInfoItems.push({
          year: headerInfoItems[headerInfoItems.length - 1].year + 1,
          months: fullOfYear,
        });
        break;
      }
      default: {
        break;
      }
    }

    return headerInfoItems;
  });

  const columnsCount = computed(() => {
    switch (opts.ganttView.value) {
      case "weeks": {
        return (
          headerInfoItems.value.reduce((acc, item) => {
            acc += item.months.length;

            return acc;
          }, 0) * 4
        );
      }
      case "quarters":
      case "months": {
        return headerInfoItems.value.reduce((acc, item) => {
          acc += item.months.length;

          return acc;
        }, 0);
      }

      case "years": {
        return headerInfoItems.value.length;
      }

      default: {
        return 0;
      }
    }
  });

  return { headerInfoItems, columnsCount };
}
