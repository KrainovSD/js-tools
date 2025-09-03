import type { VirtualItem } from "@tanstack/react-virtual";
import React from "react";
import { GANTT_ROW_HEIGHT, GANTT_ROW_HEIGHT_MINI } from "../../table.constants";
import type {
  DefaultGanttData,
  DefaultRow,
  GanttArrowInfo,
  GanttArrowStyleGetter,
  GanttInfo,
  GanttRowInfo,
  RowInterface,
} from "../../types";

type UseArrowInfoOptions<RowData extends DefaultRow, GanttData extends DefaultGanttData> = {
  ganttArrowStyleGetter: GanttArrowStyleGetter<GanttData> | undefined;
  ganttInfoGetter: ((row: RowInterface<RowData>) => GanttInfo<GanttData>) | undefined;
  rowsMap: Record<string | number, GanttRowInfo | undefined>;
  rows: RowInterface<RowData>[];
  mini: boolean;
  rowVirtualEnabled: boolean;
  rowsVirtual: VirtualItem[];
  ganttVisibleArrowInRange: boolean;
  ganttArrowGetAround: boolean;
};

const TOP_SHIFT_MAX = -1;
const TOP_SHIFT_MINI = -2;

const DEFAULT_LINK_SIZE = 2;
const DEFAULT_CORNER_SIZE = 4;
const DEFAULT_ARROW_SIZE = 16;

const LEFT_TO_RIGHT_FIRST = 22;
const TOP_TO_BOTTOM_EXTRA_MAX = 25;
const TOP_TO_BOTTOM_EXTRA_MINI = 13;

const LEFT_TO_RIGHT_SECOND_DEFAULT = 22;

const END_ARROW_SHIFT = -8;
const TOP_ARROW_SHIFT = 1;

export function useArrowInfo<RowData extends DefaultRow, GanttData extends DefaultGanttData>(
  opts: UseArrowInfoOptions<RowData, GanttData>,
) {
  const TOP_SHIFT = opts.mini ? TOP_SHIFT_MINI : TOP_SHIFT_MAX;
  const ROW_HEIGHT = opts.mini ? GANTT_ROW_HEIGHT_MINI : GANTT_ROW_HEIGHT;
  const minRowIndex = !opts.rowVirtualEnabled ? 0 : (opts.rowsVirtual[0]?.index ?? 0);
  const maxRowIndex = !opts.rowVirtualEnabled
    ? opts.rows.length - 1
    : (opts.rowsVirtual[opts.rowsVirtual.length - 1]?.index ?? 0);

  const arrowInfo = React.useMemo(() => {
    const arrowInfo: GanttArrowInfo[] = [];

    for (let i = 0; i < opts.rows.length; i++) {
      const row = opts.rows[i];
      const ganttInfo = opts.ganttInfoGetter?.(row);
      if (ganttInfo?.dependents == undefined || ganttInfo.dependents.length === 0) continue;
      const rowInfo = opts.rowsMap[ganttInfo.id];
      if (!rowInfo) continue;

      const startTop = rowInfo.top + TOP_SHIFT;
      const startLeft = rowInfo.left + rowInfo.width - 2;
      const { color, size = DEFAULT_LINK_SIZE } = opts.ganttArrowStyleGetter?.(ganttInfo) ?? {};

      for (let j = 0; j < ganttInfo.dependents.length; j++) {
        const dependId = ganttInfo.dependents[j];
        const dependRowInfo = opts.rowsMap[dependId];
        if (!dependRowInfo) continue;
        const indexDiff = dependRowInfo.index - rowInfo.index;
        if (indexDiff === 0) continue;

        let minDependsLeft = dependRowInfo.left;
        if (opts.ganttArrowGetAround) {
          for (
            let m = rowInfo.index;
            indexDiff > 0 ? m < dependRowInfo.index : m > dependRowInfo.index;
            indexDiff > 0 ? m++ : m--
          ) {
            const info = opts.rowsMap[opts.rows[m]?.id];

            // eslint-disable-next-line max-depth
            if (info && info.left < minDependsLeft) minDependsLeft = info.left;
          }
        }

        const fullFirstCorner =
          startLeft + LEFT_TO_RIGHT_FIRST + DEFAULT_CORNER_SIZE + LEFT_TO_RIGHT_SECOND_DEFAULT;
        const RIGHT_TO_LEFT = fullFirstCorner - minDependsLeft;
        const requireExtraCorner = minDependsLeft < fullFirstCorner;

        let TOP_TO_BOTTOM = Math.abs(indexDiff * ROW_HEIGHT) - DEFAULT_CORNER_SIZE * 2;
        const TOP_TO_BOTTOM_EXTRA = opts.mini ? TOP_TO_BOTTOM_EXTRA_MINI : TOP_TO_BOTTOM_EXTRA_MAX;
        if (requireExtraCorner) {
          TOP_TO_BOTTOM -= TOP_TO_BOTTOM_EXTRA + DEFAULT_CORNER_SIZE * 2;
        }

        let LEFT_TO_RIGHT_SECOND =
          dependRowInfo.left -
          startLeft -
          LEFT_TO_RIGHT_FIRST -
          DEFAULT_CORNER_SIZE * 2 +
          END_ARROW_SHIFT;
        if (requireExtraCorner) {
          LEFT_TO_RIGHT_SECOND =
            dependRowInfo.left -
            (startLeft + LEFT_TO_RIGHT_FIRST - RIGHT_TO_LEFT - DEFAULT_CORNER_SIZE) -
            DEFAULT_CORNER_SIZE +
            END_ARROW_SHIFT;
        }

        arrowInfo.push({
          linkId: `${ganttInfo.id}:${dependId}:${j}`,
          index: i,
          dependIndex: dependRowInfo.index,
          color,
          dependId,
          startLeft,
          startTop,
          arrowSize: DEFAULT_ARROW_SIZE,
          cornerSize: DEFAULT_CORNER_SIZE,
          direction: indexDiff > 0 ? "down" : "up",
          extraCorner: requireExtraCorner,
          leftToRightFirst: LEFT_TO_RIGHT_FIRST,
          leftToRightSecond: LEFT_TO_RIGHT_SECOND,
          rightToLeft: RIGHT_TO_LEFT,
          rowId: ganttInfo.id,
          size,
          topArrowShift: TOP_ARROW_SHIFT,
          topToBottom: TOP_TO_BOTTOM,
          topToBottomExtra: TOP_TO_BOTTOM_EXTRA,
        });
      }
    }

    return arrowInfo;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    opts.ganttArrowGetAround,
    opts.rows,
    opts.rowsMap,
    opts.ganttArrowStyleGetter,
    opts.ganttInfoGetter,
    opts.mini,
    TOP_SHIFT,
    ROW_HEIGHT,
  ]);
  const filteredArrowInfo = React.useMemo(() => {
    return arrowInfo.filter((arrow) => {
      if (
        (opts.ganttVisibleArrowInRange &&
          ((arrow.index < minRowIndex && arrow.dependIndex < minRowIndex) ||
            (arrow.index > maxRowIndex && arrow.dependIndex > maxRowIndex))) ||
        (!opts.ganttVisibleArrowInRange && (arrow.index < minRowIndex || arrow.index > maxRowIndex))
      )
        return false;

      return true;
    });
  }, [arrowInfo, minRowIndex, maxRowIndex, opts.ganttVisibleArrowInRange]);

  return filteredArrowInfo;
}
