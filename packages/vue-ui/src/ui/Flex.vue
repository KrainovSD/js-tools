<script setup lang="ts">
  import { computed, useTemplateRef } from "vue";

  export type FlexProps = {
    vertical?: boolean;
    wFull?: boolean;
    hFull?: boolean;
    gap?: number;
    flexAlign?: "center" | "end" | "start" | "flex-start" | "flex-end";
    justify?:
      | "center"
      | "end"
      | "start"
      | "flex-end"
      | "flex-start"
      | "space-between"
      | "space-around";
    overflow?: "auto" | "scroll" | "visible" | "hidden";
    wMax?: number;
    hMax?: number;
    wMin?: number;
    hMin?: number;
  };

  const props = defineProps<FlexProps>();

  const element = useTemplateRef("base");
  const componentClasses = computed(() => ({
    vertical: props.vertical,
    wFull: props.wFull,
    hFull: props.hFull,
  }));

  defineExpose({
    element,
  });
</script>

<template>
  <div
    ref="base"
    class="ksd-flex"
    :class="[componentClasses]"
    :style="{
      gap: $props.gap != undefined ? `${$props.gap}px` : undefined,
      alignItems: $props.flexAlign,
      justifyContent: $props.justify,
      overflow: $props.overflow,
      maxWidth: $props.wMax != undefined ? `${$props.wMax}px` : undefined,
      maxHeight: $props.hMax != undefined ? `${$props.hMax}px` : undefined,
      minWidth: $props.wMin != undefined ? `${$props.wMin}px` : undefined,
      minHeight: $props.hMin != undefined ? `${$props.hMin}px` : undefined,
    }"
  >
    <slot></slot>
  </div>
</template>

<style lang="scss">
  .ksd-flex {
    display: flex;

    &.vertical {
      flex-direction: column;
    }

    &.wFull {
      width: 100%;
    }

    &.hFull {
      height: 100%;
    }
  }
</style>
