/* eslint-disable no-console */
import type { ExpandedState, RowSelectionState } from "@tanstack/react-table";
import React from "react";
import { Table } from "../../table";
import type { GanttArrowStyleGetter, RowInterface } from "../../types";
import { COLUMNS_GANTT } from "../lib/gantt/columns";
import { GANTT_ROWS } from "../lib/gantt/rows";
import type { GanttMeta, RowGantt } from "../types/gantt";

export function GanttVirtualRow() {
  const [expanded, setExpanded] = React.useState<ExpandedState>(true);
  const [rowSelection, setRowSelection] = React.useState<RowSelectionState>({});

  function onClick(row: RowInterface<RowGantt>) {
    console.log(row, "click");
  }
  function onDoubleClick(row: RowInterface<RowGantt>) {
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

    function checkRows(children: RowGantt[]) {
      for (const row of children) {
        const currentStartDate = new Date(row.start);
        const currentEndDate = new Date(row.end);

        if (!firstDate || currentStartDate < firstDate) {
          firstDate = currentStartDate;
        }
        if (!lastDate || currentEndDate > lastDate) {
          lastDate = currentEndDate;
        }

        if (row.children && row.children.length > 0) checkRows(row.children);
      }
    }

    checkRows(GANTT_ROWS);

    return { firstDate, lastDate };
  }, []);

  return (
    <Table<RowGantt, GanttMeta>
      columns={COLUMNS_GANTT}
      rows={GANTT_ROWS}
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
      getRowId={(row) => row.id}
      ganttInfoGetter={(row) => ({
        end: row.original.end,
        id: row.original.id,
        start: row.original.start,
        name: row.original.name,
        type: row.original.type ?? (row.original.children ? "group" : "task"),
        dependents: row.original.dependents,
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
