<script setup lang="ts">
  import { computed, useTemplateRef } from "vue";

  type Props = {
    left: number;
    height: number;
    dragging: boolean;
  };

  const props = defineProps<Props>();
  const splitterRef = useTemplateRef("splitter");
  const ghostRef = useTemplateRef("ghost");
  const overlayRef = useTemplateRef("overlay");

  const splitterStyles = computed(() => ({
    height: `${props.height}px`,
  }));

  defineExpose({
    splitterElement: splitterRef,
    ghostElement: ghostRef,
    overlayElement: overlayRef,
  });
</script>

<template>
  <div
    ref="splitter"
    class="ksd-gantt__splitter"
    :style="[splitterStyles, { left: `${$props.left}px` }]"
  >
    <div class="ksd-gantt__splitter-trigger"></div>
    <div ref="ghost" class="ksd-gantt__splitter-ghost"></div>
  </div>
  <div
    class="ksd-gantt__splitter-overlay-container"
    :class="{ visible: $props.dragging }"
    :style="splitterStyles"
  >
    <div ref="overlay" class="ksd-gantt__splitter-overlay"></div>
  </div>
</template>

<style lang="scss">
  .ksd-gantt {
    &__splitter {
      display: flex;
      margin-right: -1px;
      width: 1px;
      min-width: 1px;
      overflow: visible;
      cursor: col-resize;
      background-color: var(--ksd-table-border);
      position: absolute;
      top: 0;
      z-index: 9;
    }
    &__splitter-trigger {
      position: absolute;
      width: 12px;
      height: 100%;
      margin-left: -2px;
      top: 0;
      left: 0;
    }
    &__splitter-ghost {
      background: var(--ksd-table-splitter-ghost-color);
      width: 1px;
      height: 100%;
      position: absolute;
      visibility: hidden;
    }
    &__splitter-overlay-container {
      position: relative;
      top: 0px;
      left: 0px;
      width: 0px;
      z-index: 8;
      display: none;

      &.visible {
        display: flex;
      }
    }
    &__splitter-overlay {
      position: absolute;
      width: 100%;
      height: 100%;
      background-color: var(--ksd-table-splitter-overlay-color);
    }
  }
</style>
