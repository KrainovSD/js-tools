<script setup lang="ts">
  import { dateFormat } from "@krainovsd/js-helpers";
  import { computed, useTemplateRef } from "vue";
  import Tooltip from "../../../Tooltip.vue";
  import { GANTT_HEADER_HEIGHT } from "../../constants";

  type Props = {
    left: number;
    height: number;
    interactive: boolean;
    dragging: boolean;
    dragDate: string | null;
  };

  const props = defineProps<Props>();
  const element = useTemplateRef("today");
  const todayContainerStyles = computed(() => ({
    left: `${props.left}px`,
    top: `${GANTT_HEADER_HEIGHT}px`,
  }));
  const todayStyles = computed(() => ({
    height: `${props.height - GANTT_HEADER_HEIGHT}px`,
  }));
  const todayClasses = computed(() => ({ interactive: props.interactive }));

  defineExpose({ element });
</script>

<template>
  <Tooltip
    :open-by-click="false"
    :open-by-focus="false"
    :open-by-hover="false"
    :placement="'top-center'"
    :observe="true"
    :show="$props.dragging && $props.dragDate != undefined"
    :text="dateFormat($props.dragDate ?? '', 'DD.MM.YYYY')"
  >
    <div class="ksd-gantt__today-container" :style="todayContainerStyles">
      <div ref="today" class="ksd-gantt__today" :class="todayClasses" :style="todayStyles">
        <svg
          width="16"
          height="27"
          viewBox="0 0 16 27"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          class="ksd-gantt__today-rectangle"
        >
          <path
            d="M0 4C0 1.79086 1.79086 0 4 0H12C14.2091 0 16 1.79086 16 4V20.5279C16 22.043 15.144 23.428 13.7889 24.1056L9.78885 26.1056C8.66274 26.6686 7.33726 26.6686 6.21115 26.1056L2.21114 24.1056C0.856009 23.428 0 22.043 0 20.5279V4Z"
            fill="var(--ksd-table-gantt-today-color)"
          />
        </svg>

        <div class="ksd-gantt__today-trigger"></div>
      </div>
    </div>
  </Tooltip>
</template>

<style lang="scss">
  .ksd-gantt {
    &__today-container {
      position: absolute;
      overflow: hidden;
      z-index: 8;
    }

    &__today {
      display: flex;
      width: 1px;
      min-width: 1px;
      overflow: visible;
      position: fixed;
      height: 100%;

      &.interactive {
        cursor: col-resize;
      }
    }
    &__today-rectangle {
      position: absolute;
      transform: translateX(-50%);
    }

    &__today-trigger {
      position: absolute;
      /* background-color: var(--ksd-table-gantt-today-color); */
      border-right: 1px dashed var(--ksd-table-gantt-today-color);
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
