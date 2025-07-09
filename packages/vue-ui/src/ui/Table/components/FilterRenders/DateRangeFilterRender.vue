<script setup lang="ts" generic="RowData extends DefaultRow">
  import type { DefaultRow, FilterRenderProps } from "../../types";

  export type DateRangeFilterRenderProps = {
    format: string;
  };

  defineProps<FilterRenderProps<RowData, DateRangeFilterRenderProps>>();
</script>

<template>
  <div>component</div>
</template>

<style lang="scss" module></style>
