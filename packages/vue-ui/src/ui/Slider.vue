<script setup lang="ts">
  import { isArray, isNumber } from "@krainovsd/js-helpers";
  import { computed, ref, shallowRef, useTemplateRef, watchEffect } from "vue";
  import { findClosestNumber } from "../lib";
  import Tooltip from "./Tooltip.vue";

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
  const sliderRef = useTemplateRef("slider");
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
  const step = computed(() => Math.max(0, props.step ?? 1));
  const stepRound = computed(() => {
    const stepString = step.value.toString();
    const decimalIndex = stepString.indexOf(".");

    return decimalIndex === -1 ? 0 : stepString.length - decimalIndex - 1;
  });

  const difference = computed(() => max.value - min.value);
  const minValue = computed(() => (isArray(model.value) ? model.value[0] : 0));
  const maxValue = computed(() =>
    isArray(model.value) ? model.value[1] : isNumber(model.value) ? model.value : 0,
  );
  const minHandle = computed(() =>
    !props.range ? 0 : ((minValue.value - min.value) / difference.value) * 100,
  );
  const maxHandle = computed(() => ((maxValue.value - min.value) / difference.value) * 100);

  const trackStyles = computed(() => ({
    left: !props.vertical ? `${minHandle.value}%` : undefined,
    bottom: props.vertical ? `${minHandle.value}%` : undefined,
    width: !props.vertical ? `${maxHandle.value - minHandle.value}%` : undefined,
    height: props.vertical ? `${maxHandle.value - minHandle.value}%` : undefined,
  }));
  const minHandleStyles = computed(() => ({
    left: !props.vertical ? `${minHandle.value}%` : undefined,
    bottom: props.vertical ? `${minHandle.value}%` : undefined,
    top: props.vertical ? "auto" : undefined,
  }));
  const maxHandleStyles = computed(() => ({
    left: !props.vertical ? `${maxHandle.value}%` : undefined,
    bottom: props.vertical ? `${maxHandle.value}%` : undefined,
    top: props.vertical ? "auto" : undefined,
  }));

  const controller = ref<AbortController | null>(null);
  const minHandleTooltipState = shallowRef({ focus: false, hover: false, move: false });
  const maxHandleTooltipState = shallowRef({ focus: false, hover: false, move: false });
  const minHandleTooltipOpen = computed(() =>
    Object.values(minHandleTooltipState.value).some((status) => status),
  );
  const maxHandleTooltipOpen = computed(() =>
    Object.values(maxHandleTooltipState.value).some((status) => status),
  );

  function updateValue(value: number, keyboard: boolean) {
    value = +value.toFixed(stepRound.value);

    if (props.range && isArray(model.value)) {
      const closestIndex = findClosestNumber(model.value, value);
      if (closestIndex < model.value.length) {
        model.value = model.value.toSpliced(closestIndex, 1, value);
        if (minHandleRef.value && maxHandleRef.value && document.activeElement) {
          if (closestIndex === 0 && !keyboard) {
            minHandleTooltipState.value = {
              ...minHandleTooltipState.value,
              move: true,
              focus: false,
            };
            maxHandleTooltipState.value = { ...maxHandleTooltipState.value, move: false };
          } else if (closestIndex === 1 && !keyboard) {
            minHandleTooltipState.value = { ...minHandleTooltipState.value, move: false };
            maxHandleTooltipState.value = {
              ...maxHandleTooltipState.value,
              move: true,
              focus: false,
            };
          }

          if (closestIndex === 0 && document.activeElement !== minHandleRef.value) {
            minHandleRef.value.focus();
          } else if (closestIndex === 1 && document.activeElement !== maxHandleRef.value) {
            maxHandleRef.value.focus();
          }
        }
      }
    } else {
      model.value = value;
      if (!keyboard) {
        maxHandleTooltipState.value = {
          ...maxHandleTooltipState.value,
          move: true,
          focus: false,
        };
      }

      if (
        document.activeElement &&
        maxHandleRef.value &&
        document.activeElement !== maxHandleRef.value
      ) {
        maxHandleRef.value.focus();
      }
    }
  }

  function processingValue(clientX: number, clientY: number) {
    if (!sliderRef.value) return;

    const rect = sliderRef.value.getBoundingClientRect();
    const size = props.vertical ? rect.height : rect.width;
    let position = props.vertical ? rect.bottom - clientY : clientX - rect.left;

    position = Math.max(0, Math.min(position, size));

    const shiftPercent = position / size;
    const value =
      Math.round((min.value + shiftPercent * difference.value) / step.value) * step.value;

    updateValue(Math.max(min.value, Math.min(value, max.value)), false);
  }

  function processingDrag(event: MouseEvent | PointerEvent) {
    processingValue(event.clientX, event.clientY);
  }

  function endDrag() {
    if (controller.value) {
      controller.value.abort();
      controller.value = null;

      minHandleTooltipState.value = { ...minHandleTooltipState.value, move: false };
      maxHandleTooltipState.value = { ...maxHandleTooltipState.value, move: false };
    }
  }

  function keyDown(event: KeyboardEvent) {
    const target = event.target as HTMLElement;
    const value = target.getAttribute("area-valuenow");
    const numberValue = value != undefined ? +value : undefined;

    if (Number.isNaN(numberValue) || numberValue == undefined || props.disabled) return;

    if (
      (!props.vertical && event.key === "ArrowLeft") ||
      (props.vertical && event.key === "ArrowDown")
    ) {
      updateValue(Math.max(min.value, Math.min(numberValue - step.value, max.value)), true);
    }
    if (
      (!props.vertical && event.key === "ArrowRight") ||
      (props.vertical && event.key === "ArrowUp")
    ) {
      updateValue(Math.max(min.value, Math.min(numberValue + step.value, max.value)), true);
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

    processingValue(event.clientX, event.clientY);
  }

  function hoverHandle(event: MouseEvent) {
    const target = event.target as HTMLElement;

    if (target === minHandleRef.value) {
      minHandleTooltipState.value = { ...minHandleTooltipState.value, hover: true };
      maxHandleTooltipState.value = { ...maxHandleTooltipState.value, hover: false };
    } else {
      minHandleTooltipState.value = { ...minHandleTooltipState.value, hover: false };
      maxHandleTooltipState.value = { ...maxHandleTooltipState.value, hover: true };
    }
  }
  function leaveHandle(event: MouseEvent) {
    const target = event.target as HTMLElement;

    if (target === minHandleRef.value) {
      minHandleTooltipState.value = { ...minHandleTooltipState.value, hover: false };
    } else {
      maxHandleTooltipState.value = { ...maxHandleTooltipState.value, hover: false };
    }
  }

  function focusHandle(event: Event) {
    const target = event.target as HTMLElement;

    if (target === minHandleRef.value) {
      minHandleTooltipState.value = { ...minHandleTooltipState.value, focus: true };
    } else {
      maxHandleTooltipState.value = { ...maxHandleTooltipState.value, focus: true };
    }
  }
  function blurHandle(event: Event) {
    const target = event.target as HTMLElement;

    if (target === minHandleRef.value) {
      minHandleTooltipState.value = { ...minHandleTooltipState.value, focus: false };
    } else {
      maxHandleTooltipState.value = { ...maxHandleTooltipState.value, focus: false };
    }
  }

  watchEffect((clean) => {
    const eventController = new AbortController();
    maxHandleRef.value?.addEventListener?.("keydown", keyDown, { signal: eventController.signal });
    minHandleRef.value?.addEventListener?.("keydown", keyDown, { signal: eventController.signal });

    minHandleRef.value?.addEventListener?.("mouseenter", hoverHandle, {
      signal: eventController.signal,
    });
    minHandleRef.value?.addEventListener?.("mouseleave", leaveHandle, {
      signal: eventController.signal,
    });
    maxHandleRef.value?.addEventListener?.("mouseenter", hoverHandle, {
      signal: eventController.signal,
    });
    maxHandleRef.value?.addEventListener?.("mouseleave", leaveHandle, {
      signal: eventController.signal,
    });
    minHandleRef.value?.addEventListener?.("focus", focusHandle, {
      signal: eventController.signal,
    });
    minHandleRef.value?.addEventListener?.("blur", blurHandle, {
      signal: eventController.signal,
    });
    maxHandleRef.value?.addEventListener?.("focus", focusHandle, {
      signal: eventController.signal,
    });
    maxHandleRef.value?.addEventListener?.("blur", blurHandle, {
      signal: eventController.signal,
    });

    clean(() => {
      eventController.abort();
    });
  });

  defineExpose({ element: sliderRef });
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
    <Tooltip
      v-if="$props.range"
      :text="minValue"
      :placement="$props.vertical ? 'right-center' : 'top-center'"
      observe
      :show="minHandleTooltipOpen"
      :open-by-hover="false"
      :animation-appear="true"
      :animation-disappear="false"
    >
      <div
        ref="min-handle"
        class="ksd-slider__handle"
        role="slider"
        :aria-valuemin="min"
        :aria-valuemax="max"
        :area-orientation="$props.vertical ? 'vertical' : 'horizontal'"
        :area-valuenow="minValue"
        :area-disabled="$props.disabled"
        :area-hidden="$props.disabled"
        :tabindex="$props.disabled ? undefined : 0"
        :class="commonClasses"
        :style="minHandleStyles"
      ></div>
    </Tooltip>
    <Tooltip
      :text="maxValue"
      :placement="$props.vertical ? 'right-center' : 'top-center'"
      observe
      :show="maxHandleTooltipOpen"
      :open-by-hover="false"
      :animation-appear="true"
      :animation-disappear="false"
    >
      <div
        ref="max-handle"
        class="ksd-slider__handle"
        role="slider"
        :aria-valuemin="min"
        :aria-valuemax="max"
        :area-orientation="$props.vertical ? 'vertical' : 'horizontal'"
        :area-valuenow="maxValue"
        :area-disabled="$props.disabled"
        :area-hidden="$props.disabled"
        :tabindex="$props.disabled ? undefined : 0"
        :class="commonClasses"
        :style="maxHandleStyles"
      ></div
    ></Tooltip>
  </div>
</template>

<style lang="scss">
  .ksd-slider {
    box-sizing: border-box;
    padding: 0;
    color: var(--ksd-text-main-color);
    font-size: var(--ksd-font-size);
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
      & .ksd-slider__rail {
        background-color: var(--ksd-slider-rail-hover-bg);
      }
    }

    &.horizontal {
      padding-block: var(--ksd-slider-rail-size);
      height: calc(var(--ksd-slider-rail-size) * 3);
    }

    &.vertical {
      padding-inline: var(--ksd-slider-rail-size);
      width: calc(var(--ksd-slider-rail-size) * 3);
      height: 100%;
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

      &.vertical {
        height: 100%;
        width: var(--ksd-slider-rail-size);
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

      &.vertical {
        width: var(--ksd-slider-rail-size);
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

      &.vertical {
        transform: translateY(50%);
        inset-inline-start: calc(
          (var(--ksd-slider-rail-size) * 3 - var(--ksd-slider-handle-size)) / 2
        );
      }
    }
  }
</style>
