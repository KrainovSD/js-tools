<script setup lang="ts" generic="RowData extends DefaultRow">
  import type { DefaultRow, SortRenderProps } from "../../../ui/Table/types";

  type Props = {
    field?: string;
  };

  defineProps<SortRenderProps<RowData, Props>>();
</script>

<template>
  <div>sort double arrow</div>
</template>

<style lang="scss" module></style>
