<script setup lang="ts" generic="RowData extends DefaultRow">
  import type { CellRenderProps, DefaultRow } from "../../types";

  export type SelectCellRenderProps = {
    Check?: (props: {
      checked: boolean;
      onChange: React.ChangeEventHandler<HTMLInputElement>;
    }) => React.ReactNode;
    hover?: boolean;
  };

  defineProps<CellRenderProps<RowData, SelectCellRenderProps>>();
</script>

<template>
  <div>component</div>
</template>

<style lang="scss" module></style>
