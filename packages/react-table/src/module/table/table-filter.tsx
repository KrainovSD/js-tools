import { type FilterFieldType, type FilterInputValueType, FiltersBlock } from "@krainovsd/react-ui";
import clsx from "clsx";
import React from "react";
import type {
  DefaultRow,
  TableFilterProps as TableFilterPropsCustom,
  TableInterface,
} from "../../types";
import styles from "./table-filter.module.scss";

type TableFilterProps<RowData extends DefaultRow> = {
  filterOptions: FilterFieldType[];
  filters: Record<string, FilterInputValueType>;
  table: TableInterface<RowData>;
  Filter: React.FC<TableFilterPropsCustom<RowData>> | undefined;
  withFilters: boolean;
};

export const TableFilter = React.memo(function TableFilter<RowData extends DefaultRow>(
  props: TableFilterProps<RowData>,
) {
  return (
    <>
      {props.withFilters && props.filterOptions.length > 0 && (
        <>
          {!props.Filter && (
            <div
              className={clsx(styles.filterContainer, "ksd-table-filter-container")}
              data-id="filter"
            >
              <FiltersBlock
                filter={props.filters}
                filterLabel="Фильтр"
                fields={props.filterOptions}
                onValuesChange={(_, field, value) => {
                  props.table.getColumn(field.toString())?.setFilterValue?.(value);
                }}
              />
            </div>
          )}
          {props.Filter && (
            <props.Filter
              filters={props.filters}
              filterOptions={props.filterOptions}
              table={props.table}
            />
          )}
        </>
      )}
    </>
  );
}) as <RowData extends DefaultRow>(props: TableFilterProps<RowData>) => React.JSX.Element;
