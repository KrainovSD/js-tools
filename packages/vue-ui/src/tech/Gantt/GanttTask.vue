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
          height: `${props.rowInfo.height}px`,
          width: `${props.rowInfo.width}px`,
          minWidth: `${props.rowInfo.width}px`,
          maxWidth: `${props.rowInfo.width}px`,
        }
      : undefined,
  );
</script>

<template>
  <GanttGraphTooltip
    v-if="rowInfo && !$slots['graphCell']"
    :duration="duration"
    :row="$props.row.original"
  >
    <div :class="$style.container">
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

  .taskItem {
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
      background-color: var(--ksd-error-color);
    }
  }

  .name {
    margin-inline-end: 10px;
    margin-inline-start: 10px;
  }
</style>
