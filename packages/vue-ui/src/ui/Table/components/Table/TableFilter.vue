<script setup lang="ts" generic="RowData extends DefaultRow">
  import { computed, h, markRaw, reactive } from "vue";
  import Filter, { type FilterItem } from "../../../Filter.vue";
  import type { DefaultRow, TableInterface } from "../../types";

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

      if (column.enableColumnFilter && column.filterRender) {
        acc.push({
          component: markRaw(
            h(column.filterRender, { context, settings: column.filterRenderProps }),
          ),
          props: column.filterRenderProps,
          field: column.accessorKey as string,
          label: column.name,
          icon: column.icon,
          displayValue: column.filterDisplayValue,
          operators: column.filterOperators,
        });
      }

      return acc;
    }, []),
  );
  const form = reactive<Record<string, unknown>>({});
  const operators = reactive<Record<string, unknown>>({});
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
