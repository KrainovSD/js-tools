<script setup lang="ts">
  import { shallowRef, useTemplateRef, watch } from "vue";
  import Gantt from "../../ui/Table/Gantt.vue";
  import type { GanttInfo } from "../../ui/Table/types";
  import GanttTask from "./GanttTask.vue";
  import { COLUMNS } from "./columns";
  import { GANTT_EASY_ROWS } from "./rows";
  import type { RowData } from "./types";

  const tableComponentRef = useTemplateRef("table");
  const rows = shallowRef<GanttInfo<RowData>[]>(GANTT_EASY_ROWS);
  const column = shallowRef<typeof COLUMNS>(COLUMNS);

  function getSubRows(row: GanttInfo<RowData>) {
    return row.children;
  }

  watch(
    () => tableComponentRef.value?.element,
    (tableRef, _, clean) => {
      if (!tableRef) return;

      const resizeObserver = new ResizeObserver(() => {
        tableComponentRef.value?.defineRubberColumnSize?.();
      });
      resizeObserver.observe(tableRef);

      clean(() => {
        resizeObserver.disconnect();
      });
    },
    { immediate: true, flush: "post" },
  );
</script>

<template>
  <Gantt
    ref="table"
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
    :gantt-size="'sm'"
    :gantt-graph-grid="true"
    :gantt-link-visible-in-range="true"
    :gantt-link-get-around="true"
    :gantt-link-highlight="true"
    @graph-task-click="
      (row, event) => {
        console.log(row, event);
      }
    "
  >
    <template #graphCell="graphCellProps">
      <GanttTask v-bind="graphCellProps" />
    </template>
  </Gantt>
</template>

<style lang="scss"></style>
