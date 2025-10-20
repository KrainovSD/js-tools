<script setup lang="ts" generic="RowData extends DefaultRow">
  import type { SelectItem } from "../../../ui";
  import type { DefaultRow, FilterRenderProps } from "../../../ui/Table/types";

  type Props = {
    options?: SelectItem<number>[];
  };

  defineProps<FilterRenderProps<RowData, Props>>();
</script>

<template>
  <div>filter select</div>
</template>

<style lang="scss" module></style>
