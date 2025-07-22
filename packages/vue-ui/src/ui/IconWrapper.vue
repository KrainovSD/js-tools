<script setup lang="ts">
  import { type HTMLAttributes, useTemplateRef } from "vue";

  export type IconWrapperProps = {} & /*@vue-ignore*/ HTMLAttributes;

  const element = useTemplateRef("button");
  defineProps<IconWrapperProps>();
  defineExpose({
    element,
  });
</script>

<template>
  <button ref="button" class="ksd-icon-wrapper"><slot></slot></button>
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
    cursor: pointer;

    &:focus-visible {
      outline: var(--ksd-outline-width) var(--ksd-outline-type) var(--ksd-outline-color);
      outline-offset: 1px;
      transition:
        outline-offset 0s,
        outline 0s;
    }
  }
</style>
