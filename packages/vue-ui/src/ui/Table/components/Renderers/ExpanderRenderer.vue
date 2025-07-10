<script setup lang="ts" generic="RowData extends DefaultRow">
  import type { CellRenderProps, DefaultRow } from "../../types";

  defineProps<CellRenderProps<RowData, never>>();
</script>

<template>
  <div>component</div>
</template>

<style lang="scss" module></style>
