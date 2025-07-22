<script setup lang="ts">
  import { useTemplateRef } from "vue";
  import type { GlobalEmits } from "../types";

  const element = useTemplateRef("button");
  defineEmits<GlobalEmits>();

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
