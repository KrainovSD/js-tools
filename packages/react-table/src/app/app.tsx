/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-unnecessary-type-arguments */
import { wait } from "@krainovsd/js-helpers";
import type {
  ColumnOrderState,
  ExpandedState,
  RowSelectionState,
  VisibilityState,
} from "@tanstack/react-table";
import { ConfigProvider } from "antd";
import React from "react";
import { Table } from "../table";
import type { RowInterface, TableColumn } from "../types";
import styles from "./app.module.scss";
import { type Row, columns, createRows } from "./lib";
import { type RowGantt, columnsGantt, createRowsGantt } from "./lib-gantt";

const withGantt: true | false = false;
const rowsCommon: Row[] = createRows();
const rowsGantt: RowGantt[] = createRowsGantt();

type CurrentRow = typeof withGantt extends true ? RowGantt : Row;
type CurrentGantt = {
  additionalData?: number;
};

type CellRenderKeys = "test";
type HeaderRenderKeys = undefined;
type FilterRenderKeys = undefined;
type SortRenderKeys = undefined;
type CellClassKeys = undefined;
type HeaderClassKeys = undefined;
type FilterTypeKeys = undefined;
type SortTypeKeys = undefined;

export function App() {
  const [expanded, setExpanded] = React.useState<ExpandedState>({});
  const [rowSelection, setRowSelection] = React.useState<RowSelectionState>({});
  const [columnsVisibility, setColumnsVisibility] = React.useState<VisibilityState>({
    name: false,
    start: true,
    end: true,
  });

  const [tableColumns, setTableColumns] = React.useState<ColumnOrderState>(
    columns.map((col) => col.key),
  );

  React.useEffect(() => {
    wait(1000)
      .then(() => {
        setColumnsVisibility({
          name: true,
          start: true,
          end: true,
        });
      })
      .catch(() => {});
  }, []);

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
          CurrentGantt,
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
          rows={(withGantt ? rowsGantt : rowsCommon) as CurrentRow[]}
          // rows={[]}
          Empty={() => <span>Empty</span>}
          // rows={[{ end: "", id: "", name: "", start: "", children: [], dependents: [] }]}
          cellRenders={{ test: () => "" }}
          getSubRows={(row) => row.children}
          // onSortingChange={onSortingChange}
          // sorting={sorting}
          // manualSorting
          withPagination
          withTotal
          initialPageSize={150}
          onClickRow={onClick}
          onDoubleClickRow={onDoubleClick}
          pageSizes={[25, 50, 100, 150, 250, 500]}
          // getExpandedRowModel={getExpandedRowModel}
          withFilters={true}
          rowRender={(row) => {
            // eslint-disable-next-line no-underscore-dangle
            if (!row.original._EXPANDED_ROW) return null;

            return (
              <td style={{ width: "100%" }}>
                <Table
                  columns={columns.toSpliced(0, 1).toSpliced(4)}
                  rows={row.original.children ?? []}
                  fullSize={false}
                  withFilters={false}
                  withTotal={false}
                  withPagination={false}
                  className={styles.inner}
                />
              </td>
            );
          }}
          virtualRows={true}
          virtualRowSize={69}
          virtualColumn={false}
          fullSize={true}
          loading={false}
          withGantt={withGantt}
          instantGanttSplitter={false}
          columnOrder={!withGantt ? tableColumns : undefined}
          onColumnOrderChange={!withGantt ? setTableColumns : undefined}
          rowSelection={rowSelection}
          onRowSelectionChange={setRowSelection}
          getRowId={(row) => row.id}
          // ganttInfoGetter={
          //   withGantt
          //     ? (row) => ({
          //         end: row.original.end,
          //         id: row.original.id,
          //         start: row.original.start,
          //         name: row.original.name,
          //         type: row.original.type ?? (row.original.children ? "group" : "task"),
          //         dependents: row.original.dependents,
          //         props: {
          //           additionalData: 1,
          //         },
          //       })
          //     : undefined
          // }
          firstGanttDate={firstDate?.toISOString?.()}
          lastGanttDate={lastDate?.toDateString?.()}
          ganttRowMini={true}
          ganttGrid={true}
          ganttView={"years"}
          columnVisibility={columnsVisibility}
          onColumnVisibilityChange={setColumnsVisibility}
          expanded={expanded}
          onExpandedChange={setExpanded}
          // rowClassName={styles.row}
          headerRowClassName={styles.headerRow}
        />
      </div>
    </ConfigProvider>
  );
}

function onClick(row: RowInterface<Row>) {
  console.log(row, "click");
}
function onDoubleClick(row: RowInterface<Row>) {
  console.log(row, "dbClick");
}
