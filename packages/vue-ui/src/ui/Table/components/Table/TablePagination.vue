<script setup lang="ts" generic="RowData extends DefaultRow">
  import PaginationComponent from "../../../Pagination.vue";
  import type { DefaultRow, TablePaginationProps } from "../../types";

  const props = defineProps<TablePaginationProps<RowData>>();
</script>

<template>
  <PaginationComponent
    :total-rows="$props.totalRows"
    :page-sizes="$props.pageSizes"
    :model-value="$props.pageIndex"
    :page-size="$props.pageSize"
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
</template>

<style lang="scss">
  .ksd-table {
    &__pagination {
      margin-top: var(--ksd-margin);
    }
  }
</style>
