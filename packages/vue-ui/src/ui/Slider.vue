<script setup lang="ts">
  import { isArray, isNumber } from "@krainovsd/js-helpers";
  import { computed } from "vue";

  export type SlideProps = {
    min?: number;
    max?: number;
    step?: number;
    range?: boolean;
    disabled?: boolean;
    vertical?: boolean;
  };

  const props = defineProps<SlideProps>();
  const model = defineModel<number | number[]>();
  const rootClasses = computed(() => ({ [props.vertical ? "vertical" : "horizontal"]: true }));
  const railClasses = computed(() => ({ [props.vertical ? "vertical" : "horizontal"]: true }));
  const max = computed(() =>
    props.max != undefined
      ? props.min != undefined
        ? props.min > props.max
          ? props.min
          : props.max
        : props.max
      : (props.max ?? 100),
  );
  const min = computed(() =>
    props.min != undefined
      ? props.max != undefined
        ? props.max < props.min
          ? props.max
          : props.min
        : props.min
      : (props.min ?? 0),
  );
  const difference = computed(() => max.value - min.value);
  const leftValue = computed(() => (isArray(model.value) ? model.value[0] : 0));
  const rightValue = computed(() =>
    isArray(model.value) ? model.value[1] : isNumber(model.value) ? model.value : 0,
  );

  const leftHandle = computed(() =>
    !props.range ? 0 : (leftValue.value * 100) / difference.value,
  );
  const rightHandle = computed(() => (rightValue.value * 100) / difference.value);
</script>

<template>
  <div class="ksd-slider" :class="rootClasses">
    <div class="ksd-slider__rail" :class="railClasses"></div>
  </div>
</template>

<style lang="scss">
  .ksd-slider {
    box-sizing: border-box;
    padding: 0;
    color: var(--ksd-main-text-color);
    font-size: 1rem;
    line-height: var(--ksd-line-height);
    list-style: none;
    font-family: var(--ksd-font-family);
    position: relative;
    height: var(--ksd-slider-control-size);
    cursor: pointer;
    touch-action: none;

    &.horizontal {
      padding-block: var(--ksd-slider-rail-size);
      height: calc(var(--ksd-slider-rail-size) * 3);
    }

    &__rail {
      position: absolute;
      background-color: var(--ksd-slider-rail-bg);
      border-radius: var(--ksd-border-radius-xs);
      transition: background-color var(--ksd-transition-mid);

      &.horizontal {
        width: 100%;
        height: var(--ksd-slider-rail-size);
      }
    }
  }
</style>
