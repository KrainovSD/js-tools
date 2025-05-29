<script setup lang="ts">
  import { computed } from "vue";

  export type RadioValue = string | number | boolean;

  export type RadioProps = {
    className?: string;
    name: string;
    value: string | number | boolean;
    block?: boolean;
    disabled?: boolean;
  };

  const model = defineModel<RadioValue>();
  const props = defineProps<RadioProps>();
  const rootClasses = computed(() => ({
    disabled: props.disabled,
    block: props.block,
  }));
  const inputClasses = computed(() => ({
    disabled: props.disabled,
    checked: model.value === props.value,
  }));
</script>

<template>
  <label class="ksd-radio" :class="[rootClasses, props.className]">
    <span class="ksd-radio__wrapper">
      <input
        ref="input"
        class="ksd-radio__input"
        type="radio"
        :value="$props.value"
        :disabled="$props.disabled"
        v-bind="$attrs"
        :name="$props.name"
        @input="model = $props.value"
      />
      <span class="ksd-radio__inner" :class="[inputClasses]"></span>
    </span>
    <span class="ksd-radio__text">
      <slot></slot>
    </span>
  </label>
</template>

<style lang="scss">
  .ksd-radio {
    margin: 0;
    padding: 0;
    color: var(--ksd-text-main-color);
    font-family: var(--ksd-font-family);
    font-size: 1rem;
    line-height: var(--ksd-line-height);
    display: inline-flex;
    width: fit-content;
    align-items: baseline;
    list-style: none;
    cursor: pointer;

    &.block {
      width: auto;
    }

    &:not(.disabled):hover {
      .ksd-radio__inner {
        border-color: var(--ksd-accent-color);
      }
    }

    &.disabled {
      color: var(--ksd-text-main-disabled-color);
      cursor: not-allowed;
    }

    &__wrapper {
      margin: 0;
      padding: 0;
      color: var(--ksd-text-main-color);
      font-family: var(--ksd-font-family);
      font-size: 1rem;
      line-height: 1;
      list-style: none;
      position: relative;
      white-space: nowrap;
      border-radius: var(--ksd-border-radius-sm);
      align-self: center;
    }

    &__inner {
      display: block;
      width: calc(1px * var(--ksd-radio-size));
      height: calc(1px * var(--ksd-radio-size));
      background-color: var(--ksd-bg-container-color);
      border: var(--ksd-line-width) var(--ksd-line-type) var(--ksd-border-color);
      border-collapse: separate;
      border-radius: 50%;
      transition: all var(--ksd-transition-slow);

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

      &:before {
        position: absolute;
        inset-block-start: 50%;
        inset-inline-start: 50%;
        display: block;
        width: calc(1px * var(--ksd-radio-size));
        height: calc(1px * var(--ksd-radio-size));
        margin-block-start: calc(calc(1px * var(--ksd-radio-size)) / -2);
        margin-inline-start: calc(calc(1px * var(--ksd-radio-size)) / -2);
        background-color: var(--ksd-radio-dot-color);
        border-block-start: 0;
        border-inline-start: 0;
        border-radius: calc(1px * var(--ksd-radio-size));
        transform: scale(0);
        opacity: 0;
        transition: all var(--ksd-transition-slow) cubic-bezier(0.78, 0.14, 0.15, 0.86);
        content: "";
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
          box-shadow: 0 0 2px 7px var(--ksd-accent-color);
        }

        &:before {
          transform: scale(calc(var(--ksd-radio-dot-size) / var(--ksd-radio-size)));
          opacity: 1;
        }
      }

      &.disabled {
        border-color: var(--ksd-border-color);
        background-color: var(--ksd-bg-disabled-color);

        &:before {
          border-color: var(--ksd-border-color);
        }
      }
    }

    &__input {
      position: absolute;
      inset: 0;
      z-index: 1;
      cursor: inherit;
      opacity: 0;
      margin: 0;

      &:focus-visible + .ksd-checkbox__inner {
        outline: 3px solid var(--ksd-outline-color);
        outline-offset: 1px;
        transition:
          outline-offset 0s,
          outline 0s;
      }
    }
    &__text {
      padding-inline-start: var(--ksd-padding-xs);
      padding-inline-end: var(--ksd-padding-xs);
    }
  }
</style>
