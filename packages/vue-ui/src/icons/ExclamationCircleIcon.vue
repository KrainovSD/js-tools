<script setup lang="ts">
  import { computed } from "vue";
  import type { IconProps } from "../types";

  const { size = 14, color = "currentColor", sizeX, sizeY } = defineProps<IconProps>();
  const currentSizeX = computed(() => sizeX ?? size);
  const currentSizeY = computed(() => sizeY ?? size);
</script>

<template>
  <svg
    :width="currentSizeX"
    :height="currentSizeY"
    viewBox="64 64 896 896"
    :fill="color"
    xmlns="http://www.w3.org/2000/svg"
    :style="{
      fontSize: `${currentSizeY}px`,
      width: `${currentSizeX}px`,
      height: `${currentSizeY}px`,
      minWidth: `${currentSizeX}px`,
      minHeight: `${currentSizeY}px`,
      maxWidth: `${currentSizeX}px`,
      maxHeight: `${currentSizeY}px`,
    }"
  >
    <path
      d="M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm-32 232c0-4.4 3.6-8 8-8h48c4.4 0 8 3.6 8 8v272c0 4.4-3.6 8-8 8h-48c-4.4 0-8-3.6-8-8V296zm32 440a48.01 48.01 0 010-96 48.01 48.01 0 010 96z"
    ></path>
  </svg>
</template>
