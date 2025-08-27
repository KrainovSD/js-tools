<script setup lang="ts" generic="RowData extends DefaultRow">
  import type {
    DefaultRow,
    GanttLinkStyleGetter,
    GanttRowInfo,
    GanttSize,
    RowInterface,
  } from "../../types";

  type Props = {
    ganttLinkStyleGetter: GanttLinkStyleGetter<RowData> | undefined;
    rowsMap: Record<string, GanttRowInfo | undefined>;
    bodyWidth: number | null;
    ganttSize: GanttSize;
    row: RowInterface<RowData>;
    rowHeight: number;
    arrowContainer: HTMLElement | null;
  };
  type Emits = {};

  const props = defineProps<Props>();
  const emit = defineEmits<Emits>();
</script>

<template>
  <div>component</div>
</template>

<style lang="scss" module></style>
