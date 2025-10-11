<script setup lang="ts" generic="RowData extends DefaultRow">
  import type { VirtualItem, Virtualizer } from "@tanstack/vue-virtual";
  import { type Component, computed, ref, useTemplateRef, watch } from "vue";
  import { GANTT_HEADER_HEIGHT } from "../../constants";
  import { getGanttRowHeight, useGanttScroll, useGanttSplitter } from "../../lib";
  import type {
    DefaultRow,
    GanttDate,
    GanttInfo,
    GanttLinkStyleGetter,
    GanttRowInfoGetter,
    GanttSize,
    GanttViewType,
    HeaderGroupInterface,
    RowInterface,
    TableEmptyProps,
    TableInterface,
  } from "../../types";
  import GanttGraph from "./GanttGraph.vue";
  import GanttScroll from "./GanttScroll.vue";
  import GanttSplitter from "./GanttSplitter.vue";
  import GanttTable from "./GanttTable.vue";

  type Props = {
    ganttIntervalDate: GanttDate | undefined;
    ganttSize: GanttSize;
    ganttGraphGrid: boolean;
    ganttSplitterInstant: boolean;
    ganttLinkGetAround: boolean;
    ganttLinkVisibleInRange: boolean;
    ganttLinkHighlight: boolean;
    ganttView: GanttViewType;
    ganttToday: boolean;
    ganttTodayInteractive: boolean;
    ganttRowInfoGetter: GanttRowInfoGetter | undefined;

    locale: string | undefined;
    ganttLinkStyleGetter: GanttLinkStyleGetter<RowData> | undefined;
    fullSize: boolean;

    columnVirtualEnabled: boolean;
    rowVirtualEnabled: boolean;
    columnsVirtual: VirtualItem[];
    rowVirtualizer: Virtualizer<HTMLDivElement, HTMLElement>;
    rowsVirtual: VirtualItem[];
    frozenHeader: boolean;
    rubberColumn: boolean;
    draggableRow: boolean;
    rows: RowInterface<GanttInfo<RowData>>[];
    table: TableInterface<GanttInfo<RowData>>;
    rowClassName:
      | ((row: RowInterface<GanttInfo<RowData>>) => string | undefined)
      | string
      | undefined;
    headerRowClassName:
      | ((header: HeaderGroupInterface<GanttInfo<RowData>>) => string | undefined)
      | string
      | undefined;

    canDropToRow: ((dropId: string) => boolean | undefined) | undefined;
    Row: ((row: RowInterface<GanttInfo<RowData>>) => Component | undefined) | undefined;
    Empty: Component<TableEmptyProps> | undefined;
  };
  type Emits = {
    dragRow: [sourceId: string, targetId: string];
    click: [row: RowInterface<GanttInfo<RowData>>, event: MouseEvent];
    dblclick: [row: RowInterface<GanttInfo<RowData>>, event: MouseEvent];
    graphTaskClick: [row: RowInterface<GanttInfo<RowData>>, event: MouseEvent];
  };

  const props = defineProps<Props>();
  defineEmits<Emits>();

  const headerHeight = computed(() => {
    switch (props.ganttView) {
      case "months":
      case "years": {
        return GANTT_HEADER_HEIGHT * 2;
      }
      default: {
        return GANTT_HEADER_HEIGHT * 3;
      }
    }
  });
  const rowHeight = computed(() => {
    return getGanttRowHeight(props.ganttSize);
  });
  const graphToday = defineModel<string>("graphToday", {
    default: new Date().toISOString(),
  });
  const tableContainerElement = useTemplateRef("table-container");
  const tableComponent = useTemplateRef<{
    element: HTMLDivElement | null;
    defineRubberColumnSize: () => void;
  }>("gantt-table");
  const tableElement = computed(() => tableComponent.value?.element);
  const defineRubberColumnSize = computed(() => tableComponent.value?.defineRubberColumnSize);

  const graphComponent = useTemplateRef("gantt-graph");
  const graphElement = computed(() => graphComponent.value?.element);

  const splitterHeight = ref(0);
  const containerHeight = ref(0);

  const ganttScrollElement = useTemplateRef("gantt-scroll");
  const tableScrollElement = computed(() => ganttScrollElement.value?.tableScrollElement);
  const graphScrollElement = computed(() => ganttScrollElement.value?.graphScrollElement);

  const splitterComponentRef = useTemplateRef("splitter");
  const splitterRef = computed(() => splitterComponentRef.value?.splitterElement);
  const ghostRef = computed(() => splitterComponentRef.value?.ghostElement);
  const overlayRef = computed(() => splitterComponentRef.value?.overlayElement);

  const { getGraphScroll, updateGraphScroll } = useGanttScroll({
    graphElement,
    graphScrollElement,
    tableElement,
    tableScrollElement,
  });

  const instantSizing = computed(() => props.ganttSplitterInstant);
  const { dragging, sizes } = useGanttSplitter({
    ghost: ghostRef,
    overlay: overlayRef,
    splitter: splitterRef,
    instantSizing,
  });

  /** table height */
  watch(
    tableElement,
    (tableElement, _, clean) => {
      if (!tableElement) return;

      const observer = new ResizeObserver((entries) => {
        splitterHeight.value = entries[0].contentRect.height;
      });
      observer.observe(tableElement);
      clean(() => {
        observer.disconnect();
      });
    },
    { immediate: true },
  );
  /** container height */
  watch(
    tableContainerElement,
    (tableContainerElement, _, clean) => {
      if (!tableContainerElement) return;

      const observer = new ResizeObserver((entries) => {
        containerHeight.value = entries[0].contentRect.height;
      });
      observer.observe(tableContainerElement);
      clean(() => {
        observer.disconnect();
      });
    },
    { immediate: true },
  );

  defineExpose({ element: tableContainerElement, defineRubberColumnSize });
</script>

<template>
  <div ref="table-container" class="ksd-table__container gantt" :class="{ full: $props.fullSize }">
    <div class="ksd-gantt__container">
      <GanttTable
        ref="gantt-table"
        :column-virtual-enabled="$props.columnVirtualEnabled"
        :row-virtual-enabled="$props.rowVirtualEnabled"
        :columns-virtual="$props.columnsVirtual"
        :frozen-header="$props.frozenHeader"
        :rubber-column="$props.rubberColumn"
        :row-virtualizer="$props.rowVirtualizer"
        :rows="$props.rows"
        :table="$props.table"
        :row-class-name="$props.rowClassName"
        :-empty="$props.Empty"
        :-row="$props.Row"
        :draggable-row="$props.draggableRow"
        :header-row-class-name="$props.headerRowClassName"
        :rows-virtual="$props.rowsVirtual"
        :header-height="headerHeight"
        :can-drop-to-row="$props.canDropToRow"
        :gantt-size="$props.ganttSize"
        :width="sizes[0]"
        :row-height="rowHeight"
        @drag-row="
          (sid, tid) => {
            $emit('dragRow', sid, tid);
          }
        "
        @click="(row, event) => $emit('click', row, event)"
        @dblclick="(row, event) => $emit('dblclick', row, event)"
      />
      <GanttSplitter
        ref="splitter"
        :dragging="dragging"
        :height="splitterHeight"
        :left="sizes[0]"
      />
      <GanttGraph
        ref="gantt-graph"
        v-model:graph-today="graphToday"
        :column-virtual-enabled="$props.columnVirtualEnabled"
        :columns-virtual="$props.columnsVirtual"
        :frozen-header="$props.frozenHeader"
        :gantt-graph-grid="$props.ganttGraphGrid"
        :gantt-interval-date="$props.ganttIntervalDate"
        :gantt-link-style-getter="$props.ganttLinkStyleGetter"
        :gantt-row-info-getter="$props.ganttRowInfoGetter"
        :gantt-size="$props.ganttSize"
        :gantt-view="$props.ganttView"
        :locale="$props.locale"
        :row-virtual-enabled="$props.rowVirtualEnabled"
        :row-virtualizer="$props.rowVirtualizer"
        :rows="$props.rows"
        :rows-virtual="$props.rowsVirtual"
        :table="$props.table"
        :width="sizes[1]"
        :row-height="rowHeight"
        :gantt-link-get-around="$props.ganttLinkGetAround"
        :gantt-link-visible-in-range="$props.ganttLinkVisibleInRange"
        :gantt-link-highlight="$props.ganttLinkHighlight"
        :gantt-today="$props.ganttToday"
        :gantt-today-interactive="$props.ganttTodayInteractive"
        :container-height="containerHeight"
        :get-graph-scroll="getGraphScroll"
        :update-graph-scroll="updateGraphScroll"
        @cell-click="(row, event) => $emit('graphTaskClick', row, event)"
      >
        <template v-if="$slots['graphCell']" #graphCell="graphCellProps">
          <slot name="graphCell" v-bind="graphCellProps"></slot>
        </template>
      </GanttGraph>
    </div>
  </div>
  <GanttScroll ref="gantt-scroll" :sizes="sizes" />
</template>

<style lang="scss">
  .ksd-gantt {
    &__container {
      display: flex;
      height: 100%;
    }
  }
</style>
