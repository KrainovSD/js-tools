<script setup lang="ts">
  import { useTemplateRef } from "vue";

  const element = useTemplateRef("button");

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
  }
</style>
