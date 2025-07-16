<script setup lang="ts" generic="RowData extends DefaultRow">
  import { isString } from "@krainovsd/js-helpers";
  import type { DefaultRow, FilterRenderProps } from "../../types";

  export type DateFilterRenderProps = {
    format?: string;
  };

  defineProps<FilterRenderProps<RowData, DateFilterRenderProps>>();
  const filterValue = defineModel<unknown>();
</script>

<template>
  <input
    type="date"
    class="ksd-table__filter-date"
    :value="isString(filterValue) ? filterValue : ''"
    @input="
      (event: Event) => {
        const target = event.target as HTMLInputElement;
        filterValue = target.value;
      }
    "
  />
</template>

<style lang="scss"></style>
