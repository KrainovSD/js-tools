<script setup lang="ts">
  import { computed, useCssModule } from "vue";
  import { type GanttTaskProps, VText } from "../../ui";
  import GanttGraphTooltip from "./GanttGraphTooltip.vue";
  import type { RowData } from "./types";

  const props = defineProps<GanttTaskProps<RowData>>();
  const styles = useCssModule();
  const textStyles = computed(() => ({
    maxWidth: props.maxTextWidth ? `${props.maxTextWidth}px` : undefined,
    marginInlineStart: props.arrows.up && props.arrows.down ? "30px" : "10px",
    marginBlockStart:
      props.arrows.down && !props.arrows.up
        ? "-10px"
        : props.arrows.up && !props.arrows.down
          ? "10px"
          : undefined,
  }));

  const taskClasses = computed(() => ({
    [styles.group]: props.row.original.type === "group",
    [styles.milestone]: props.row.original.type === "milestone",
    [styles.task]: props.row.original.type !== "group" && props.row.original.type !== "milestone",
  }));

  const taskStyles = computed(() =>
    props.rowInfo
      ? {
          top: props.row.original.type === "milestone" ? "25%" : "50%",
          height: `${props.rowHeight / 2}px`,
          width: `${props.row.original.type === "milestone" ? props.rowHeight / 2 : props.rowInfo.width}px`,
          minWidth: `${props.row.original.type === "milestone" ? props.rowHeight / 2 : props.rowInfo.width}px`,
          maxWidth: `${props.row.original.type === "milestone" ? props.rowHeight / 2 : props.rowInfo.width}px`,
        }
      : undefined,
  );
  const actualPast = computed(() =>
    Math.max(0, props.todayShift - (props.rowInfo?.actualLeft ?? 0)),
  );

  const actualTaskStyles = computed(() =>
    props.rowInfo
      ? {
          left: `${props.rowInfo.actualLeft - props.rowInfo.left}px`,
          top: `${props.rowHeight / 2 + props.rowHeight / 4}px`,
          height: `${props.rowHeight / 6}px`,
          width: `${props.rowInfo.actualWidth}px`,
          minWidth: `${props.rowInfo.actualWidth}px`,
          maxWidth: `${props.rowInfo.actualWidth}px`,
        }
      : undefined,
  );
  const pastTaskStyle = computed(() => ({ width: `${actualPast.value}px` }));
</script>

<template>
  <GanttGraphTooltip v-if="rowInfo" :duration="duration" :row="$props.row.original">
    <div :class="$style.container">
      <div
        v-if="rowInfo.actualLeft != 0 && rowInfo.actualWidth != 0"
        :class="$style.taskActual"
        :style="actualTaskStyles"
      >
        <div :class="$style.taskActual_past" :style="pastTaskStyle"></div>
        <div :class="$style.taskActual_future"></div>
      </div>
      <div :class="[$style.taskItem, taskClasses]" :style="taskStyles">
        <VText v-if="rowInfo.textWidth <= rowInfo.width" :ellipsis="true" :class="$style.name">
          {{ $props.row.original.name }}
        </VText>
      </div>
      <VText
        v-if="rowInfo.textWidth > rowInfo.width"
        :class="$style.name"
        :style="textStyles"
        :ellipsis="true"
      >
        {{ $props.row.original.name }}
      </VText>
    </div>
  </GanttGraphTooltip>
</template>

<style lang="scss" module>
  .container {
    display: flex;
  }

  .taskActual {
    position: absolute;
    display: flex;
    transform: translateY(-50%);
    z-index: 6;

    &_past {
      background-color: var(--ksd-table-gantt-actual-task-past-color);
    }
    &_future {
      flex: 1;
      background-color: var(--ksd-table-gantt-actual-task-future-color);
    }
  }

  .taskItem {
    display: flex;
    border-radius: 4px;
    position: relative;
    align-items: center;
    width: 100%;
    z-index: 5;
    transform: translateY(-50%);

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

  .name {
    margin-inline-end: 10px;
    margin-inline-start: 10px;
    height: fit-content;
    top: 50%;
    position: relative;
    transform: translateY(-50%);
  }
</style>
