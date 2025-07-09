<script setup lang="ts" generic="RowData extends DefaultRow">
  import type { DefaultRow, FilterRenderProps } from "../../types";

  defineProps<FilterRenderProps<RowData, unknown>>();
</script>

<template>
  <div>component</div>
</template>

<style lang="scss" module></style>
