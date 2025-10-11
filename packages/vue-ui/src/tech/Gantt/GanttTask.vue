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
  const textCommonStyles = computed(() => ({
    top: `${props.rowInfo?.textTop}px`,
  }));

  const taskClasses = computed(() => ({
    [styles.group]: props.row.original.type === "group",
    [styles.milestone]: props.row.original.type === "milestone",
    [styles.task]: props.row.original.type !== "group" && props.row.original.type !== "milestone",
  }));

  const taskStyles = computed(() =>
    props.rowInfo
      ? {
          top: `${props.rowInfo.taskTop}px`,
          height: `${props.rowInfo.taskHeight}px`,
          width: `${props.rowInfo.taskWidth}px`,
          minWidth: `${props.rowInfo.taskWidth}px`,
          maxWidth: `${props.rowInfo.taskWidth}px`,
        }
      : undefined,
  );
  const actualPast = computed(() =>
    Math.max(0, props.todayShift - (props.rowInfo?.actualLeft ?? 0)),
  );

  const actualTaskStyles = computed(() =>
    props.rowInfo
      ? {
          left: `${props.rowInfo.actualLeft - props.rowInfo.cellLeft}px`,
          top: `${props.rowInfo.actualTop}px`,
          height: `${props.rowInfo.actualHeight}px`,
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
        <VText
          v-if="rowInfo.textWidth <= rowInfo.taskWidth"
          :ellipsis="true"
          :class="$style.name"
          :style="textCommonStyles"
        >
          {{ $props.row.original.name }}
        </VText>
      </div>
      <VText
        v-if="rowInfo.textWidth > rowInfo.taskWidth"
        :class="$style.name"
        :style="[textStyles, textCommonStyles]"
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
    position: relative;
    transform: translateY(-50%);
  }
</style>
