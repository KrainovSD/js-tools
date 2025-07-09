<script setup lang="ts" generic="RowData extends DefaultRow">
  import type { CellContext, CellRenderProps, DefaultRow } from "../../types";

  export type DefaultCellRenderProps<RowData extends DefaultRow> = {
    arraySeparator?: string;
    objectPath?: string;
    mappings?: Record<string, string | number | React.ReactNode>;
    Link?: (props: {
      children?: React.ReactNode;
      context: CellContext<RowData>;
    }) => React.ReactNode | null;
    floatRound?: boolean;
    floatFixed?: number;
    dateFormat?: string;
    customContent?: (context: CellContext<RowData>) => string | number | boolean;
  };

  defineProps<CellRenderProps<RowData, DefaultCellRenderProps<RowData>>>();
</script>

<template>
  <div>component</div>
</template>

<style lang="scss" module></style>
