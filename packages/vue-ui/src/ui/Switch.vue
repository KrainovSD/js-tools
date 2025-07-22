<script setup lang="ts">
  import { VLoadingOutlined } from "@krainovsd/vue-icons";
  import { computed, useTemplateRef } from "vue";
  import type { GlobalEmits } from "../types";

  export type SwitchSize = "small" | "default";

  export type SwitchProps = {
    disabled?: boolean;
    loading?: boolean;
    size?: SwitchSize;
    block?: boolean;
  };

  const props = defineProps<SwitchProps>();
  defineEmits<GlobalEmits>();
  const model = defineModel<boolean>();
  const elementRef = useTemplateRef("switch");
  const commonClasses = computed(() => ({
    checked: model.value,
    disabled: props.disabled,
    loading: props.loading,
    small: props.size === "small",
  }));

  defineExpose({ element: elementRef });
</script>

<template>
  <button
    ref="switch"
    role="switch"
    type="button"
    :aria-checked="model"
    v-bind="$attrs"
    class="ksd-switch"
    :class="[commonClasses]"
    :disabled="$props.disabled || $props.loading"
    @click="model = !model"
  >
    <div class="ksd-switch__handle" :class="[commonClasses]">
      <VLoadingOutlined v-if="$props.loading" :size="$props.size === 'small' ? 8 : 12" />
    </div>
    <span
      v-if="Object.values($slots).length > 0"
      class="ksd-switch__inner"
      :class="[commonClasses]"
    >
      <span class="ksd-switch__inner-checked" :class="[commonClasses]"
        ><slot name="checked"></slot
      ></span>
      <span class="ksd-switch__inner-unchecked" :class="[commonClasses]"
        ><slot name="unchecked"></slot
      ></span>
    </span>
  </button>
</template>

<style lang="scss">
  .ksd-switch {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
    color: var(--ksd-text-main-color);
    font-size: var(--ksd-font-size);
    line-height: var(--ksd-switch-track-height);
    list-style: none;
    font-family: var(--ksd-font-family);
    position: relative;
    display: inline-block;
    min-width: var(--ksd-switch-track-min-width);
    width: fit-content;
    height: var(--ksd-switch-track-height);
    vertical-align: middle;
    background: var(--ksd-switch-bg-unchecked-color);
    border: 0;
    border-radius: 100px;
    cursor: pointer;
    transition: all var(--ksd-transition-mid);
    user-select: none;

    &:after {
      content: "";
      box-shadow: 0 0 0 0 var(--ksd-accent-color);
      position: absolute;
      border-radius: inherit;
      left: 0;
      top: 0;
      opacity: 0.4;
      transition: 0s;
    }
    &::before {
      content: "";
      display: block;
      position: absolute;
      border-radius: inherit;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      opacity: 0;
      transition: all 0.5s;
      box-shadow: 0 0 3px 7px var(--ksd-switch-bg-unchecked-hover-color);
    }

    &.checked {
      background-color: var(--ksd-accent-color);
      border-color: var(--ksd-accent-color);

      &:after {
        display: block;
        position: absolute;
        border-radius: inherit;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        opacity: 0;
        transition: all 0.5s;
        box-shadow: 0 0 3px 7px var(--ksd-accent-color);
      }

      &::before {
        content: "";
        box-shadow: 0 0 0 0 var(--ksd-switch-bg-unchecked-hover-color);
        position: absolute;
        border-radius: inherit;
        left: 0;
        top: 0;
        opacity: 0.4;
        transition: 0s;
      }
    }

    &:focus-visible {
      outline: var(--ksd-outline-width) var(--ksd-outline-type) var(--ksd-outline-color);
      outline-offset: 1px;
      transition:
        outline-offset 0s,
        outline 0s;
    }

    &.checked {
      background: var(--ksd-accent-color);
    }

    &:not(.loading):not(.disabled):hover {
      background: var(--ksd-switch-bg-unchecked-hover-color);

      &.checked {
        background: var(--ksd-accent-hover-color);
      }
    }

    &.loading,
    &.disabled {
      opacity: var(--ksd-opacity-loading);
      cursor: not-allowed;
    }

    &:not(.disabled):not(.loading):active {
      .ksd-switch__handle {
        &::before {
          inset-inline-end: -30%;
          inset-inline-start: 0;
        }

        &.checked {
          &::before {
            inset-inline-end: 0;
            inset-inline-start: -30%;
          }
        }
      }
    }

    &.small {
      min-width: var(--ksd-switch-track-min-width-sm);
      height: var(--ksd-switch-track-height-sm);
      line-height: var(--ksd-switch-track-height-sm);
    }

    &__handle {
      position: absolute;
      top: var(--ksd-switch-track-padding);
      inset-inline-start: var(--ksd-switch-track-padding);
      width: var(--ksd-switch-handle-size);
      height: var(--ksd-switch-handle-size);
      transition: all var(--ksd-transition-mid) ease-in-out;

      &.small {
        width: var(--ksd-switch-handle-size-sm);
        height: var(--ksd-switch-handle-size-sm);
      }

      &.checked {
        color: var(--ksd-accent-color);
        inset-inline-start: calc(
          100% - calc(var(--ksd-switch-handle-size) + var(--ksd-switch-track-padding))
        );

        &.small {
          inset-inline-start: calc(
            100% - calc(var(--ksd-switch-handle-size-sm) + var(--ksd-switch-track-padding))
          );
        }
      }

      &::before {
        position: absolute;
        top: 0;
        inset-inline-end: 0;
        bottom: 0;
        inset-inline-start: 0;
        background-color: var(--ksd-switch-handle-bg);
        border-radius: calc(var(--ksd-switch-handle-size) / 2);
        box-shadow: var(--ksd-switch-handle-shadow);
        transition: all var(--ksd-transition-mid) ease-in-out;
        content: "";
      }

      & > svg {
        position: absolute;
        left: 50%;
        top: 50%;
        translate: -50% -50%;
      }
    }

    &__inner {
      display: block;
      overflow: hidden;
      border-radius: 100px;
      height: 100%;
      padding-inline-start: var(--ksd-switch-inner-max-margin);
      padding-inline-end: var(--ksd-switch-inner-min-margin);
      transition:
        padding-inline-start var(--ksd-transition-mid) ease-in-out,
        padding-inline-end var(--ksd-transition-mid) ease-in-out;

      &.small {
        padding-inline-start: var(--ksd-switch-inner-max-margin-sm);
        padding-inline-end: var(--ksd-switch-inner-min-margin-sm);
      }

      &.checked {
        padding-inline-start: var(--ksd-switch-inner-min-margin);
        padding-inline-end: var(--ksd-switch-inner-max-margin);

        &.small {
          padding-inline-start: var(--ksd-switch-inner-min-margin-sm);
          padding-inline-end: var(--ksd-switch-inner-max-margin-sm);
        }
      }
    }

    &__inner-checked {
      display: block;
      color: var(--ksd-switch-checked-color);
      font-size: var(--ksd-font-size-sm);
      transition:
        margin-inline-start var(--ksd-transition-mid) ease-in-out,
        margin-inline-end var(--ksd-transition-mid) ease-in-out;
      pointer-events: none;
      min-height: var(--ksd-switch-track-height);

      margin-inline-start: calc(
        -100% +
          calc(var(--ksd-switch-handle-size) + var(--ksd-switch-track-padding) * 2) - calc(
            var(--ksd-switch-inner-max-margin) * 2
          )
      );
      margin-inline-end: calc(
        100% - calc(var(--ksd-switch-handle-size) + var(--ksd-switch-track-padding) * 2) +
          calc(var(--ksd-switch-inner-max-margin) * 2)
      );

      &.small {
        margin-inline-start: calc(
          -100% +
            calc(var(--ksd-switch-handle-size-sm) + var(--ksd-switch-track-padding) * 2) - calc(
              var(--ksd-switch-inner-max-margin-sm) * 2
            )
        );
        margin-inline-end: calc(
          100% - calc(var(--ksd-switch-handle-size-sm) + var(--ksd-switch-track-padding) * 2) +
            calc(var(--ksd-switch-inner-max-margin-sm) * 2)
        );
      }

      &.checked {
        margin-inline-start: 0;
        margin-inline-end: 0;
      }
    }
    &:not(.loading):not(.disabled):active {
      .ksd-switch__inner-checked {
        &.checked {
          margin-inline-start: calc(var(--ksd-switch-track-padding) * -1 * 2);
          margin-inline-end: calc(var(--ksd-switch-track-padding) * 2);

          &.small {
            margin-inline-start: calc(var(--ksd-margin-xxs) * -1 / 2);
            margin-inline-end: calc(var(--ksd-margin-xxs) / 2);
          }
        }
      }
    }

    &__inner-unchecked {
      display: block;
      color: var(--ksd-switch-unchecked-color);
      font-size: var(--ksd-font-size-sm);
      transition:
        margin-inline-start var(--ksd-transition-mid) ease-in-out,
        margin-inline-end var(--ksd-transition-mid) ease-in-out;
      pointer-events: none;
      min-height: var(--ksd-switch-track-height);

      margin-top: calc(var(--ksd-switch-track-height) * -1);
      margin-inline-start: 0;
      margin-inline-end: 0;

      &.checked {
        margin-inline-start: calc(
          100% - calc(var(--ksd-switch-handle-size) + var(--ksd-switch-track-padding) * 2) +
            calc(var(--ksd-switch-inner-max-margin) * 2)
        );
        margin-inline-end: calc(
          -100% +
            calc(var(--ksd-switch-handle-size) + var(--ksd-switch-track-padding) * 2) - calc(
              var(--ksd-switch-inner-max-margin) * 2
            )
        );

        &.small {
          margin-inline-start: calc(
            100% - calc(var(--ksd-switch-handle-size-sm) + var(--ksd-switch-track-padding) * 2) +
              calc(var(--ksd-switch-inner-max-margin-sm) * 2)
          );
          margin-inline-end: calc(
            -100% +
              calc(var(--ksd-switch-handle-size-sm) + var(--ksd-switch-track-padding) * 2) - calc(
                var(--ksd-switch-inner-max-margin-sm) * 2
              )
          );
        }
      }
    }
    &:not(.loading):not(.disabled):not(.checked):active {
      .ksd-switch__inner-unchecked {
        margin-inline-start: calc(var(--ksd-switch-track-padding) * 2);
        margin-inline-end: calc(var(--ksd-switch-track-padding) * -1 * 2);

        &.small {
          margin-inline-start: calc(var(--ksd-margin-xxs) / 2);
          margin-inline-end: calc(var(--ksd-margin-xxs) * -1 / 2);
        }
      }
    }
  }
</style>
