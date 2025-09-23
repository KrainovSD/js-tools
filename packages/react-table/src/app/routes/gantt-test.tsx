/* eslint-disable no-console */
import type { ExpandedState, RowSelectionState } from "@tanstack/react-table";
import React from "react";
import { Table } from "../../table";
import type {
  GanttArrowStyleGetter,
  GanttTypeShapes,
  RowInterface,
  TableColumn,
} from "../../types";
import { COLUMNS_GANTT } from "../lib/gantt/columns";
import testRows from "../lib/gantt/test-rows.json";
import type { GanttMeta } from "../types/gantt";

export type GanttTask = {
  gpnid: string;
  name: string;
  id: number;
  type: GanttTypeShapes;
  start: string;
  end: string;
  children?: GanttTask[];
  errors?: string[];
  actual_start: string;
  actual_end: string;
  successors?: string[];
  critpath?: boolean;
  prophesy_start?: number | string;
  prophesy_end?: number | string;
  bush?: boolean;
  well?: boolean;
};

export function GanttTest() {
  const [expanded, setExpanded] = React.useState<ExpandedState>(true);
  const [rowSelection, setRowSelection] = React.useState<RowSelectionState>({});
  const [rows] = React.useState<GanttTask[]>(getRows());

  function onClick(row: RowInterface<GanttTask>) {
    console.log(row, "click");
  }
  function onDoubleClick(row: RowInterface<GanttTask>) {
    console.log(row, "dbClick");
  }

  const arrowStyleGetter: GanttArrowStyleGetter<GanttMeta> = (info) => {
    const end = new Date(info.end);

    if (end.getFullYear() > 2026) {
      return {
        color: "#e8e6e6",
        size: 2,
      };
    }

    return { color: "#a29a9a", size: 2 };
  };

  const { firstDate, lastDate } = React.useMemo(() => {
    let firstDate: Date | undefined;
    let lastDate: Date | undefined;
    const ids: Record<string, number> = {};

    function checkRows(children: GanttTask[]) {
      for (const row of children) {
        const currentStartDate = new Date(row.start);
        const currentEndDate = new Date(row.end);

        if (!firstDate || currentStartDate < firstDate) {
          firstDate = currentStartDate;
        }
        if (!lastDate || currentEndDate > lastDate) {
          lastDate = currentEndDate;
        }
        ids[row.id] ??= 0;
        ids[row.id]++;

        if (row.children && row.children.length > 0) checkRows(row.children);
      }
    }

    checkRows(rows);

    const duplicateIds = Object.entries(ids).filter(([, value]) => value !== 1);
    if (duplicateIds.length > 0) {
      console.warn(
        duplicateIds.map(([key, value]) => `id ${key} is repeated ${value} times`).join(", "),
      );
    }

    return { firstDate, lastDate };
  }, [rows]);

  return (
    <Table<GanttTask, GanttMeta>
      columns={COLUMNS_GANTT as TableColumn<GanttTask>[]}
      rows={rows}
      // rows={[]}
      // rows={[{ end: "", id: "", name: "", start: "", children: [], dependents: [] }]}
      Empty={() => <span>Empty</span>}
      getSubRows={(row) => row.children}
      onClickRow={onClick}
      onDoubleClickRow={onDoubleClick}
      virtualRows={true}
      ganttArrowStyleGetter={arrowStyleGetter}
      ganttArrowGetAround={true}
      ganttVisibleArrowInRange={true}
      virtualColumn={false}
      fullSize={true}
      loading={false}
      withGantt={true}
      instantGanttSplitter={true}
      rowSelection={rowSelection}
      onRowSelectionChange={setRowSelection}
      getRowId={(row) => row.id.toString()}
      ganttInfoGetter={(row) => ({
        end: row.original.end,
        id: row.original.id,
        start: row.original.start,
        name: row.original.name,
        type: row.original.children ? "group" : "task",
        dependents: row.original.successors,
        props: {
          additionalData: 1,
        },
      })}
      firstGanttDate={firstDate?.toISOString?.()}
      lastGanttDate={lastDate?.toDateString?.()}
      ganttRowMini={true}
      ganttGrid={true}
      ganttView={"years"}
      expanded={expanded}
      onExpandedChange={setExpanded}
    />
  );
}

function getRows(): GanttTask[] {
  return testRows as unknown as GanttTask[];
}
