<script setup lang="ts">
  import { type HTMLAttributes, computed, onMounted, useTemplateRef } from "vue";

  export type CheckBoxProps = {
    classNameRoot?: string;
    indeterminate?: boolean;
    disabled?: boolean;
    autofocus?: boolean;
    block?: boolean;
  } & /*@vue-ignore*/ HTMLAttributes;

  const props = defineProps<CheckBoxProps>();
  const inputRef = useTemplateRef("input");
  const checked = defineModel<boolean>();
  const inputClasses = computed(() => ({
    disabled: props.disabled,
    indeterminate: props.indeterminate,
    checked: checked.value,
  }));
  const rootClasses = computed(() => ({ disabled: props.disabled, block: props.block }));

  onMounted(() => {
    if (props.autofocus && inputRef.value) {
      inputRef.value.focus();
    }
  });

  defineExpose({ element: inputRef });
</script>

<template>
  <label class="ksd-checkbox" :class="[rootClasses, props.classNameRoot]">
    <span class="ksd-checkbox__wrapper">
      <input
        ref="input"
        v-bind="$attrs"
        v-model="checked"
        class="ksd-checkbox__input"
        type="checkbox"
        :disabled="$props.disabled"
      />
      <span class="ksd-checkbox__inner" :class="[inputClasses]"></span>
    </span>
    <span v-if="$slots.default" class="ksd-checkbox__text">
      <slot></slot>
    </span>
  </label>
</template>

<style lang="scss">
  .ksd-checkbox {
    margin: 0;
    padding: 0;
    color: var(--ksd-text-main-color);
    font-family: var(--ksd-font-family);
    font-size: var(--ksd-font-size);
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
      .ksd-checkbox__inner {
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
      font-size: var(--ksd-font-size);
      line-height: 1;
      list-style: none;
      position: relative;
      white-space: nowrap;
      border-radius: var(--ksd-border-radius-sm);
      align-self: center;
    }

    &__inner {
      display: block;
      width: var(--ksd-control-interactive-size);
      height: var(--ksd-control-interactive-size);
      background-color: var(--ksd-bg-container-color);
      border: var(--ksd-line-width) var(--ksd-line-type) var(--ksd-border-color);
      border-collapse: separate;
      border-radius: var(--ksd-border-radius-sm);
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
        content: "";
        box-sizing: border-box;
        position: absolute;
        top: 50%;
        inset-inline-start: 25%;
        display: table;
        width: calc(var(--ksd-control-interactive-size) / 14 * 5);
        height: calc(var(--ksd-control-interactive-size) / 14 * 8);
        border: 2px solid #ffffff;
        border-top: 0;
        border-inline-start: 0;
        transform: rotate(45deg) scale(0) translate(-50%, -50%);
        opacity: 0;
        transition:
          all var(--ksd-transition-fast) cubic-bezier(0.71, -0.46, 0.88, 0.6),
          opacity var(--ksd-transition-fast);
      }

      &:not(.checked).indeterminate {
        &:before {
          top: 50%;
          inset-inline-start: 50%;
          width: calc(var(--ksd-control-interactive-size) / 2);
          height: calc(var(--ksd-control-interactive-size) / 2);
          background-color: var(--ksd-accent-color);
          border: 0;
          transform: translate(-50%, -50%) scale(1);
          opacity: 1;
        }
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
          opacity: 1;
          transform: rotate(45deg) scale(1.05) translate(-50%, -50%);
          transition: all var(--ksd-transition-mid) cubic-bezier(0.12, 0.4, 0.29, 1.46)
            var(--ksd-transition-fast);
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
        outline: var(--ksd-outline-width) var(--ksd-outline-type) var(--ksd-outline-color);
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
