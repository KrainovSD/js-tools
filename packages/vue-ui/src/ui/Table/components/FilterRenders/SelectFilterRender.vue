<script setup lang="ts" generic="RowData extends DefaultRow">
  import type { SelectItem } from "../../../Select.vue";
  import type { DefaultRow, FilterRenderProps } from "../../types";

  export type SelectFilterRenderProps = {
    options: SelectItem[];
    multiple?: boolean;
  };

  defineProps<FilterRenderProps<RowData, SelectFilterRenderProps>>();
</script>

<template>
  <div>component</div>
</template>

<style lang="scss" module></style>
