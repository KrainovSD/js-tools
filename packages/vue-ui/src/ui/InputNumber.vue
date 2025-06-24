<script setup lang="ts">
  import { isNumber } from "@krainovsd/js-helpers";
  import { VDownOutlined, VUpOutlined } from "@krainovsd/vue-icons";
  import { computed, ref, useAttrs, useTemplateRef, watchEffect } from "vue";
  import Flex from "./Flex.vue";
  import type { InputProps } from "./Input.vue";
  import Input from "./Input.vue";

  // eslint-disable-next-line @typescript-eslint/no-redundant-type-constituents
  export type InputNumberProps = { classNameNumber?: string } & InputProps;
  const props = defineProps<InputNumberProps>();
  const attrs = useAttrs();
  const model = defineModel<number>();

  const value = computed(() => (model.value != undefined ? model.value.toString() : ""));
  const max = computed(() =>
    isNumber(attrs.max)
      ? isNumber(attrs.min)
        ? attrs.min > attrs.max
          ? attrs.min
          : attrs.max
        : attrs.max
      : undefined,
  );
  const min = computed(() =>
    isNumber(attrs.min)
      ? isNumber(attrs.max)
        ? attrs.max < attrs.min
          ? attrs.max
          : attrs.min
        : attrs.min
      : undefined,
  );

  const step = computed(() => (isNumber(attrs.step) ? attrs.step : 1));
  const componentClasses = computed(() => ({
    [`variant-${props.variant ?? "outlined"}`]: true,
    [`size-${props.size ?? "default"}`]: true,
    [`status-${props.status ?? "default"}`]: props.status != undefined,
    disabled: props.disabled,
    "up-disabled":
      model.value != undefined && max.value != undefined ? model.value >= max.value : false,
    "down-disabled":
      model.value != undefined && min.value != undefined ? model.value <= min.value : false,
  }));

  const inputRef = useTemplateRef("input");
  const inputElement = computed(() => inputRef.value?.element);
  const intervalId = ref<NodeJS.Timeout | null>(null);
  const timeoutId = ref<NodeJS.Timeout | null>(null);
  const controller = ref<AbortController | null>(null);

  function clearTimer() {
    if (timeoutId.value != undefined) {
      clearTimeout(timeoutId.value);
    }
    if (intervalId.value != undefined) {
      clearInterval(intervalId.value);
    }
    if (controller.value) {
      controller.value.abort();
    }
  }

  function changeByTimer(
    direction: "up" | "down",
    opts: { timerDelay: number; intervalDelay: number } = { timerDelay: 500, intervalDelay: 200 },
  ) {
    clearTimer();

    if (model.value != undefined) {
      if (direction === "up") {
        model.value += step.value;
      } else {
        model.value -= step.value;
      }
    }

    timeoutId.value = setTimeout(() => {
      intervalId.value = setInterval(() => {
        if (model.value != undefined) {
          if (direction === "up") {
            model.value += step.value;
          } else {
            model.value -= step.value;
          }
        }
      }, opts.intervalDelay);
    }, opts.timerDelay);
    controller.value = new AbortController();

    document.addEventListener("mouseup", clearTimer, { signal: controller.value.signal });
  }

  function onMouseDown(event: Event, direction: "up" | "down") {
    event.preventDefault();
    if (model.value == undefined) return;

    changeByTimer(direction, { timerDelay: 400, intervalDelay: 150 });
  }

  function filterNumberInput(event: KeyboardEvent) {
    const target = event.target as HTMLInputElement;

    const allowedKeys = ["Tab", "Escape", "Enter", "ArrowLeft", "ArrowRight", "Home", "End"];
    const allowedDeleteKeys = ["Backspace", "Delete"];
    const controlsKeys = ["ArrowUp", "ArrowDown"];
    const serviceKeys = ["a", "c", "x", "v"];

    if (event.ctrlKey && serviceKeys.includes(event.key.toLowerCase())) {
      return;
    }

    if (
      allowedKeys.includes(event.key) ||
      /^\d$/.test(event.key) ||
      (target.value.length > 1 && allowedDeleteKeys.includes(event.key))
    ) {
      return;
    }

    if (controlsKeys.includes(event.key)) {
      if (model.value != undefined) {
        if (event.key === "ArrowUp") {
          model.value += step.value;
        } else {
          model.value -= step.value;
        }
      }
    }

    event.preventDefault();
  }

  watchEffect(
    () => {
      if (model.value != undefined) {
        if (min.value != undefined && model.value < min.value) {
          model.value = min.value;
        }
        if (max.value != undefined && model.value > max.value) {
          model.value = max.value;
        }
      }
    },
    { flush: "pre" },
  );

  defineExpose({ element: inputElement });
</script>

<template>
  <Input
    ref="input"
    v-bind="{ ...$props, ...$attrs }"
    :model-value="value"
    type="text"
    autocomplete="off"
    role="spinbutton"
    :aria-valuemin="min"
    :aria-valuemax="max"
    :aria-valuenow="model"
    class="ksd-password"
    @update:model-value="
      (value) => {
        model = value != undefined ? +value : min != undefined ? min : 0;
      }
    "
    @keydown="filterNumberInput"
  >
    <template #prefix="slotProps">
      <slot name="prefix" v-bind="slotProps"></slot>
    </template>
    <template #suffix="slotProps">
      <slot name="suffix" v-bind="slotProps"></slot>
    </template>

    <Flex class="ksd-input-number__controls" :class="componentClasses" vertical>
      <span
        unselectable="on"
        role="button"
        aria-label="increase"
        aria-disabled="false"
        class="ksd-input-number__control up"
        :class="componentClasses"
        @mousedown="(event) => onMouseDown(event, 'up')"
      >
        <VUpOutlined :size="7" aria-hidden="true" focusable="false" />
      </span>
      <span
        unselectable="on"
        role="button"
        aria-label="decrease"
        aria-disabled="false"
        class="ksd-input-number__control down"
        :class="componentClasses"
        @mousedown="(event) => onMouseDown(event, 'down')"
        ><VDownOutlined :size="7" aria-hidden="true" focusable="false" />
      </span>
    </Flex>
  </Input>
</template>

<style lang="scss">
  .ksd-input:hover:has(> .ksd-input-number__controls:not(.disabled)) {
    .ksd-input-number__controls {
      width: 22px;
      opacity: 1;
    }
  }

  .ksd-input-number {
    &__controls {
      position: absolute;
      opacity: 0;
      inset-block-start: 0px;
      inset-inline-end: 0px;
      width: 0px;
      opacity: var(--ksd-input-number-handle-opacity);
      height: 100%;
      border-start-start-radius: 0;
      border-start-end-radius: var(--ksd-border-radius);
      border-end-end-radius: var(--ksd-border-radius);
      border-end-start-radius: 0;
      display: flex;
      flex-direction: column;
      align-items: stretch;
      transition: all var(--ksd-transition-mid);
      overflow: hidden;
      z-index: 1;
      cursor: pointer;

      &.variant-outlined {
        background: var(--ksd-bg-container-color);
      }
      &.variant-filled {
        background: var(--ksd-bg-fill-color);
      }

      &:not(.disabled):has(~ .ksd-input__input:focus),
      &:not(.disabled):has(~ .ksd-input__input:focus-within) {
        /* width: 22px;
        opacity: 1; */

        &.variant-filled {
          background: var(--ksd-bg-container-color);
        }
      }

      &:not(.disabled):hover {
        width: 22px;
        opacity: 1;
      }
    }

    &__control {
      height: 50%;
      overflow: hidden;
      color: var(--ksd-icon-color);
      line-height: 0;
      text-align: center;
      cursor: pointer;
      border-inline-start: var(--ksd-line-width) var(--ksd-line-type) var(--ksd-border-color);
      transition: all var(--ksd-transition-mid) linear;
      display: flex;
      align-items: center;
      justify-content: center;
      height: 50%;
      flex: auto;

      &.up {
        border-start-end-radius: var(--ksd-border-radius);
        border-block-end: var(--ksd-line-width) var(--ksd-line-type) var(--ksd-border-color);

        &.variant-borderless,
        &.variant-underline {
          border-block-end-color: transparent;
        }

        &.up-disabled {
          cursor: not-allowed;
        }
      }

      &.down {
        border-end-end-radius: var(--ksd-border-radius);

        &.down-disabled {
          cursor: not-allowed;
        }
      }

      &:hover {
        color: var(--ksd-accent-color);
        height: 60%;
      }
    }
  }
</style>
