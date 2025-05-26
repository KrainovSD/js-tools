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
      d="M890.5 755.3L537.9 269.2c-12.8-17.6-39-17.6-51.7 0L133.5 755.3A8 8 0 00140 768h75c5.1 0 9.9-2.5 12.9-6.6L512 369.8l284.1 391.6c3 4.1 7.8 6.6 12.9 6.6h75c6.5 0 10.3-7.4 6.5-12.7z"
    ></path>
  </svg>
</template>
