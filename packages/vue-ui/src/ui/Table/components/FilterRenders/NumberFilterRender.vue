<script setup lang="ts" generic="RowData extends DefaultRow">
  import { isNumber } from "@krainovsd/js-helpers";
  import InputNumber from "../../../InputNumber.vue";
  import type { DefaultRow, FilterRenderProps } from "../../types";

  export type NumberFilterRenderProps = {
    min?: number;
    max?: number;
    step?: number;
    placeholder?: string;
  };

  defineProps<FilterRenderProps<RowData, NumberFilterRenderProps>>();
  const filterValue = defineModel<unknown>();
</script>

<template>
  <InputNumber
    :model-value="isNumber(filterValue) ? filterValue : undefined"
    :placeholder="$props.settings?.placeholder"
    :min="$props.settings?.min"
    :max="$props.settings?.max"
    :step="$props.settings?.step"
    class="ksd-table__filter-number"
    @update:model-value="(value) => (filterValue = value)"
  />
</template>

<style lang="scss">
  .ksd-table__filter-number {
    width: 80px;
  }
</style>
