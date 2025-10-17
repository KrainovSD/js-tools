<script setup lang="ts">
  import { computed, useTemplateRef } from "vue";

  type Props = {
    left: number;
    height: number;
    interactive: boolean;
  };

  const props = defineProps<Props>();
  const element = useTemplateRef("today");

  const todayStyles = computed(() => ({
    left: `${props.left}px`,
  }));
  const todayClasses = computed(() => ({ interactive: props.interactive }));

  defineExpose({ element });
</script>

<template>
  <div ref="today" class="ksd-gantt__today" :class="todayClasses" :style="todayStyles">
    <div class="ksd-gantt__today-trigger"></div>
  </div>
</template>

<style lang="scss">
  .ksd-gantt {
    &__today {
      display: flex;
      width: 1px;
      min-width: 1px;
      overflow: visible;
      position: absolute;
      height: 100%;
      z-index: 6;

      &.interactive {
        cursor: col-resize;
      }
    }

    &__today-trigger {
      position: absolute;
      border-right: 1px var(--ksd-table-gantt-today-line-type) var(--ksd-table-gantt-today-color);
      width: 1px;
      height: 100%;
      top: 0;
      left: 0;
      &::before {
        content: "";
        position: absolute;
        inset: -10px;
      }
    }
  }
</style>
