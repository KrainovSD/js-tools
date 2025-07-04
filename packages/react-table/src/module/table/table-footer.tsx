import { Pagination } from "@krainovsd/react-ui";
import React from "react";
import type { DefaultRow, TableInterface, TablePaginationProps } from "../../types";
import styles from "./table-footer.module.scss";

type TableFooterProps<RowData extends DefaultRow> = {
  Pagination: React.FC<TablePaginationProps<RowData>> | undefined;
  withPagination: boolean | undefined;
  withTotal: boolean | undefined;
  table: TableInterface<RowData>;
  pageIndex: number;
  pageSize: number;
  totalRows: number;
  pageSizes?: number[];
};

export const TableFooter = React.memo(function TableFooter<RowData extends DefaultRow>(
  props: TableFooterProps<RowData>,
) {
  const pageSizes = React.useMemo(() => {
    return props.pageSizes ?? [10, 25, 50, 100, 150, 200];
  }, [props.pageSizes]);

  return (
    <>
      {(props.withPagination || props.withTotal) && (
        <>
          <div className={styles.paginationContainer} data-id="footer">
            {props.withTotal && (
              <div className={styles.paginationTotal}>{`Всего: ${props.totalRows}`}</div>
            )}
            {props.withPagination && (
              <>
                {!props.Pagination && (
                  <Pagination
                    className={styles.pagination}
                    defaultCurrent={props.pageIndex + 1}
                    total={props.totalRows}
                    pageSize={props.pageSize}
                    onChange={(page, pageSize) => {
                      props.table.setPageIndex(page - 1);
                      props.table.setPageSize(pageSize);
                    }}
                    defaultPageSize={props.pageSize}
                    pageSizeOptions={pageSizes}
                    data-id="pagination"
                  />
                )}
                {props.Pagination && (
                  <props.Pagination
                    table={props.table}
                    pageIndex={props.pageIndex}
                    pageSize={props.pageSize}
                    pageSizes={pageSizes}
                    totalRows={props.totalRows}
                  />
                )}
              </>
            )}
          </div>
        </>
      )}
    </>
  );
}) as <RowData extends DefaultRow>(props: TableFooterProps<RowData>) => React.JSX.Element;
