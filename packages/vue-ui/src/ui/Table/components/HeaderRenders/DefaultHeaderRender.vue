<script setup lang="ts" generic="RowData extends DefaultRow">
  import { computed } from "vue";
  import type { DefaultRow, HeaderRenderProps } from "../../types";

  const props = defineProps<HeaderRenderProps<RowData, unknown>>();
  const SortRender = computed(() => props.context.column.columnDef.sortRender);
  const canSort = computed(() => props.context.column.getCanSort());
</script>

<template>
  <div>
    <span class="ksd-table__header-cell-default-text">{{
      props.context.column.columnDef.name
    }}</span>
    <component :is="SortRender" v-if="SortRender && canSort" :context="$props.context" />
  </div>
</template>

<style lang="scss">
  span.ksd-table__header-cell-default-text {
    display: block;
    max-width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
  }
</style>
