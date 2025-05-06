import { Pagination } from "@krainovsd/react-ui";
import type { TableInterface } from "../../types";
import styles from "./table-footer.module.scss";

type TableFooterProps<RowData extends Record<string, unknown>> = {
  Pagination: React.FC<{ table: TableInterface<RowData> }> | undefined;
  withPagination: boolean | undefined;
  withTotal: boolean | undefined;
  table: TableInterface<RowData>;
  filteredRowsCount: number;
};

export function TableFooter<RowData extends Record<string, unknown>>(
  props: TableFooterProps<RowData>,
) {
  const tableState = props.table.getState();
  const pageSizes = props.table.options.meta?.pageSizes;

  return (
    <>
      {(props.withPagination || props.withTotal) && (
        <>
          <div className={styles.paginationContainer}>
            {props.withTotal && (
              <div className={styles.paginationTotal}>{`Всего: ${props.filteredRowsCount}`}</div>
            )}
            {props.withPagination && (
              <>
                {!props.Pagination && (
                  <Pagination
                    className={styles.pagination}
                    defaultCurrent={tableState.pagination.pageIndex + 1}
                    total={props.filteredRowsCount}
                    pageSize={tableState.pagination.pageSize}
                    onChange={(page, pageSize) => {
                      props.table.setPageIndex(page - 1);
                      props.table.setPageSize(pageSize);
                    }}
                    defaultPageSize={tableState.pagination.pageSize}
                    pageSizeOptions={pageSizes ?? [10, 25, 50, 100, 150, 200]}
                  />
                )}
                {props.Pagination && <props.Pagination table={props.table} />}
              </>
            )}
          </div>
        </>
      )}
    </>
  );
}
