<script setup lang="ts">
  import { useTemplateRef } from "vue";

  type Props = {
    sizes: number[];
  };

  defineProps<Props>();
  const tableScrollRef = useTemplateRef("table-scroll");
  const graphScrollRef = useTemplateRef("graph-scroll");

  defineExpose({ tableScrollElement: tableScrollRef, graphScrollElement: graphScrollRef });
</script>

<template>
  <div class="ksd-gantt-scroll">
    <div
      ref="table-scroll"
      class="ksd-gantt-scroll__container"
      :style="{ width: `${$props.sizes[0]}px` }"
    >
      <div class="ksd-gantt-scroll__track">
        <div class="ksd-gantt-scroll__thumb">
          <div class="ksd-gantt-scroll__body"></div>
        </div>
      </div>
    </div>
    <div
      ref="graph-scroll"
      class="ksd-gantt-scroll__container"
      :style="{ width: `${$props.sizes[1]}px` }"
    >
      <div class="ksd-gantt-scroll__track">
        <div class="ksd-gantt-scroll__thumb">
          <div class="ksd-gantt-scroll__body"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
  .ksd-gantt-scroll {
    display: flex;
    background-color: var(--ksd-table-body-bg);
    border-right: 1px solid var(--ksd-table-border);
    border-left: 1px solid var(--ksd-table-border);

    &__container {
      width: 100%;
      height: 15px;
      border-radius: 6px;
      padding-left: 3px;

      /* &:first-child {
        .ksd-gantt-scroll__track {
          border-right: 1px solid var(--ksd-table-border);
        }
      } */
    }
    &__track {
      width: 100%;
      height: 100%;
      position: relative;
    }
    &__thumb {
      height: 4px;
      border-radius: 6px;
      position: absolute;
      left: 0;
      width: 100px;
      min-width: 10px;
      cursor: grab;
      display: none;
      padding: 7px 0;

      &:active {
        cursor: grabbing;
      }
    }
    &__body {
      background: var(--ksd-icon-color);
      width: 100%;
      height: 4px;
      border-radius: 6px;
    }
  }
</style>
