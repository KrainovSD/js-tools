<script setup lang="ts" generic="RowData extends DefaultRow">
  import { computed } from "vue";
  import { VText } from "../../..";
  import { GANTT_MAX_TEXT_WIDTH_SHIFT, GANTT_TOP_SHIFT } from "../../constants";
  import { extractGanttLinkId } from "../../lib";
  import type {
    DefaultRow,
    GanttInfo,
    GanttLinkStyleGetter,
    GanttRowInfo,
    GanttSize,
    RowInterface,
  } from "../../types";
  import GanttGraphLinks from "./GanttGraphLinks.vue";
  import GanttGraphTooltip from "./GanttGraphTooltip.vue";

  type Props = {
    ganttLinkStyleGetter: GanttLinkStyleGetter<RowData> | undefined;
    rowsMap: Record<string, GanttRowInfo | undefined>;
    bodyWidth: number | null;
    ganttSize: GanttSize;
    row: RowInterface<GanttInfo<RowData>>;
    rowHeight: number;
    arrowContainer: HTMLElement | null;
  };
  type ArrowInfo = {
    up: boolean;
    down: boolean;
  };

  const props = defineProps<Props>();

  const start = computed(() => new Date(props.row.original.start));
  const end = computed(() => new Date(props.row.original.end));
  const duration = computed(
    () => (end.value.getTime() - start.value.getTime()) / (1000 * 60 * 60 * 24),
  );
  const rowInfo = computed(() => props.rowsMap[props.row.original.id]);
  const arrows = computed<ArrowInfo>(() => {
    let up = false;
    let down = false;
    if (rowInfo.value == undefined) {
      return {
        down,
        up,
      };
    }

    if (props.row.original.links) {
      const linksLength = props.row.original.links.length;
      for (let i = 0; i < linksLength; i++) {
        if (up && down) break;

        const dependentRowInfo = props.rowsMap[extractGanttLinkId(props.row.original.links[i])];
        if (dependentRowInfo && rowInfo.value.index - dependentRowInfo.index > 0) {
          up = true;
        } else if (dependentRowInfo && rowInfo.value.index - dependentRowInfo.index < 0) {
          down = true;
        }
      }
    }

    return { down, up };
  });
  const maxTextWidth = computed(() => {
    if (
      rowInfo.value &&
      rowInfo.value.textWidth > rowInfo.value.width &&
      props.bodyWidth != undefined
    ) {
      return (
        props.bodyWidth - rowInfo.value.width - rowInfo.value.left - GANTT_MAX_TEXT_WIDTH_SHIFT
      );
    }

    return undefined;
  });
  const taskClasses = computed(() => ({
    group: props.row.original.type === "group",
    milestone: props.row.original.type === "milestone",
    task: props.row.original.type !== "group" && props.row.original.type !== "milestone",
  }));
  const taskStyles = computed(() =>
    rowInfo.value
      ? {
          height: `${rowInfo.value.height}px`,
          width: `${rowInfo.value.width}px`,
          minWidth: `${rowInfo.value.width}px`,
          maxWidth: `${rowInfo.value.width}px`,
        }
      : undefined,
  );
  const cellStyles = computed(() =>
    rowInfo.value
      ? {
          left: `${rowInfo.value.left}px`,
          top: `${rowInfo.value.top - rowInfo.value.height / 2 - GANTT_TOP_SHIFT}px`,
        }
      : undefined,
  );
  const textStyles = computed(() => ({
    maxWidth: maxTextWidth.value ? `${maxTextWidth.value}px` : undefined,
    marginInlineStart: arrows.value.up && arrows.value.down ? "30px" : "10px",
    marginBlockStart: arrows.value.down && !arrows.value.up ? "-8px" : "0px",
    marginBlockEnd: arrows.value.up && !arrows.value.down ? "-8px" : "0px",
  }));
</script>

<template>
  <div class="ksd-gantt-graph__cell" :style="cellStyles">
    <GanttGraphTooltip v-if="rowInfo" :duration="duration" :row="$props.row.original">
      <div class="ksd-gantt-graph__task" :class="taskClasses" :style="taskStyles">
        <VText
          v-if="rowInfo.textWidth <= rowInfo.width"
          :ellipsis="true"
          class="ksd-gantt-graph__task-name"
        >
          {{ $props.row.original.name }}
        </VText>
      </div>
      <VText
        v-if="rowInfo.textWidth > rowInfo.width"
        class="ksd-gantt-graph__task-name"
        :style="textStyles"
        :ellipsis="true"
      >
        {{ $props.row.original.name }}
      </VText>
    </GanttGraphTooltip>
  </div>
  <Teleport
    v-if="
      rowInfo &&
      $props.arrowContainer &&
      $props.row.original.links &&
      $props.row.original.links.length > 0
    "
    :to="$props.arrowContainer"
  >
    <GanttGraphLinks
      :gantt-link-style-getter="$props.ganttLinkStyleGetter"
      :gantt-size="$props.ganttSize"
      :row="$props.row.original"
      :rows-map="$props.rowsMap"
      :row-info="rowInfo"
    />
  </Teleport>
</template>

<style lang="scss">
  .ksd-gantt-graph {
    &__cell {
      display: flex;
      position: absolute;
      z-index: 4;
    }

    &__task {
      display: flex;
      border-radius: 4px;
      position: relative;
      align-items: center;
      width: 100%;
      z-index: 4;

      &.group {
        background-color: var(--ksd-table-gantt-group-color);
      }
      &.milestone {
        background-color: var(--ksd-table-gantt-milestone-color);

        transform: rotate(45deg);
        border-radius: 0;
        margin-left: 4px;
      }
      &.task {
        background-color: var(--ksd-table-gantt-task-color);
      }
    }

    &__task-name {
      margin-inline-end: 10px;
      margin-inline-start: 10px;
    }
  }
</style>
