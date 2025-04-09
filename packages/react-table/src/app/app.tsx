/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-unnecessary-type-arguments */
import { ConfigProvider } from "antd";
import React from "react";
import { Table } from "../table";
import type { TableColumn } from "../types";
import { type Row, columns, createRows } from "./lib";
import { type RowGantt, columnsGantt, createRowsGantt } from "./lib-gantt";

const withGantt: true | false = true;
const rows: Row[] = createRows();
const rowsGantt: RowGantt[] = createRowsGantt();

type CurrentRow = typeof withGantt extends true ? RowGantt : Row;

type CellRenderKeys = "test";
type HeaderRenderKeys = undefined;
type FilterRenderKeys = undefined;
type SortRenderKeys = undefined;
type CellClassKeys = undefined;
type HeaderClassKeys = undefined;
type FilterTypeKeys = undefined;
type SortTypeKeys = undefined;

export function App() {
  const { firstDate, lastDate } = React.useMemo(() => {
    if (!withGantt) return {};

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

    checkRows(rowsGantt);

    return { firstDate, lastDate };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [withGantt]);

  return (
    <ConfigProvider
      theme={{
        cssVar: true,
        token: {
          fontFamily: "Nunito",
        },
        components: {
          Button: {
            defaultBg: "white",
          },
        },
      }}
    >
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          padding: "24px",
          overflow: "hidden",
          background: "#F0F0F0",
        }}
      >
        <Table<
          CurrentRow,
          CellRenderKeys,
          HeaderRenderKeys,
          FilterRenderKeys,
          SortRenderKeys,
          CellClassKeys,
          HeaderClassKeys,
          FilterTypeKeys,
          SortTypeKeys
        >
          columns={
            (withGantt ? columnsGantt : columns) as TableColumn<
              CurrentRow,
              CellRenderKeys,
              HeaderRenderKeys,
              FilterRenderKeys,
              SortRenderKeys,
              CellClassKeys,
              HeaderClassKeys,
              FilterTypeKeys,
              SortTypeKeys
            >[]
          }
          rows={(withGantt ? rowsGantt : rows) as CurrentRow[]}
          cellRenders={{ test: () => "" }}
          getSubRows={(row) => row.children}
          // onSortingChange={onSortingChange}
          // sorting={sorting}
          // manualSorting
          withPagination
          withTotal
          initialPageSize={150}
          onClickRow={(row) => {
            console.log(row, "click");
          }}
          onDoubleClickRow={(row) => {
            console.log(row, "dbClick");
          }}
          pageSizes={[25, 50, 100, 150, 250]}
          withFilters={true}
          virtualRows={true}
          virtualRowSize={60}
          virtualColumn={false}
          fullSize={false}
          withGantt={withGantt}
          instantGanttSplitter={false}
          ganttInfoGetter={
            withGantt
              ? (row) => ({
                  end: row.original.end,
                  id: row.original.id,
                  start: row.original.start,
                  name: row.original.name,
                  type: row.original.type ?? (row.original.children ? "group" : "task"),
                  dependencies: row.original.dependencies,
                })
              : undefined
          }
          firstGanttDate={firstDate?.toISOString?.()}
          lastGanttDate={lastDate?.toDateString?.()}
          ganttRowMini={true}
          ganttGrid={true}
          ganttView={"weeks"}
        />
      </div>
    </ConfigProvider>
  );
}
