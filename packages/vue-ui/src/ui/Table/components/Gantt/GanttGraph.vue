<script setup lang="ts" generic="RowData extends DefaultRow">
  import type { VirtualItem, Virtualizer } from "@tanstack/vue-virtual";
  import { computed, ref, useTemplateRef } from "vue";
  import {
    GANTT_BODY_ID,
    GANTT_HEADER_HEIGHT,
    GANTT_HEADER_ID,
    GANTT_LEFT_SHIFT,
  } from "../../constants";
  import { getGanttColumnWidth } from "../../lib";
  import type {
    DefaultRow,
    GanttDate,
    GanttLinkStyleGetter,
    GanttSize,
    GanttViewType,
    RowInterface,
    TableInterface,
  } from "../../types";
  import GanttGraphHeaderRow from "./GanttGraphHeaderRow.vue";
  import GanttGraphRow from "./GanttGraphRow.vue";
  import GanttScroll from "./GanttScroll.vue";

  type Props = {
    width: number | undefined;
    ganttIntervalDate: GanttDate | undefined;
    ganttSize: GanttSize;
    ganttView: GanttViewType;
    ganttGraphGrid: boolean;
    locale: string | undefined;
    ganttLinkStyleGetter: GanttLinkStyleGetter<RowData> | undefined;

    rowHeight: number;
    columnsVirtual: VirtualItem[];
    rowsVirtual: VirtualItem[];
    rowVirtualizer: Virtualizer<HTMLDivElement, HTMLElement>;
    columnVirtualEnabled: boolean;
    rowVirtualEnabled: boolean;

    frozenHeader: boolean;
    rows: RowInterface<RowData>[];
    table: TableInterface<RowData>;
  };

  const props = defineProps<Props>();
  const ganttGraphElement = useTemplateRef("gantt-graph");
  const ganttGraphBodyElement = useTemplateRef("gantt-graph-body");

  const columnsCount = 1;
  const bodyWidth = ref<number | null>(null);
  const columnWidth = computed(() => getGanttColumnWidth(props.ganttView));
  const graphStyles = computed(() => ({ width: `${props.width}px` }));
  const headerStyles = { minHeight: `${GANTT_HEADER_HEIGHT * 2}px` };
  const bodyStyles = {
    height: props.rowVirtualizer ? `${props.rowVirtualizer.getTotalSize()}px` : undefined,
    width: `${columnsCount * columnWidth.value}px`,
  };
  const gridRender = computed(() => Array.from({ length: columnsCount }, (_, index) => index));

  defineExpose({ element: ganttGraphElement });
</script>

<template>
  <div ref="gantt-graph" class="ksd-gantt-graph" :style="graphStyles">
    <div
      :id="GANTT_HEADER_ID"
      class="ksd-gantt-graph__header-container"
      :class="{ frozen: $props.frozenHeader }"
    >
      <div class="ksd-gantt-graph__header" :style="headerStyles">
        <GanttGraphHeaderRow
          :header-items="[]"
          :column-width="columnWidth"
          :gantt-view="$props.ganttView"
          :locale="$props.locale"
        />
      </div>
    </div>
    <div :id="GANTT_BODY_ID" class="ksd-gantt-graph__body-container">
      <div ref="gantt-graph-body" class="ksd-gantt-graph__body" :style="bodyStyles">
        <template v-if="$props.rowVirtualEnabled">
          <GanttGraphRow
            v-for="virtualRow in $props.rowsVirtual"
            :key="virtualRow.index"
            :body-width="bodyWidth"
            :gantt-link-style-getter="$props.ganttLinkStyleGetter"
            :gantt-size="$props.ganttSize"
            :row="$props.rows[virtualRow.index]"
            :row-height="rowHeight"
            :rows-map="{}"
            :virtual-start="virtualRow.start"
            :arrow-container="ganttGraphBodyElement"
          />
        </template>
        <template v-if="!$props.rowVirtualEnabled">
          <GanttGraphRow
            v-for="row in $props.rows"
            :key="row.id"
            :body-width="bodyWidth"
            :gantt-link-style-getter="$props.ganttLinkStyleGetter"
            :gantt-size="$props.ganttSize"
            :row="row"
            :row-height="rowHeight"
            :rows-map="{}"
            :virtual-start="undefined"
            :arrow-container="ganttGraphBodyElement"
          />
        </template>
      </div>
    </div>
    <div
      v-for="index in gridRender"
      :key="index"
      class="ksd-gantt-graph__grid"
      :style="{ left: (index + 1) * columnWidth - GANTT_LEFT_SHIFT }"
    ></div>
    <GanttScroll />
  </div>
</template>

<style lang="scss">
  .ksd-gantt-graph {
    &__header-container {
      display: flex;
      flex-direction: column;
      overflow: hidden;

      &.frozen {
        position: sticky;
        top: 0;
        z-index: 5;
      }
    }
    &__header {
      display: flex;
      flex-direction: column;
      width: fit-content;
    }

    &__body-container {
      position: relative;
      display: flex;
      flex-direction: column;
      overflow: hidden;
    }
    &__body {
      position: relative;
      background-color: var(--ksd-table-body-bg);
      display: flex;
      flex-direction: column;
    }

    &__grid {
      width: 0;
      height: 100%;
      position: absolute;
      z-index: 1;
      background-color: var(--ksd-table-border);
      border-left: 1px solid var(--ksd-table-border);
    }
  }
</style>
