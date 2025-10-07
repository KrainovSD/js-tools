<script setup lang="ts">
  import { isNullable } from "@krainovsd/js-helpers";
  import { computed } from "vue";
  import type { CellRenderProps } from "../../../ui/Table/types";
  import type { RowData } from "../types";

  type Props = {
    fixed?: number;
  };

  const props = defineProps<CellRenderProps<RowData, Props>>();
  const content = computed(() =>
    props.context.column.accessorFn?.(props.context.row.original, props.context.row.index),
  );
  const checkedContent = computed(() => (isNullable(content.value) ? null : +content.value));
</script>

<template>
  <div v-if="checkedContent != undefined && !Number.isNaN(checkedContent)">
    {{ checkedContent.toFixed(props.settings?.fixed) }}
  </div>
</template>

<style lang="scss" module></style>
