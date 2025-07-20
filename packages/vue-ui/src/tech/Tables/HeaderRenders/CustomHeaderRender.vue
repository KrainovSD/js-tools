<script setup lang="ts" generic="RowData extends DefaultRow">
  import type { DefaultRow, HeaderRenderProps } from "../../../ui/Table/types";

  type Props = {
    withFilter?: boolean;
  };

  defineProps<HeaderRenderProps<RowData, Props>>();
</script>

<template>
  <div>{{ $props.context.column.columnDef.name }}</div>
  <span v-if="$props.settings?.withFilter">filter</span>
</template>

<style lang="scss" module></style>
