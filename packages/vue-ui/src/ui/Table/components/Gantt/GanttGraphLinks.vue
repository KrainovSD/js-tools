<script setup lang="ts" generic="RowData extends DefaultRow">
  import type { VirtualItem } from "@tanstack/vue-virtual";
  import { computed } from "vue";
  import { SegmentTree, extractGanttLinkId, getGanttRowHeight } from "../../lib";
  import type {
    DefaultRow,
    GanttInfo,
    GanttLinkDrawInstruction,
    GanttLinkStyleGetter,
    GanttRowInfo,
    GanttRowLinks,
    GanttSize,
    RowInterface,
  } from "../../types";
  import GanttGraphLinkDown from "./GanttGraphLinkDown.vue";
  import GanttGraphLinkUp from "./GanttGraphLinkUp.vue";

  type Props = {
    ganttLinkStyleGetter: GanttLinkStyleGetter<RowData> | undefined;
    rows: RowInterface<GanttInfo<RowData>>[];
    rowsVirtual: VirtualItem[];
    rowVirtualEnabled: boolean;
    ganttLinkGetAround: boolean;
    ganttLinkVisibleInRange: boolean;
    ganttSize: GanttSize;
    rowsMap: Record<string, GanttRowInfo | undefined>;
  };

  const GANTT_LINK_TOP_SHIFT_LG = -1;
  const GANTT_LINK_TOP_SHIFT_SM = -2;

  const GANTT_LINK_DEFAULT_SIZE = 2;
  const GANTT_LINK_CORNER_DEFAULT_SIZE = 4;
  const GANTT_LINK_ARROW_DEFAULT_SIZE = 16;

  const GANTT_LINK_LEFT_TO_RIGHT_FIRST = 22;
  const GANTT_LINK_TOP_TO_BOTTOM_EXTRA_LG = 25;
  const GANTT_LINK_TOP_TO_BOTTOM_EXTRA_SM = 13;

  const GANTT_LINK_LEFT_TO_RIGHT_SECOND_DEFAULT = 22;

  const GANTT_LINK_END_ARROW_SHIFT = -8;
  const GANTT_LINK_TOP_ARROW_SHIFT = 1;
  const GANTT_LINK_LEFT_SHIFT = 2;
  const props = defineProps<Props>();

  const topShift = computed(() => {
    switch (props.ganttSize) {
      case "sm": {
        return GANTT_LINK_TOP_SHIFT_SM;
      }
      case "lg": {
        return GANTT_LINK_TOP_SHIFT_LG;
      }
      default: {
        return GANTT_LINK_TOP_SHIFT_SM;
      }
    }
  });
  const topToBottomExtra = computed(() => {
    switch (props.ganttSize) {
      case "sm": {
        return GANTT_LINK_TOP_TO_BOTTOM_EXTRA_SM;
      }
      case "lg": {
        return GANTT_LINK_TOP_TO_BOTTOM_EXTRA_LG;
      }
      default: {
        return GANTT_LINK_TOP_TO_BOTTOM_EXTRA_SM;
      }
    }
  });
  const rowHeight = computed(() => getGanttRowHeight(props.ganttSize));

  const rowsLinks = computed<GanttRowLinks[]>(() => {
    let segmentTree: SegmentTree | undefined;
    if (props.ganttLinkGetAround) {
      segmentTree = new SegmentTree(
        props.rows.map((row) => props.rowsMap[row.original.id]?.left ?? 0),
      );
    }

    return props.rows.reduce((rowLinks: GanttRowLinks[], row, index) => {
      const rowInfo = props.rowsMap[row.original.id];
      if (
        row.original.links == undefined ||
        row.original.links.length === 0 ||
        rowInfo == undefined
      )
        return rowLinks;

      const top = rowInfo.top + topShift.value;
      const left = rowInfo.left + rowInfo.width - GANTT_LINK_LEFT_SHIFT;

      const links: GanttLinkDrawInstruction[] = [];
      for (let i = 0; i < row.original.links.length; i++) {
        const link = row.original.links[i];
        const dependentRowInfo = props.rowsMap[extractGanttLinkId(link)];
        if (!dependentRowInfo) continue;

        let minLeft = dependentRowInfo.left;
        if (segmentTree) {
          minLeft = Math.min(
            minLeft,
            segmentTree.findLeast(
              Math.min(rowInfo.index, dependentRowInfo.index),
              Math.max(rowInfo.index, dependentRowInfo.index),
            ),
          );
        }

        const diff = dependentRowInfo.index - rowInfo.index;
        const left = rowInfo.left + rowInfo.width - GANTT_LINK_LEFT_SHIFT;
        const {
          color,
          size = GANTT_LINK_DEFAULT_SIZE,
          arrowSize = GANTT_LINK_ARROW_DEFAULT_SIZE,
          cornerSize = GANTT_LINK_CORNER_DEFAULT_SIZE,
        } = props.ganttLinkStyleGetter?.(row.original, link) ?? {};
        const endOfLink =
          left +
          GANTT_LINK_LEFT_TO_RIGHT_FIRST +
          GANTT_LINK_CORNER_DEFAULT_SIZE +
          GANTT_LINK_LEFT_TO_RIGHT_SECOND_DEFAULT;
        const extraCorner = minLeft < endOfLink;

        const rightToLeft = endOfLink - minLeft;
        let topToBottom = Math.abs(diff * rowHeight.value) - GANTT_LINK_CORNER_DEFAULT_SIZE * 2;
        if (extraCorner) {
          topToBottom -= topToBottomExtra.value + GANTT_LINK_CORNER_DEFAULT_SIZE * 2;
        }

        const leftToRightSecond = extraCorner
          ? dependentRowInfo.left -
            (left + GANTT_LINK_LEFT_TO_RIGHT_FIRST - rightToLeft - GANTT_LINK_CORNER_DEFAULT_SIZE) -
            GANTT_LINK_CORNER_DEFAULT_SIZE +
            GANTT_LINK_END_ARROW_SHIFT
          : dependentRowInfo.left -
            left -
            GANTT_LINK_LEFT_TO_RIGHT_FIRST -
            GANTT_LINK_CORNER_DEFAULT_SIZE * 2 +
            GANTT_LINK_END_ARROW_SHIFT;

        links.push({
          id: dependentRowInfo.index.toString(),
          dependentIndex: dependentRowInfo.index,
          arrowSize,
          color,
          size,
          cornerSize,
          extraCorner,
          leftToRightFirst: GANTT_LINK_LEFT_TO_RIGHT_FIRST,
          leftToRightSecond,
          rightToLeft,
          topArrowShift: GANTT_LINK_TOP_ARROW_SHIFT,
          topToBottom,
          topToBottomExtra: topToBottomExtra.value,
          position: diff > 0 ? "down" : "up",
        });
      }
      rowLinks.push({ index, left, top, links });

      return rowLinks;
    }, []);
  });
  const minRowIndex = computed(() =>
    !props.rowVirtualEnabled ? 0 : (props.rowsVirtual[0]?.index ?? 0),
  );
  const maxRowIndex = computed(() =>
    !props.rowVirtualEnabled
      ? props.rows.length - 1
      : (props.rowsVirtual[props.rowsVirtual.length - 1]?.index ?? 0),
  );
  const filteredRows = computed(() => {
    const filterRows: GanttRowLinks[] = [];

    for (let i = 0; i < rowsLinks.value.length; i++) {
      const rowLinks = rowsLinks.value[i];
      if (
        !props.ganttLinkVisibleInRange &&
        (rowLinks.index < minRowIndex.value || maxRowIndex.value < rowLinks.index)
      ) {
        continue;
      }
      const links: GanttLinkDrawInstruction[] = [];

      for (let i = 0; i < rowLinks.links.length; i++) {
        const link = rowLinks.links[i];
        if (
          props.ganttLinkVisibleInRange &&
          ((rowLinks.index < minRowIndex.value && link.dependentIndex < minRowIndex.value) ||
            (maxRowIndex.value < rowLinks.index && maxRowIndex.value < link.dependentIndex))
        ) {
          continue;
        }

        links.push(link);
      }
      filterRows.push({ ...rowLinks, links });
    }

    return filterRows;
  });
</script>

<template>
  <div
    v-for="rowLinks in filteredRows"
    :key="rowLinks.index"
    class="ksd-gantt-graph__link-container"
    :style="{
      top: `${rowLinks.top}px`,
      left: `${rowLinks.left}px`,
    }"
  >
    <template v-for="link in rowLinks.links" :key="link.id">
      <GanttGraphLinkUp v-if="link.position === 'up'" :link="link" />
      <GanttGraphLinkDown v-if="link.position === 'down'" :link="link" />
    </template>
  </div>
</template>

<style lang="scss">
  .ksd-gantt-graph__link-container {
    position: absolute;
    z-index: 3;
  }
</style>
