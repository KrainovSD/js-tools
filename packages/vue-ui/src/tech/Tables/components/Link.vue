<script setup lang="ts">
  import type { CellRenderProps } from "../../../ui/Table/types";
  import type { RowData } from "../types";

  const props = defineProps<Omit<CellRenderProps<RowData>, "settings">>();
</script>

<template>
  <a :class="$style.base" :href="props.context.row.id">
    <slot></slot>
  </a>
</template>

<style lang="scss" module>
  .base {
    height: fit-content;
  }
</style>
