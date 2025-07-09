<script setup lang="ts" generic="RowData extends DefaultRow">
  import type { DefaultRow, FilterRenderProps } from "../../types";

  export type DateFilterRenderProps = {
    format: string;
  };

  defineProps<FilterRenderProps<RowData, DateFilterRenderProps>>();
</script>

<template>
  <div>component</div>
</template>

<style lang="scss" module></style>
