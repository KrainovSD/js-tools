<script setup lang="ts" generic="RowData extends DefaultRow">
  import type { DefaultRow, FilterRenderProps } from "../../../ui/Table/types";

  type Props = {
    min?: number;
    max?: number;
  };

  defineProps<FilterRenderProps<RowData, Props>>();
</script>

<template>
  <div>filter number</div>
</template>

<style lang="scss" module></style>
