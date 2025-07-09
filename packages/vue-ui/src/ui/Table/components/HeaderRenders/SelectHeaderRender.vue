<script setup lang="ts" generic="RowData extends DefaultRow">
  import type { DefaultRow, HeaderRenderProps } from "../../types";

  export type SelectHeaderRenderProps = {
    Check?: (props: {
      checked: boolean;
      onChange: React.ChangeEventHandler<HTMLInputElement>;
    }) => React.ReactNode;
  };

  defineProps<HeaderRenderProps<RowData, SelectHeaderRenderProps>>();
</script>

<template>
  <div>component</div>
</template>

<style lang="scss" module></style>
