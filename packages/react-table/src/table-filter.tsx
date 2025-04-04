import { type FilterFieldType, type FilterInputValueType, FiltersBlock } from "@krainovsd/react-ui";
import styles from "./table-filter.module.scss";
import type { TableInterface } from "./types";

type TableFilterProps<RowData extends Record<string, unknown>> = {
  filterOptions: FilterFieldType[];
  filters: Record<string, FilterInputValueType>;
  table: TableInterface<RowData>;
  Filter?: React.FC<{
    table: TableInterface<RowData>;
    filters: Record<string, FilterInputValueType>;
    filterOptions: FilterFieldType[];
  }>;
  withFilters: boolean;
};

export function TableFilter<RowData extends Record<string, unknown>>(
  props: TableFilterProps<RowData>,
) {
  return (
    <>
      {props.withFilters && props.filterOptions.length > 0 && (
        <>
          {!props.Filter && (
            <div className={styles.filterContainer}>
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
}
