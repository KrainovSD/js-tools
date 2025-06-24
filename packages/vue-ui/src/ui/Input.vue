<script setup lang="ts">
  import { VCloseCircleFilled } from "@krainovsd/vue-icons";
  import { computed, onMounted, useSlots, useTemplateRef } from "vue";

  export type InputProps = {
    className?: string;
    variant?: "filled" | "borderless" | "underline" | "outlined";
    size?: "default" | "large" | "small";
    status?: "error" | "warning" | "success" | "default";
    autofocus?: boolean;
    allowClear?: boolean;
    disabled?: boolean;
  };

  const props = defineProps<InputProps>();
  const slots = useSlots();
  const model = defineModel<string>();
  const hasSlots = computed(() => Object.keys(slots).length != 0);

  const inputRef = useTemplateRef("input");
  const inputClasses = computed(() => ({
    [`variant-${props.variant ?? "outlined"}`]: true,
    [`size-${props.size ?? "default"}`]: true,
    [`status-${props.status ?? "default"}`]: props.status != undefined,
    disabled: props.disabled,
  }));
  const suffixClasses = computed(() => ({
    clear: props.allowClear && !slots.suffix,
    [`status-${props.status ?? "default"}`]: props.status != undefined,
    disabled: props.disabled,
  }));
  const prefixClasses = computed(() => ({
    [`status-${props.status ?? "default"}`]: props.status != undefined,
    disabled: props.disabled,
  }));
  const visibleClear = computed(() => props.allowClear && !slots.suffix && model.value);

  function onClear() {
    model.value = "";
  }

  function onFocus() {
    if (document.activeElement !== inputRef.value) inputRef.value?.focus?.();
  }

  onMounted(() => {
    if (props.autofocus && inputRef.value) {
      inputRef.value.focus();
    }
  });

  defineExpose({
    element: inputRef,
  });
</script>

<template>
  <input
    v-if="!hasSlots && !$props.allowClear"
    ref="input"
    v-model="model"
    type="text"
    class="ksd-input"
    :class="[inputClasses, $props.className]"
    :disabled="props.disabled"
    v-bind="$attrs"
  />
  <span
    v-if="hasSlots || $props.allowClear"
    class="ksd-input"
    :class="[inputClasses, $props.className]"
    @click="onFocus"
  >
    <slot name="default"></slot>
    <span
      v-if="$slots.prefix"
      role="img"
      class="ksd-input__prefix ksd-input__icon"
      :class="prefixClasses"
      ><slot name="prefix"></slot
    ></span>
    <input
      ref="input"
      v-model="model"
      type="text"
      class="ksd-input__input"
      :class="[inputClasses]"
      :disabled="props.disabled"
      v-bind="$attrs"
    />
    <span
      v-if="$slots.suffix || props.allowClear"
      role="img"
      class="ksd-input__suffix ksd-input__icon"
      :class="suffixClasses"
    >
      <slot name="suffix"></slot>
      <VCloseCircleFilled
        v-if="!$slots.suffix && visibleClear"
        class="ksd-input__clear"
        :size="12"
        @click="onClear"
      />
    </span>
  </span>
</template>

<style lang="scss">
  .ksd-input {
    margin: 0;
    color: var(--ksd-text-main-color);
    line-height: var(--ksd-line-height);
    font-family: var(--ksd-font-family);
    list-style: none;
    position: relative;
    display: inline-flex;
    width: 100%;
    min-width: 0;
    transition:
      border var(--ksd-transition-mid),
      background var(--ksd-transition-mid);
    outline: 0;
    min-height: var(--ksd-control-height);

    &__icon {
      display: flex;
      flex: none;
      align-items: center;

      &.status-error {
        color: var(--ksd-error-color);
      }
      &.status-warning {
        color: var(--ksd-warning-color);
      }
      &.status-success {
        color: var(--ksd-success-color);
      }
      &.disabled {
        color: var(--ksd-text-main-disabled-color);
      }
    }
    &__prefix {
      margin-inline-end: var(--ksd-padding-xxs);
    }
    &__suffix {
      margin-inline-start: var(--ksd-padding-xxs);
    }

    &__clear {
      color: var(--ksd-icon-color);
      cursor: pointer;
      transition: all var(--ksd-transition-mid) ease-in-out;

      &:hover {
        color: var(--ksd-icon-hover-color);
      }
    }

    &__input {
      font-size: inherit;
      border: none;
      border-radius: 0;
      outline: none;
      background: transparent;
      color: inherit;
      transition: all var(--ksd-transition-mid);
      margin: 0;
      display: inline-block;
      width: 100%;
      position: relative;

      &::placeholder {
        color: var(--ksd-text-placeholder-color);
      }
      &:placeholder-shown {
        text-overflow: ellipsis;
      }

      &:disabled {
        cursor: not-allowed;
      }
    }

    &::placeholder {
      color: var(--ksd-text-placeholder-color);
    }
    &:placeholder-shown {
      text-overflow: ellipsis;
    }

    &.size-default {
      font-size: var(--ksd-font-size);
      padding: var(--ksd-input-padding-block) var(--ksd-input-padding-inline);
      border-radius: var(--ksd-border-radius);
      min-height: var(--ksd-control-height);
    }
    &.size-small {
      font-size: var(--ksd-font-size);
      padding: var(--ksd-input-padding-block-sm) var(--ksd-input-padding-inline-sm);
      border-radius: var(--ksd-border-radius-sm);
      min-height: var(--ksd-control-height-sm);
    }

    &.size-large {
      font-size: var(--ksd-font-size-lg);
      padding: var(--ksd-input-padding-block-lg) var(--ksd-input-padding-inline-lg);
      border-radius: var(--ksd-border-radius-lg);
      min-height: var(--ksd-control-height-lg);
    }

    &.variant-outlined {
      background: var(--ksd-bg-container-color);
      border-width: 1px;
      border-style: solid;
      border-color: var(--ksd-border-color);

      &.status-error {
        border-color: var(--ksd-error-color);
      }
      &.status-warning {
        border-color: var(--ksd-warning-color);
      }
      &.status-success {
        border-color: var(--ksd-success-color);
      }

      &:not(.disabled):hover {
        border-color: var(--ksd-accent-hover-color);

        &.status-error {
          border-color: var(--ksd-error-hover-color);
        }
        &.status-warning {
          border-color: var(--ksd-warning-hover-color);
        }
        &.status-success {
          border-color: var(--ksd-success-hover-color);
        }
      }
      &:focus,
      &:focus-within {
        border-color: var(--ksd-accent-color);
        box-shadow: var(--ksd-input-active-shadow);

        &.status-error {
          border-color: var(--ksd-error-color);
          box-shadow: 0 0 0 2px rgba(255, 38, 5, 0.06);
        }
        &.status-warning {
          border-color: var(--ksd-warning-color);
          box-shadow: 0 0 0 2px rgba(255, 215, 5, 0.1);
        }
        &.status-success {
          border-color: var(--ksd-success-color);
          box-shadow: 0 0 0 2px rgba(68, 255, 5, 0.06);
        }
      }
    }
    &.variant-borderless {
      background: transparent;
      border: none;

      &.status-error {
        color: var(--ksd-error-color);
      }
      &.status-warning {
        color: var(--ksd-warning-color);
      }
      &.status-success {
        color: var(--ksd-success-color);
      }
    }
    &.variant-filled {
      background: var(--ksd-bg-fill-color);
      border-width: 1px;
      border-style: solid;
      border-color: transparent;

      &.status-error {
        background: var(--ksd-error-bg-color);
        color: var(--ksd-error-color);
      }
      &.status-warning {
        background: var(--ksd-warning-bg-color);
        color: var(--ksd-warning-color);
      }
      &.status-success {
        background: var(--ksd-success-bg-color);
        color: var(--ksd-success-color);
      }

      &:not(.disabled):hover {
        background: var(--ksd-bg-fill-hover-color);

        &.status-error {
          background: var(--ksd-error-bg-hover-color);
        }
        &.status-warning {
          background: var(--ksd-warning-bg-hover-color);
        }
        &.status-success {
          background: var(--ksd-success-bg-hover-color);
        }
      }

      &:not(.disabled):focus,
      &:not(.disabled):focus-within {
        border-color: var(--ksd-accent-color);
        background: var(--ksd-bg-container-color);

        &.status-error {
          border-color: var(--ksd-error-color);
          background: var(--ksd-bg-container-color);
        }
        &.status-warning {
          border-color: var(--ksd-warning-color);
          background: var(--ksd-bg-container-color);
        }
        &.status-success {
          border-color: var(--ksd-success-color);
          background: var(--ksd-bg-container-color);
        }
      }
    }
    &.variant-underline {
      background: var(--ksd-bg-container-color);
      border-width: 1px 0;
      border-style: solid none;
      border-color: transparent transparent var(--ksd-border-color) transparent;
      border-radius: 0;

      &.status-error {
        border-color: transparent transparent var(--ksd-error-color) transparent;
      }
      &.status-warning {
        border-color: transparent transparent var(--ksd-warning-color) transparent;
      }
      &.status-success {
        border-color: transparent transparent var(--ksd-success-color) transparent;
      }

      &:not(.disabled):hover {
        border-color: transparent transparent var(--ksd-accent-hover-color) transparent;

        &.status-error {
          border-color: transparent transparent var(--ksd-error-hover-color) transparent;
        }
        &.status-warning {
          border-color: transparent transparent var(--ksd-warning-hover-color) transparent;
        }
        &.status-success {
          border-color: transparent transparent var(--ksd-success-hover-color) transparent;
        }
      }
      &:not(.disabled):focus,
      &:not(.disabled):focus-within {
        border-color: transparent transparent var(--ksd-accent-color) transparent;

        &.status-error {
          border-color: transparent transparent var(--ksd-error-color) transparent;
        }
        &.status-warning {
          border-color: transparent transparent var(--ksd-warning-color) transparent;
        }
        &.status-success {
          border-color: transparent transparent var(--ksd-success-color) transparent;
        }
      }
    }
    &.disabled {
      cursor: not-allowed;
      color: var(--ksd-text-main-disabled-color);

      &.variant-outlined,
      &.variant-filled {
        background-color: var(--ksd-bg-disabled-color);
        border-color: var(--ksd-border-color);
        box-shadow: none;
      }
    }
  }
</style>
