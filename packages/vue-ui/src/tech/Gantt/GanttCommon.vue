<script setup lang="ts">
  import { nextTick, ref, shallowRef, useTemplateRef, watch } from "vue";
  import Button from "../../ui/Button.vue";
  import CheckBox from "../../ui/CheckBox.vue";
  import Gantt from "../../ui/Table/Gantt.vue";
  import type { ExpandedState, GanttInfo } from "../../ui/Table/types";
  import GanttTask from "./GanttTask.vue";
  import { COLUMNS } from "./columns";
  import { GANTT_EASY_ROWS } from "./rows";
  import type { RowData } from "./types";

  const tableComponentRef = useTemplateRef("table");
  const rows = shallowRef<GanttInfo<RowData>[]>(GANTT_EASY_ROWS);
  const column = shallowRef(COLUMNS);
  const expanded = shallowRef<ExpandedState>({});
  const fullSize = ref(true);

  function getSubRows(row: GanttInfo<RowData>) {
    return row.children;
  }
  function getRowId(row: GanttInfo<RowData>) {
    return row.id.toString();
  }

  function recursiveIterateRows(rows: GanttInfo<RowData>[], cb: (row: GanttInfo<RowData>) => void) {
    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];
      cb(row);

      if (row.children) {
        recursiveIterateRows(row.children, cb);
      }
    }
  }

  function expand() {
    const expandedRows: ExpandedState = {};

    recursiveIterateRows(rows.value, (row) => {
      expandedRows[row.id] = true;
    });

    expanded.value = expandedRows;
  }
  function unexpand() {
    const expandedRows: ExpandedState = {};

    recursiveIterateRows(rows.value, (row) => {
      expandedRows[row.id] = false;
    });

    expanded.value = expandedRows;
  }

  watch(
    () => rows,
    () => {
      void nextTick(() => {
        expand();
      });
    },
    { immediate: true },
  );

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
  <div :class="$style.base">
    <div :class="$style.upper">
      <Button @click="expand">Раскрыть</Button>
      <Button @click="unexpand">Закрыть</Button>
      <CheckBox v-model="fullSize"> Полный размер</CheckBox>
    </div>
    <Gantt
      ref="table"
      v-model:expanded="expanded"
      :columns="column"
      :rows="rows"
      :full-size="fullSize"
      :get-sub-rows="getSubRows"
      :get-row-id="getRowId"
      :gantt-splitter-instant="true"
      :gantt-view="'years'"
      :gantt-size="'small'"
      :gantt-graph-grid="true"
      :gantt-link-visible-in-range="true"
      :gantt-link-get-around="true"
      :gantt-link-highlight="true"
      :with-total="false"
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
  </div>
</template>

<style lang="scss" module>
  .base {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    gap: var(--ksd-padding);
  }

  .upper {
    display: flex;
    gap: var(--ksd-padding);
    align-items: center;
  }
</style>
