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
    fill="none"
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
      d="M765.7 486.8L314.9 134.7A7.97 7.97 0 00302 141v77.3c0 4.9 2.3 9.6 6.1 12.6l360 281.1-360 281.1c-3.9 3-6.1 7.7-6.1 12.6V883c0 6.7 7.7 10.4 12.9 6.3l450.8-352.1a31.96 31.96 0 000-50.4z"
      :fill="color"
    ></path>
  </svg>
</template>
