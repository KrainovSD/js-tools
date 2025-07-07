/* eslint-disable @typescript-eslint/no-unnecessary-type-arguments */
/* eslint-disable no-console */
import type { ExpandedState, RowSelectionState } from "@tanstack/react-table";
import React from "react";
import { Table } from "../../table";
import type { RowInterface } from "../../types";
import { COLUMNS_GANTT } from "../lib/gantt/columns";
import { GANTT_ROWS } from "../lib/gantt/rows";
import type {
  GanttCellClassKeys,
  GanttCellClassProps,
  GanttCellRenderKeys,
  GanttCellRenderProps,
  GanttColumnProps,
  GanttFilterRenderKeys,
  GanttFilterRenderProps,
  GanttFilterTypeKeys,
  GanttHeaderClassKeys,
  GanttHeaderClassProps,
  GanttHeaderRenderKeys,
  GanttHeaderRenderProps,
  GanttMeta,
  GanttSortRenderKeys,
  GanttSortRenderProps,
  GanttSortTypeKeys,
  RowGantt,
} from "../types/gantt";

export function Gantt() {
  const [expanded, setExpanded] = React.useState<ExpandedState>(true);
  const [rowSelection, setRowSelection] = React.useState<RowSelectionState>({});

  function onClick(row: RowInterface<RowGantt>) {
    console.log(row, "click");
  }
  function onDoubleClick(row: RowInterface<RowGantt>) {
    console.log(row, "dbClick");
  }

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

  console.log(GANTT_ROWS);

  return (
    <Table<
      RowGantt,
      GanttMeta,
      GanttCellRenderKeys,
      GanttCellRenderProps,
      GanttHeaderRenderKeys,
      GanttHeaderRenderProps,
      GanttFilterRenderKeys,
      GanttFilterRenderProps,
      GanttSortRenderKeys,
      GanttSortRenderProps,
      GanttCellClassKeys,
      GanttCellClassProps,
      GanttHeaderClassKeys,
      GanttHeaderClassProps,
      GanttFilterTypeKeys,
      GanttSortTypeKeys,
      GanttColumnProps
    >
      columns={COLUMNS_GANTT}
      rows={GANTT_ROWS}
      // rows={[]}
      // rows={[{ end: "", id: "", name: "", start: "", children: [], dependents: [] }]}
      Empty={() => <span>Empty</span>}
      cellRenders={{ test: () => "" }}
      getSubRows={(row) => row.children}
      onClickRow={onClick}
      onDoubleClickRow={onDoubleClick}
      virtualRows={false}
      virtualRowSize={69}
      virtualColumn={false}
      fullSize={true}
      loading={false}
      withGantt={true}
      instantGanttSplitter={false}
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
