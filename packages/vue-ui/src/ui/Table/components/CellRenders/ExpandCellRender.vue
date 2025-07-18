<script setup lang="ts" generic="RowData extends DefaultRow">
  import { computed } from "vue";
  import type { CellRenderProps, DefaultRow } from "../../types";

  const props = defineProps<CellRenderProps<RowData>>();
  const isExpandable = computed(
    () => props.context.cell.row.getIsGrouped() || props.context.cell.row.getCanExpand(),
  );
  const Expander = computed(() => props.context.table.options.meta?.renderers?.expander);
  const isExpanded = computed(() => props.context.row.getIsExpanded());
</script>

<template>
  <div
    @click="
      (event) => {
        event.stopPropagation();
        props.context.row.toggleExpanded(!isExpanded);
      }
    "
    @dblclick="
      (event) => {
        event.stopPropagation();
      }
    "
  >
    <component :is="Expander" v-if="Expander && isExpandable" :context="$props.context" />
  </div>
</template>

<style lang="scss"></style>
