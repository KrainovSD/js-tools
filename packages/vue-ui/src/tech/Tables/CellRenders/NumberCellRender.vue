<script setup lang="ts" generic="RowData extends DefaultRow">
  import { isNullable } from "@krainovsd/js-helpers";
  import { computed } from "vue";
  import type { CellRenderProps, DefaultRow } from "../../../ui/Table/types";

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
    {{ checkedContent.toFixed(props.settings.fixed) }}
  </div>
</template>

<style lang="scss" module></style>
