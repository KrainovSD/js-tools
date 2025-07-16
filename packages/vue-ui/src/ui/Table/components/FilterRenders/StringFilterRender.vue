<script setup lang="ts" generic="RowData extends DefaultRow">
  import { isString } from "@krainovsd/js-helpers";
  import Input from "../../../Input.vue";
  import type { DefaultRow, FilterRenderProps } from "../../types";

  export type StringFilterRenderProps = {
    allowClear?: boolean;
    placeholder?: string;
  };

  defineProps<FilterRenderProps<RowData, StringFilterRenderProps>>();
  const filterValue = defineModel<unknown>();
</script>

<template>
  <Input
    :model-value="isString(filterValue) ? (filterValue as string) : undefined"
    :allow-clear="$props.settings?.allowClear ?? false"
    :placeholder="$props.settings?.placeholder"
    class="ksd-table__filter-string"
    @update:model-value="
      (value) => {
        filterValue = value;
      }
    "
  />
</template>

<style lang="scss">
  .ksd-table__filter-string {
    min-width: 300px;
  }
</style>
