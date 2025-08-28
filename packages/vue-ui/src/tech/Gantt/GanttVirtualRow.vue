<script setup lang="ts">
  import { shallowRef } from "vue";
  import Gantt from "../../ui/Table/Gantt.vue";
  import type { GanttInfo } from "../../ui/Table/types";
  import { COLUMNS } from "./columns";
  import { GANTT_EASY_ROWS } from "./rows";
  import type { RowData } from "./types";

  const rows = shallowRef<GanttInfo<RowData>[]>(GANTT_EASY_ROWS);
  const column = shallowRef<typeof COLUMNS>(COLUMNS);

  function getSubRows(row: GanttInfo<RowData>) {
    return row.children;
  }
</script>

<template>
  <Gantt
    :columns="column"
    :rows="rows"
    :virtual-rows="true"
    :full-size="false"
    :gantt="true"
    :initial-expanded="true"
    :expanded="true"
    :get-sub-rows="getSubRows"
    :gantt-splitter-instant="true"
    :gantt-view="'years'"
    :gantt-graph-grid="true"
  />
</template>

<style lang="scss"></style>
