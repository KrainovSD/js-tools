<script setup lang="ts">
  import { computed } from "vue";
  import ArrowDownIcon from "../icons/ArrowDownIcon.vue";
  import ArrowUpIcon from "../icons/ArrowUpIcon.vue";
  import Flex from "./Flex.vue";
  import type { InputProps } from "./Input.vue";
  import Input from "./Input.vue";

  // eslint-disable-next-line @typescript-eslint/no-redundant-type-constituents
  export type InputNumberProps = { classNameNumber?: string } & InputProps;
  const props = defineProps<InputNumberProps>();
  const model = defineModel<string>();
  const componentClasses = computed(() => ({
    [`variant-${props.variant ?? "outlined"}`]: true,
    [`size-${props.size ?? "default"}`]: true,
    [`status-${props.status ?? "default"}`]: props.status != undefined,
    disabled: props.disabled,
  }));
</script>

<template>
  <Input
    v-bind="{ ...$props, ...$attrs }"
    v-model="model"
    type="text"
    autocomplete="off"
    role="spinbutton"
    :aria-valuemin="$attrs.min"
    :aria-valuemax="$attrs.max"
    :aria-valuenow="model"
    class="ksd-password"
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
      >
        <ArrowUpIcon :size="7" aria-hidden="true" focusable="false" />
      </span>
      <span
        unselectable="on"
        role="button"
        aria-label="decrease"
        aria-disabled="false"
        class="ksd-input-number__control down"
        :class="componentClasses"
        ><ArrowDownIcon :size="7" aria-hidden="true" focusable="false" />
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
      opacity: var(--ant-input-number-handle-opacity);
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
        width: 22px;
        opacity: 1;

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
      border-inline-start: 1px solid var(--ksd-border-color);
      transition: all var(--ksd-transition-mid) linear;
      display: flex;
      align-items: center;
      justify-content: center;
      height: 50%;
      flex: auto;

      &.up {
        border-start-end-radius: var(--ksd-border-radius);
        border-block-end: 1px solid var(--ksd-border-color);

        &.variant-borderless,
        &.variant-underline {
          border-block-end-color: transparent;
        }
      }

      &.down {
        border-end-end-radius: var(--ksd-border-radius);
      }

      &:hover {
        color: var(--ksd-accent-color);
        height: 60%;
      }
    }
  }
</style>
