<script setup lang="ts" generic="RowData extends DefaultRow">
  import { computed } from "vue";
  import { VText } from "../../..";
  import { GANTT_MAX_TEXT_WIDTH_SHIFT, GANTT_TOP_SHIFT } from "../../constants";
  import { extractGanttLinkId } from "../../lib";
  import type {
    DefaultRow,
    GanttInfo,
    GanttRowInfo,
    GanttTaskArrowInfo,
    RowInterface,
  } from "../../types";
  import GanttGraphTooltip from "./GanttGraphTooltip.vue";

  type Props = {
    rowsMap: Record<string, GanttRowInfo | undefined>;
    bodyWidth: number | null;
    row: RowInterface<GanttInfo<RowData>>;
  };

  const props = defineProps<Props>();
  defineEmits<{ click: [row: RowInterface<GanttInfo<RowData>>, event: MouseEvent] }>();

  const start = computed(() => new Date(props.row.original.start));
  const end = computed(() => new Date(props.row.original.end));
  const duration = computed(
    () => (end.value.getTime() - start.value.getTime()) / (1000 * 60 * 60 * 24),
  );
  const rowInfo = computed(() => props.rowsMap[props.row.original.id]);
  const arrows = computed<GanttTaskArrowInfo>(() => {
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
    marginBlockStart:
      arrows.value.down && !arrows.value.up
        ? "-10px"
        : arrows.value.up && !arrows.value.down
          ? "10px"
          : undefined,
  }));

  function onKeyDown(event: KeyboardEvent) {
    const target = event.target as HTMLDivElement;
    const currentTarget = event.currentTarget as HTMLDivElement;

    if ((event.key === " " || event.key === "Enter") && target === currentTarget) {
      event.preventDefault();
      currentTarget.click();
    }
  }
</script>

<template>
  <div
    class="ksd-gantt-graph__cell"
    :style="cellStyles"
    tabindex="0"
    role="button"
    @click="(event) => $emit('click', $props.row, event)"
    @keydown="onKeyDown"
  >
    <GanttGraphTooltip
      v-if="rowInfo && !$slots['graphCell']"
      :duration="duration"
      :row="$props.row.original"
    >
      <div class="ksd-gantt-graph__task-container">
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
      </div>
    </GanttGraphTooltip>
    <slot
      v-if="rowInfo && $slots['graphCell']"
      name="graphCell"
      :row-info="rowInfo"
      :arrows="arrows"
      :max-text-width="maxTextWidth"
      :duration="duration"
      :row="$props.row"
      :body-width="bodyWidth"
    ></slot>
  </div>
</template>

<style lang="scss">
  .ksd-gantt-graph {
    &__cell {
      display: flex;
      position: absolute;
      z-index: 5;
      cursor: pointer;
      border-radius: var(--ksd-border-radius);

      &:focus-visible {
        outline: var(--ksd-outline-width) var(--ksd-outline-type) var(--ksd-outline-color);
        outline-offset: 1px;
        transition:
          outline-offset 0s,
          outline 0s;
      }
    }

    &__task-container {
      display: flex;
    }

    &__task {
      display: flex;
      border-radius: 4px;
      position: relative;
      align-items: center;
      width: 100%;
      z-index: 5;

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
