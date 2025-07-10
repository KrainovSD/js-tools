<script setup lang="ts" generic="RowData extends DefaultRow">
  import type { DefaultRow, SortRenderProps } from "../../types";

  defineProps<SortRenderProps<RowData, unknown>>();
</script>

<template>
  <div>component</div>
</template>

<style lang="scss" module></style>
