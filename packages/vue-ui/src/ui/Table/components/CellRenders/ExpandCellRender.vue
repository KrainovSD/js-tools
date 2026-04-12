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
    class="ksd-table__cell-expand"
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

<style lang="scss">
  .ksd-table__cell {
    &:where(.common) {
      & .ksd-table__cell-expand {
        padding: 6px 8px;
        padding-left: calc(8px + var(--table-cell-shift, 0px));
        width: 100%;
        height: 100%;
        max-width: 100%;
        overflow: hidden;
        text-overflow: ellipsis;
        gap: 10px;
        display: flex;
      }
    }
    &:where(.hCenter) {
      & .ksd-table__cell-expand {
        height: 100%;
        align-items: center;
      }
    }
    &:where(.wCenter) {
      & .ksd-table__cell-expand {
        width: 100%;
        justify-content: center;
      }
    }
  }
</style>
