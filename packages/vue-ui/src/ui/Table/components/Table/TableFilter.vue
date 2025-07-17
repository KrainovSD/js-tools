<script setup lang="ts" generic="RowData extends DefaultRow">
  import { computed, h, markRaw, ref, watch } from "vue";
  import Filter, { type FilterItem } from "../../../Filter.vue";
  import type { ColumnFilter, DefaultRow, TableInterface } from "../../types";

  type Props = {
    withFilters: boolean;
    table: TableInterface<RowData>;
  };

  const props = defineProps<Props>();
  const headers = computed(() => props.table.getHeaderGroups()?.[0]?.headers ?? []);
  const filters = computed(() =>
    headers.value.reduce<FilterItem[]>((acc, header) => {
      const column = header.column.columnDef;
      const context = header.getContext();

      if (column.enableColumnFilter && column.filterRenders) {
        acc.push({
          field: column.id ?? (column.accessorKey as string),
          label: column.name,
          icon: column.icon,
          components: column.filterRenders.map((filterRender) => ({
            component: markRaw(
              h(filterRender.component, { context, settings: filterRender.props }),
            ),
            displayValue: filterRender.displayValue,
            operatorLabel: filterRender.operatorLabel,
            operatorValue: filterRender.operatorValue,
            props: filterRender.props,
            clearTag: filterRender.clearTag,
          })),
        });
      }

      return acc;
    }, []),
  );
  const form = ref<Record<string, unknown>>(
    Object.fromEntries(
      props.table.getState().columnFilters.map((filter) => [filter.id, filter.value]),
    ),
  );
  const operators = ref<Record<string, string>>(
    Object.fromEntries(
      props.table.getAllColumns().map((column) => [column.id, column.columnDef.filterFn]),
    ),
  );

  function updateFilter(form: Record<string, unknown>, operators: Record<string, string>) {
    const filter: ColumnFilter[] = [];
    for (const [key, value] of Object.entries(form)) {
      if (value != undefined) {
        filter.push({ id: key, value });
      }
    }

    props.table.getAllColumns().forEach((column) => {
      if (operators[column.id] != undefined) {
        column.columnDef.filterFn = operators[column.id];
      }
    });
    props.table.setColumnFilters(filter);
  }

  watch(
    () => form.value,
    (form) => {
      updateFilter(form, operators.value);
    },
    { deep: true },
  );
  watch(
    () => operators.value,
    (operators) => {
      updateFilter(form.value, operators);
    },
    { deep: true },
  );
  watch(
    () => props.table.getAllColumns(),
    (columns) => {
      operators.value = Object.fromEntries(
        columns.map((column) => [column.id, column.columnDef.filterFn]),
      );
    },
  );
  watch(
    () => props.table.getState().columnFilters,
    (filters) => {
      const isEqual = filters.every((filter) => {
        return form.value[filter.id] === filter.value;
      });

      if (!isEqual) {
        form.value = Object.fromEntries(filters.map((filter) => [filter.id, filter.value]));
      }
    },
  );
</script>

<template>
  <Filter
    v-if="$props.withFilters"
    v-model:operators="operators"
    v-model="form"
    :filters="filters"
    class="ksd-table__filter"
  />
</template>

<style lang="scss">
  .ksd-table__filter {
    padding: 0px 0px var(--ksd-padding) 0px;
  }
</style>
