<script setup lang="ts" generic="RowData extends DefaultRow">
  import { computed } from "vue";
  import { extractGanttLinkId, getGanttRowHeight } from "../../lib";
  import type {
    DefaultRow,
    GanttInfo,
    GanttLinkDrawInstruction,
    GanttLinkStyleGetter,
    GanttRowInfo,
    GanttSize,
  } from "../../types";
  import GanttGraphLinkDown from "./GanttGraphLinkDown.vue";
  import GanttGraphLinkUp from "./GanttGraphLinkUp.vue";

  type Props = {
    ganttLinkStyleGetter: GanttLinkStyleGetter<RowData> | undefined;
    row: GanttInfo<RowData>;
    ganttSize: GanttSize;
    rowsMap: Record<string, GanttRowInfo | undefined>;
    rowInfo: GanttRowInfo;
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
  const containerStyles = computed(() => ({
    left: `${props.rowInfo.left + props.rowInfo.width - GANTT_LINK_LEFT_SHIFT}px`,
    top: `${props.rowInfo.top + topShift.value}px`,
  }));

  const props = defineProps<Props>();
  const links = computed<GanttLinkDrawInstruction[]>(
    () =>
      props.row.links?.reduce?.<GanttLinkDrawInstruction[]>((links, link) => {
        const dependentRowInfo = props.rowsMap[extractGanttLinkId(link)];
        if (!dependentRowInfo) return links;

        const diff = dependentRowInfo.index - props.rowInfo.index;
        const left = props.rowInfo.left + props.rowInfo.width - GANTT_LINK_LEFT_SHIFT;
        const {
          color,
          size = GANTT_LINK_DEFAULT_SIZE,
          arrowSize = GANTT_LINK_ARROW_DEFAULT_SIZE,
          cornerSize = GANTT_LINK_CORNER_DEFAULT_SIZE,
        } = props.ganttLinkStyleGetter?.(props.row, link) ?? {};
        const endOfLink =
          left +
          GANTT_LINK_LEFT_TO_RIGHT_FIRST +
          GANTT_LINK_CORNER_DEFAULT_SIZE +
          GANTT_LINK_LEFT_TO_RIGHT_SECOND_DEFAULT;
        const extraCorner = dependentRowInfo.left < endOfLink;

        const rightToLeft = endOfLink - dependentRowInfo.left;
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

        return links;
      }, []) ?? [],
  );
</script>

<template>
  <div class="ksd-gantt-graph__link-container" :style="containerStyles">
    <template v-for="link in links" :key="link.id">
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
