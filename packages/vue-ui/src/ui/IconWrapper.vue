<script setup lang="ts">
  import { type HTMLAttributes, useTemplateRef } from "vue";

  export type IconWrapperProps = {
    inset?: number;
  } & /*@vue-ignore*/ HTMLAttributes;

  const element = useTemplateRef("button");
  defineProps<IconWrapperProps>();
  defineExpose({
    element,
  });
</script>

<template>
  <button
    ref="button"
    class="ksd-icon-wrapper"
    :style="{ '--ksd-button-wrapper-inset': $props.inset }"
  >
    <slot></slot>
  </button>
</template>

<style lang="scss">
  .ksd-icon-wrapper {
    outline: none;
    border: none;
    padding: 0;
    width: fit-content;
    height: fit-content;
    display: flex;
    background: inherit;
    position: relative;
    cursor: pointer;

    &:focus-visible {
      outline: var(--ksd-outline-width) var(--ksd-outline-type) var(--ksd-outline-color);
      outline-offset: 1px;
      transition:
        outline-offset 0s,
        outline 0s;
    }

    &::before {
      content: "";
      position: absolute;
      inset: calc(-1px * var(--ksd-button-wrapper-inset, 0));
    }
  }
</style>
