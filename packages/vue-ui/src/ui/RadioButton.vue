<script setup lang="ts">
  import { computed } from "vue";
  import type { GlobalEmits } from "../types";
  import type { RadioProps, RadioValue } from "./Radio.vue";

  export type RadioButtonSize = "large" | "default" | "small";
  export type RadioButtonStyle = "outline" | "solid";

  export type RadioButtonProps = {
    size?: RadioButtonSize;
    buttonStyle?: RadioButtonStyle;
  } & Omit<RadioProps, "block">;

  const props = withDefaults(defineProps<RadioButtonProps>(), {
    buttonStyle: "outline",
    size: "default",
  });
  defineEmits<GlobalEmits>();
  const model = defineModel<RadioValue>();
  const checked = computed(() => model.value === props.value);
  const rootClasses = computed(() => ({
    disabled: props.disabled,
    checked: checked.value,
    [`size-${props.size}`]: true,
    [`type-${props.buttonStyle}`]: true,
  }));
</script>

<template>
  <label class="ksd-radio-button" :class="[rootClasses, $props.classNameRoot]">
    <input
      ref="input"
      class="ksd-radio-button__input"
      type="radio"
      :value="$props.value"
      :disabled="$props.disabled"
      :checked="checked"
      v-bind="$attrs"
      :name="$props.name"
      @input="model = $props.value"
    />
    <slot></slot>
  </label>
</template>

<style lang="scss">
  .ksd-radio-button {
    position: relative;
    display: inline-block;
    margin: 0;
    padding-block: 0;
    font-family: var(--ksd-font-family);
    color: var(--ksd-text-main-color);
    background: var(--ksd-button-bg);
    border: var(--ksd-line-width) var(--ksd-line-type) var(--ksd-border-color);
    border-inline-start-width: 0;
    border-inline-end-width: var(--ksd-line-width);
    cursor: pointer;
    transition:
      color var(--ksd-transition-mid),
      border-color var(--ksd-transition-mid),
      background var(--ksd-transition-mid),
      box-shadow var(--ksd-transition-mid);
    width: fit-content;

    &.size-default {
      padding-inline: var(--ksd-radio-button-padding-inline);
      height: var(--ksd-control-height);
      line-height: calc(var(--ksd-control-height) - var(--ksd-line-width) * 2);
      font-size: var(--ksd-font-size);
    }
    &.size-small {
      padding-inline: calc(var(--ksd-padding-xs) - var(--ksd-line-width));
      height: var(--ksd-control-height-sm);
      line-height: calc(var(--ksd-control-height-sm) - var(--ksd-line-width) * 2);
      font-size: var(--ksd-font-size);
    }
    &.size-large {
      padding-inline: var(--ksd-radio-button-padding-inline);
      height: var(--ksd-control-height-lg);
      line-height: calc(var(--ksd-control-height-lg) - var(--ksd-line-width) * 2);
      font-size: var(--ksd-font-size-lg);
    }

    &:first-child {
      border-inline-start-width: 1px;
      &.size-default {
        border-start-start-radius: var(--ksd-border-radius);
        border-end-start-radius: var(--ksd-border-radius);
      }
      &.size-small {
        border-start-start-radius: var(--ksd-border-radius-sm);
        border-end-start-radius: var(--ksd-border-radius-sm);
      }
      &.size-large {
        border-start-start-radius: var(--ksd-border-radius-lg);
        border-end-start-radius: var(--ksd-border-radius-lg);
      }
    }
    &:last-child {
      &.size-default {
        border-start-end-radius: var(--ksd-border-radius);
        border-end-end-radius: var(--ksd-border-radius);
      }
      &.size-small {
        border-start-end-radius: var(--ksd-border-radius-sm);
        border-end-end-radius: var(--ksd-border-radius-sm);
      }
      &.size-large {
        border-start-end-radius: var(--ksd-border-radius-lg);
        border-end-end-radius: var(--ksd-border-radius-lg);
      }
    }

    &.type-outline:not(:first-child) {
      &::before {
        position: absolute;
        inset-block-start: calc(var(--ksd-line-width) * -1);
        inset-inline-start: calc(var(--ksd-line-width) * -1);
        display: block;
        box-sizing: content-box;
        width: 1px;
        height: 100%;
        z-index: -1;
        padding-block: var(--ksd-line-width);
        padding-inline: 0;
        background-color: var(--ksd-border-color);
        transition: background-color var(--ksd-transition-mid);
        content: "";
      }
    }

    &:not(.disabled):hover {
      color: var(--ksd-accent-color);

      &.checked {
        &.type-outline {
          border-color: var(--ksd-accent-hover-color);
          color: var(--ksd-accent-hover-color);
        }
        &.type-solid {
          background-color: var(--ksd-accent-hover-color);
          border-color: var(--ksd-accent-hover-color);
        }
      }
    }

    &.disabled {
      color: var(--ksd-text-main-disabled-color);
      cursor: not-allowed;
    }

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

    &.checked {
      background-color: var(--ksd-button-bg);
      border-color: var(--ksd-accent-color);
      color: var(--ksd-accent-color);

      &.type-solid {
        background-color: var(--ksd-accent-color);
        border-color: var(--ksd-accent-color);
        color: var(--ksd-text-reverse-color);
      }

      &.type-outline:not(.disabled):not(:first-child) {
        &::before {
          background-color: var(--ksd-accent-color);
          z-index: 0;
        }
      }

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
        box-shadow: 0 0 2px 8px var(--ksd-accent-color);
      }
    }

    &__input {
      position: absolute;
      inset: 0;
      z-index: 1;
      cursor: inherit;
      opacity: 0;
      margin: 0;
    }
  }
</style>
