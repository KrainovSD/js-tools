<script setup lang="ts" generic="RowData extends DefaultRow">
  import { isArray } from "@krainovsd/js-helpers";
  import type { SelectItem, SelectValue } from "../../../Select.vue";
  import Select from "../../../Select.vue";
  import type { DefaultRow, FilterRenderProps } from "../../types";

  export type SelectFilterRenderProps = {
    options: SelectItem[];
    multiple?: boolean;
    search?: boolean;
    clear?: boolean;
    placeholder?: string;
  };

  defineProps<FilterRenderProps<RowData, SelectFilterRenderProps>>();
  const filterValue = defineModel<unknown>();
</script>

<template>
  <Select
    :options="$props.settings?.options ?? []"
    :multiple="$props.settings?.multiple"
    :search="$props.settings?.search"
    :clear="$props.settings?.clear"
    :placeholder="$props.settings?.placeholder"
    class="ksd-table__filter-select"
    :model-value="
      $props.settings?.multiple
        ? isArray(filterValue)
          ? (filterValue as SelectValue[])
          : undefined
        : (filterValue as SelectValue)
    "
    @update:model-value="(value) => (filterValue = value)"
  />
</template>

<style lang="scss">
  .ksd-table__filter-select {
    min-width: 300px;
    max-width: 300px;
  }
</style>
