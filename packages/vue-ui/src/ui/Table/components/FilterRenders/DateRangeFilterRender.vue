<script setup lang="ts" generic="RowData extends DefaultRow">
  import { isArray, isString } from "@krainovsd/js-helpers";
  import type { DefaultRow, FilterRenderProps } from "../../types";

  export type DateRangeFilterRenderProps = {
    format?: string;
  };

  defineProps<FilterRenderProps<RowData, DateRangeFilterRenderProps>>();
  const filterValue = defineModel<unknown>();
</script>

<template>
  <div class="ksd-table__filter-data-range-container">
    <input
      type="date"
      class="ksd-table__filter-data-range"
      :value="isArray(filterValue) ? (isString(filterValue[0]) ? filterValue[0] : '') : ''"
      @input="
        (event: Event) => {
          const target = event.target as HTMLInputElement;
          if (!isArray(filterValue)) {
            filterValue = [];
          }
          (filterValue as unknown[])[0] = target.value;
        }
      "
    />
    <span> - </span>
    <input
      type="date"
      class="ksd-table__filter-data-range"
      :value="isArray(filterValue) ? (isString(filterValue[1]) ? filterValue[1] : '') : ''"
      @input="
        (event: Event) => {
          const target = event.target as HTMLInputElement;
          if (!isArray(filterValue)) {
            filterValue = [];
          }
          (filterValue as unknown[])[1] = target.value;
        }
      "
    />
  </div>
</template>

<style lang="scss"></style>
