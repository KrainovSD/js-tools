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
    viewBox="0 0 1024 1024"
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
      d="M858.9 689L530.5 308.2c-9.4-10.9-27.5-10.9-37 0L165.1 689c-12.2 14.2-1.2 35 18.5 35h656.8c19.7 0 30.7-20.8 18.5-35z"
      :fill="color"
    ></path>
  </svg>
</template>
