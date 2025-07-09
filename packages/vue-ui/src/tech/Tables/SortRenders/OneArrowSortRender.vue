<script setup lang="ts" generic="RowData extends DefaultRow">
  import type { DefaultRow, SortRenderProps } from "../../../ui/Table/types";

  type Props = {
    field?: string;
    firstDirection?: "asc" | "desc";
  };

  defineProps<SortRenderProps<RowData, Props>>();
</script>

<template>
  <div>sort one arrow</div>
</template>

<style lang="scss" module></style>
