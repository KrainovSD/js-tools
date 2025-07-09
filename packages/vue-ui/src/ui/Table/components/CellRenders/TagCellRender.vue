<script setup lang="ts" generic="RowData extends DefaultRow">
  import type { CellRenderProps, DefaultRow } from "../../types";

  export type TagColor = string;

  export type TagCellRenderProps = {
    color?: TagColor | ((content: unknown) => TagColor);
    mappings?: Record<string, string>;
    bordered?: boolean;
    filterable?: boolean;
  };

  export type TagContent = {
    label: string;
    value: string | number | boolean;
    color: TagColor;
  };

  defineProps<CellRenderProps<RowData, TagCellRenderProps>>();
</script>

<template>
  <div>component</div>
</template>

<style lang="scss" module></style>
