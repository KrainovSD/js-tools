<script setup lang="ts">
  import { isArray, isNumber } from "@krainovsd/js-helpers";
  import { computed, ref, useTemplateRef } from "vue";
  import { findClosestNumber } from "../lib";

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
  const elementRef = useTemplateRef("slider");
  const minHandleRef = useTemplateRef("min-handle");
  const maxHandleRef = useTemplateRef("max-handle");
  const commonClasses = computed(() => ({
    [props.vertical ? "vertical" : "horizontal"]: true,
    disabled: props.disabled,
  }));
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
  const step = computed(() =>
    Math.max(Math.max(1, min.value), Math.min(props.step ?? 1, max.value)),
  );
  const difference = computed(() => max.value - min.value);
  const minValue = computed(() => (isArray(model.value) ? model.value[0] : 0));
  const maxValue = computed(() =>
    isArray(model.value) ? model.value[1] : isNumber(model.value) ? model.value : 0,
  );
  const minHandle = computed(() => (!props.range ? 0 : (minValue.value * 100) / difference.value));
  const maxHandle = computed(() => (maxValue.value * 100) / difference.value);

  const trackStyles = computed(() => ({
    left: `${minHandle.value}%`,
    width: `${maxHandle.value - minHandle.value}%`,
  }));
  const minHandleStyles = computed(() => ({ left: `${minHandle.value}%` }));
  const maxHandleStyles = computed(() => ({
    left: `${maxHandle.value}%`,
  }));

  const controller = ref<AbortController | null>(null);

  function updateValue(clientX: number, clientY: number) {
    if (!elementRef.value) return;

    const rect = elementRef.value.getBoundingClientRect();
    let position = clientX - rect.left;
    position = Math.max(0, Math.min(position, rect.width));

    const shiftPercent = position / rect.width;
    const value =
      Math.round((min.value + shiftPercent * difference.value) / step.value) * step.value;

    if (props.range && isArray(model.value)) {
      const closestIndex = findClosestNumber(model.value, value);
      if (closestIndex < model.value.length) {
        model.value = model.value.toSpliced(closestIndex, 1, value);
        if (minHandleRef.value && maxHandleRef.value && document.activeElement) {
          if (closestIndex === 0 && document.activeElement !== minHandleRef.value) {
            minHandleRef.value.focus();
          } else if (closestIndex === 1 && document.activeElement !== maxHandleRef.value) {
            maxHandleRef.value.focus();
          }
        }
      }
    } else {
      model.value = value;
      if (
        document.activeElement &&
        maxHandleRef.value &&
        document.activeElement !== maxHandleRef.value
      ) {
        maxHandleRef.value.focus();
      }
    }
  }

  function processingDrag(event: MouseEvent | PointerEvent) {
    updateValue(event.clientX, event.clientY);
  }
  function endDrag() {
    if (controller.value) {
      controller.value.abort();
      controller.value = null;
    }
  }

  function startDrag(event: MouseEvent | PointerEvent) {
    if (controller.value) {
      controller.value.abort();
      controller.value = null;
    }

    if (props.disabled) return;
    event.preventDefault();

    const eventController = new AbortController();
    controller.value = eventController;

    document.addEventListener("mousemove", processingDrag, { signal: eventController.signal });
    document.addEventListener("mouseup", endDrag, { signal: eventController.signal });
    document.addEventListener("pointermove", processingDrag, { signal: eventController.signal });
    document.addEventListener("pointerup", endDrag, { signal: eventController.signal });

    updateValue(event.clientX, event.clientY);
  }

  defineExpose({ element: elementRef });
</script>

<template>
  <div
    ref="slider"
    class="ksd-slider"
    :class="commonClasses"
    @mousedown="startDrag"
    @pointerdown="startDrag"
  >
    <div class="ksd-slider__rail" :class="commonClasses"></div>
    <div class="ksd-slider__track" :class="commonClasses" :style="trackStyles"></div>
    <div
      v-if="$props.range"
      ref="min-handle"
      class="ksd-slider__handle"
      role="slider"
      tabindex="0"
      :aria-valuemin="min"
      :aria-valuemax="max"
      :area-orientation="$props.vertical ? 'vertical' : 'horizontal'"
      :area-valuenow="minValue"
      :area-disabled="$props.disabled"
      :class="commonClasses"
      :style="minHandleStyles"
    ></div>
    <div
      ref="max-handle"
      class="ksd-slider__handle"
      role="slider"
      tabindex="0"
      :aria-valuemin="min"
      :aria-valuemax="max"
      :area-orientation="$props.vertical ? 'vertical' : 'horizontal'"
      :area-valuenow="maxValue"
      :area-disabled="$props.disabled"
      :class="commonClasses"
      :style="maxHandleStyles"
    ></div>
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

    &.disabled {
      cursor: not-allowed;
    }

    &:not(.disabled):hover {
      & .ksd-slider__track {
        background-color: var(--ksd-slider-track-hover-bg);
      }
    }

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

    &__track {
      position: absolute;
      transition: background-color var(--ksd-transition-mid);
      background-color: var(--ksd-slider-track-bg);
      border-radius: var(--ksd-border-radius-xs);

      &.horizontal {
        height: var(--ksd-slider-rail-size);
      }

      &.disabled {
        background-color: var(--ksd-slider-track-bg-disabled);
      }
    }

    &__handle {
      position: absolute;
      width: var(--ksd-slider-handle-size);
      height: var(--ksd-slider-handle-size);
      outline: none;
      user-select: none;
      inset-block-start: calc(
        (var(--ksd-slider-rail-size) * 3 - var(--ksd-slider-handle-size)) / 2
      );

      &::after {
        content: "";
        position: absolute;
        inset-block-start: 0;
        inset-inline-start: 0;
        width: var(--ksd-slider-handle-size);
        height: var(--ksd-slider-handle-size);
        background-color: var(--ksd-bg-container-color);
        box-shadow: 0 0 0 var(--ksd-slider-handle-line-width) var(--ksd-slider-handle-color);
        outline: 0px solid transparent;
        border-radius: 50%;
        cursor: pointer;
        transition:
          inset-inline-start var(--ksd-transition-mid),
          inset-block-start var(--ksd-transition-mid),
          width var(--ksd-transition-mid),
          height var(--ksd-transition-mid),
          box-shadow var(--ksd-transition-mid),
          outline var(--ksd-transition-mid);
      }

      &::before {
        content: "";
        position: absolute;
        inset-inline-start: calc(var(--ksd-slider-handle-line-width) * -1);
        inset-block-start: calc(var(--ksd-slider-handle-line-width) * -1);
        width: calc(var(--ksd-slider-handle-size) + var(--ksd-slider-handle-line-width) * 2);
        height: calc(var(--ksd-slider-handle-size) + var(--ksd-slider-handle-line-width) * 2);
        background-color: transparent;
      }

      &:hover,
      &:focus {
        &::after {
          box-shadow: 0 0 0 var(--ksd-slider-handle-line-width-hover)
            var(--ksd-slider-handle-active-color);
          outline: 6px solid var(--ksd-slider-handle-active-outline-color);
          width: var(--ksd-slider-handle-size-hover);
          height: var(--ksd-slider-handle-size-hover);
          inset-inline-start: calc(
            (var(--ksd-slider-handle-size) - var(--ksd-slider-handle-size-hover)) / 2
          );
          inset-block-start: calc(
            (var(--ksd-slider-handle-size) - var(--ksd-slider-handle-size-hover)) / 2
          );
        }
        &::before {
          inset-inline-start: calc(
            (
                (var(--ksd-slider-handle-size-hover) - var(--ksd-slider-handle-size)) / 2 +
                  var(--ksd-slider-handle-line-width-hover)
              ) *
              -1
          );
          inset-block-start: calc(
            (
                (var(--ksd-slider-handle-size-hover) - var(--ksd-slider-handle-size)) / 2 +
                  var(--ksd-slider-handle-line-width-hover)
              ) *
              -1
          );
          width: calc(
            var(--ksd-slider-handle-size-hover) + var(--ksd-slider-handle-line-width-hover) * 2
          );
          height: calc(
            var(--ksd-slider-handle-size-hover) + var(--ksd-slider-handle-line-width-hover) * 2
          );
        }
      }

      &.disabled {
        &::after {
          background-color: var(--ksd-bg-container-color);
          cursor: not-allowed;
          width: var(--ksd-slider-handle-size);
          height: var(--ksd-slider-handle-size);
          box-shadow: 0 0 0 var(--ksd-slider-handle-line-width)
            var(--ksd-slider-handle-color-disabled);
          inset-inline-start: 0;
          inset-block-start: 0;
        }
      }

      &.horizontal {
        transform: translateX(-50%);
      }
    }
  }
</style>
