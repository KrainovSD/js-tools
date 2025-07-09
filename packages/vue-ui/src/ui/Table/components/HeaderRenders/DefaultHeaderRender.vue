<script setup lang="ts" generic="RowData extends DefaultRow">
  import type { DefaultRow, HeaderRenderProps } from "../../types";

  defineProps<HeaderRenderProps<RowData, unknown>>();
</script>

<template>
  <div>component</div>
</template>

<style lang="scss" module></style>
