<script setup lang="ts" generic="RowData extends DefaultRow">
  import { arrayToMapByKey, isString } from "@krainovsd/js-helpers";
  import type { Column } from "@tanstack/vue-table";
  import { type Component, computed, h, markRaw, ref, watch } from "vue";
  import { type FilterField, type FilterItem, VFilter } from "../../../Filter";
  import type { ColumnFilter, DefaultRow, TableInterface } from "../../types";

  type Props = {
    table: TableInterface<RowData>;
  };

  const props = defineProps<Props>();
  const headers = computed(() => props.table.getHeaderGroups()?.[0]?.headers ?? []);
  const filters = computed(() =>
    headers.value.reduce<FilterField<string, string | number>[]>((acc, header) => {
      const column = header.column.columnDef;

      if (column.enableColumnFilter && column.filterRenders) {
        const context = header.getContext();

        acc.push({
          field: column.id ?? (column.accessorKey as string),
          label: column.name,
          icon: column.icon,
          components: column.filterRenders.map((filterRender) => ({
            component: (isString(filterRender.component)
              ? filterRender.component
              : markRaw(
                  h(filterRender.component, { context, settings: filterRender.props }),
                )) as Component,
            displayValue: filterRender.displayValue,
            operatorLabel: filterRender.operatorLabel,
            operatorValue: filterRender.operatorValue,
            operatorShortLabel: filterRender.operatorShortLabel,
            props: filterRender.props,
            clearTag: filterRender.clearTag,
          })),
        });
      }

      return acc;
    }, []),
  );

  const filter = ref<FilterItem<string, string>[]>([]);

  function updateFilter(filter: FilterItem<string, string>[]) {
    const columnFilter: ColumnFilter[] = [];

    for (const item of filter) {
      columnFilter.push({ id: item.field, value: item.value });
    }

    props.table.getAllColumns().forEach((column) => {
      const operator = filter.find((f) => f.field === column.id)?.operator;
      if (operator != undefined) {
        column.columnDef.filterFn = operator;
      }
    });
    props.table.setColumnFilters(columnFilter);
  }

  watch(
    filter,
    (filter) => {
      updateFilter(filter);
    },
    { deep: true, immediate: true },
  );
  watch(
    () => props.table.getAllColumns(),
    (columns) => {
      const columnsMap: Record<string, Column<RowData>> = arrayToMapByKey(
        columns as unknown as Record<string, unknown>[],
        "id",
      ) as unknown as Record<string, Column<RowData>>;

      filter.value = filter.value.map((f) => ({
        ...f,
        op: columnsMap[f.field]?.columnDef?.filterFn,
      }));
    },
  );
  watch(
    () => props.table.getState().columnFilters,
    (columnFilters) => {
      const isEqual = columnFilters.every((columnFilter) => {
        return filter.value.find((f) => f.field === columnFilter.id)?.value === columnFilter.value;
      });

      if (!isEqual) {
        const columnsMap: Record<string, Column<RowData>> = arrayToMapByKey(
          props.table.getAllColumns() as unknown as Record<string, unknown>[],
          "id",
        ) as unknown as Record<string, Column<RowData>>;

        filter.value = columnFilters.map((f) => ({
          field: f.id,
          value: f.value,
          operator: columnsMap[f.id]?.columnDef?.filterFn,
        }));
      }
    },
    { immediate: true },
  );
</script>

<template>
  <VFilter v-model="filter" :filters="filters" class="ksd-table__filter" />
</template>

<style lang="scss">
  .ksd-table__filter {
    padding: 0px 0px var(--ksd-padding) 0px;
  }
</style>
