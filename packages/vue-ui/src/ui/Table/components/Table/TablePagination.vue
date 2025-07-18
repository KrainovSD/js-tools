<script setup lang="ts" generic="RowData extends DefaultRow">
  import { type Component, computed } from "vue";
  import PaginationComponent from "../../../Pagination.vue";
  import type { DefaultRow, TableInterface, TablePaginationProps } from "../../types";

  type Props = {
    table: TableInterface<RowData>;
    totalRows: number;
    pageSizes: number[] | undefined;
    Pagination?: Component<TablePaginationProps<RowData>>;
  };

  const props = defineProps<Props>();
  const paginationState = computed(() => props.table.getState().pagination);
  const pageSizes = computed(() => props.pageSizes ?? [10, 25, 50, 100, 150, 200]);
</script>

<template>
  <PaginationComponent
    v-if="!$props.Pagination"
    :total-rows="$props.totalRows"
    :page-sizes="pageSizes"
    :model-value="paginationState.pageIndex"
    :page-size="paginationState.pageSize"
    placement="right"
    :class="'ksd-table__pagination'"
    @update:model-value="
      (value) => {
        props.table.setPageIndex(value);
      }
    "
    @update:page-size="
      (value) => {
        props.table.setPageSize(value);
      }
    "
  />
  <component
    :is="$props.Pagination"
    v-if="$props.Pagination"
    :table="$props.table"
    :page-index="paginationState.pageIndex"
    :page-size="paginationState.pageSize"
    :total-rows="$props.totalRows"
    :page-sizes="pageSizes"
  />
</template>

<style lang="scss">
  .ksd-table {
    &__pagination {
      margin-top: var(--ksd-margin);
    }
  }
</style>
