/* eslint-disable @typescript-eslint/no-unnecessary-type-arguments */
/* eslint-disable no-console */
import type { ColumnOrderState, ExpandedState, RowSelectionState } from "@tanstack/react-table";
import React from "react";
import { Table } from "../../table";
import type { DefaultRow, RowInterface, RowModel, TableInterface } from "../../types";
import { COMMON_COLUMNS } from "../lib/common/columns";
import { COMMON_ROW } from "../lib/common/rows";
import type {
  CellClassKeys,
  CellRenderKeys,
  CommonRow,
  FilterRenderKeys,
  FilterTypeKeys,
  HeaderClassKeys,
  HeaderRenderKeys,
  SortRenderKeys,
  SortTypeKeys,
} from "../types/common";
import styles from "./styles.module.scss";

export function CommonInnerTable() {
  const [expanded, setExpanded] = React.useState<ExpandedState>({});
  const [rowSelection, setRowSelection] = React.useState<RowSelectionState>({});
  const [tableColumns, setTableColumns] = React.useState<ColumnOrderState>(
    COMMON_COLUMNS.map((col) => col.key),
  );

  function onClick(row: RowInterface<CommonRow>) {
    console.log(row, "click");
  }
  function onDoubleClick(row: RowInterface<CommonRow>) {
    console.log(row, "dbClick");
  }

  return (
    <Table<
      CommonRow,
      Record<string, unknown>,
      CellRenderKeys,
      HeaderRenderKeys,
      FilterRenderKeys,
      SortRenderKeys,
      CellClassKeys,
      HeaderClassKeys,
      FilterTypeKeys,
      SortTypeKeys
    >
      columns={COMMON_COLUMNS}
      rows={COMMON_ROW}
      // rows={[]}
      Empty={() => <span>Empty</span>}
      cellRenders={{ test: () => "" }}
      getSubRows={(row) => row.children}
      withPagination
      withTotal
      initialPageSize={150}
      onClickRow={onClick}
      onDoubleClickRow={onDoubleClick}
      pageSizes={[25, 50, 100, 150, 250, 500]}
      withFilters={true}
      virtualRows={true}
      virtualRowSize={69}
      virtualColumn={false}
      fullSize={true}
      loading={false}
      columnOrder={tableColumns}
      onColumnOrderChange={setTableColumns}
      rowSelection={rowSelection}
      onRowSelectionChange={setRowSelection}
      getRowId={(row) => row.id}
      expanded={expanded}
      onExpandedChange={setExpanded}
      rowRender={(row) => {
        if (!row.original._EXPANDED_ROW) return null;

        return (
          <td
            style={{ width: "100%", gridColumnStart: 1, gridColumnEnd: COMMON_COLUMNS.length + 1 }}
          >
            <Table
              columns={COMMON_COLUMNS.toSpliced(0, 1).toSpliced(4)}
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
      getExpandedRowModel={getExpandedRowModel}
    />
  );
}

function memo<TDeps extends readonly unknown[], TDepArgs, TResult>(
  getDeps: (depArgs?: TDepArgs) => [...TDeps],
  fn: (...args: NoInfer<[...TDeps]>) => TResult,
  opts: {
    onChange?: (result: TResult) => void;
  } = {},
): (depArgs?: TDepArgs) => TResult {
  let deps: unknown[] = [];
  let result: TResult | undefined;

  return (depArgs) => {
    const newDeps = getDeps(depArgs);

    const depsChanged =
      newDeps.length !== deps.length ||
      newDeps.some((dep: unknown, index: number) => deps[index] !== dep);

    if (!depsChanged) {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      return result!;
    }

    deps = newDeps;

    result = fn(...newDeps);
    opts?.onChange?.(result);

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    return result!;
  };
}

export function getExpandedRowModel(): (
  table: TableInterface<CommonRow>,
) => () => RowModel<CommonRow> {
  return (table) =>
    memo(
      () => [
        table.getState().expanded,
        table.getPreExpandedRowModel(),
        table.options.paginateExpandedRows,
      ],
      (expanded, rowModel, paginateExpandedRows) => {
        if (!rowModel.rows.length || (expanded !== true && !Object.keys(expanded ?? {}).length)) {
          return rowModel;
        }

        if (!paginateExpandedRows) {
          // Only expand rows at this point if they are being paginated
          return rowModel;
        }

        return expandRows(rowModel);
      },
    );
}

function expandRows<TData extends DefaultRow>(rowModel: RowModel<TData>) {
  const expandedRows: RowInterface<TData>[] = [];

  const handleRow = (row: RowInterface<TData>) => {
    expandedRows.push(row);

    if (row.subRows?.length && row.getIsExpanded()) {
      handleRow({
        ...row,
        id: `${row.id}.0`,
        parentId: row.id,
        index: 0,
        depth: 1,
        getIsExpanded: () => false,
        original: { ...row.original, id: `${row.original.id}_0`, _EXPANDED_ROW: true },
      });
    }
  };

  rowModel.rows.forEach(handleRow);

  return {
    rows: expandedRows,
    flatRows: rowModel.flatRows,
    rowsById: rowModel.rowsById,
  };
}
