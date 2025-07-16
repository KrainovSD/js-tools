<script setup lang="ts" generic="RowData extends DefaultRow">
  import { isArray, isNumber } from "@krainovsd/js-helpers";
  import InputNumber from "../../../InputNumber.vue";
  import type { DefaultRow, FilterRenderProps } from "../../types";

  export type NumberRangeFilterRenderProps = {
    min?: number;
    max?: number;
    step?: number;
    placeholder?: string;
  };

  defineProps<FilterRenderProps<RowData, NumberRangeFilterRenderProps>>();
  const filterValue = defineModel<unknown>();
</script>

<template>
  <div class="ksd-table__filter-number-range-container">
    <InputNumber
      :model-value="
        isArray(filterValue) && isNumber((filterValue as unknown[])?.[0])
          ? ((filterValue as unknown[])[0] as number)
          : undefined
      "
      :placeholder="$props.settings?.placeholder"
      :min="$props.settings?.min"
      :max="$props.settings?.max"
      :step="$props.settings?.step"
      class="ksd-table__filter-number-range"
      @update:model-value="
        (value) => {
          if (!isArray(filterValue)) {
            filterValue = [value, undefined];
          } else {
            filterValue[0] = value;
          }
        }
      "
    />
    <span> - </span>
    <InputNumber
      :model-value="
        isArray(filterValue) && isNumber((filterValue as unknown[])?.[1])
          ? ((filterValue as unknown[])[1] as number)
          : undefined
      "
      :placeholder="$props.settings?.placeholder"
      :min="$props.settings?.min"
      :max="$props.settings?.max"
      :step="$props.settings?.step"
      class="ksd-table__filter-number-range"
      @update:model-value="
        (value) => {
          if (!isArray(filterValue)) {
            filterValue = [value, undefined];
          } else {
            filterValue[1] = value;
          }
        }
      "
    />
  </div>
</template>

<style lang="scss">
  .ksd-table__filter-number-range-container {
    display: flex;
    gap: var(--ksd-margin-xs);
    align-items: center;
  }
  .ksd-table__filter-number-range {
    width: 80px;
  }
</style>
