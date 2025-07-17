<script setup lang="ts" generic="RowData extends DefaultRow">
  import { type Component, computed } from "vue";
  import PaginationComponent from "../../../Pagination.vue";
  import Text from "../../../Text.vue";
  import type { DefaultRow, TableInterface, TablePaginationProps } from "../../types";

  type Props = {
    withTotal: boolean | undefined;
    withPagination: boolean | undefined;
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
  <div v-if="$props.withTotal" class="ksd-table__total">
    <Text>Всего: {{ $props.totalRows }}</Text>
  </div>
  <PaginationComponent
    v-if="$props.withPagination && !$props.Pagination"
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
    :is="$props.withPagination && $props.Pagination"
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
    &__total {
      display: flex;
      padding: 8px;
      border-bottom: 1px solid var(--ksd-table-border);
      border-left: 1px solid var(--ksd-table-border);
      border-right: 1px solid var(--ksd-table-border);
      background: var(--ksd-table-footer-bg);
    }
    &__pagination {
      margin-top: var(--ksd-margin);
    }
  }
</style>
