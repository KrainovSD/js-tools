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
      d="M799.86 166.31c.02 0 .04.02.08.06l57.69 57.7c.04.03.05.05.06.08a.12.12 0 010 .06c0 .03-.02.05-.06.09L569.93 512l287.7 287.7c.04.04.05.06.06.09a.12.12 0 010 .07c0 .02-.02.04-.06.08l-57.7 57.69c-.03.04-.05.05-.07.06a.12.12 0 01-.07 0c-.03 0-.05-.02-.09-.06L512 569.93l-287.7 287.7c-.04.04-.06.05-.09.06a.12.12 0 01-.07 0c-.02 0-.04-.02-.08-.06l-57.69-57.7c-.04-.03-.05-.05-.06-.07a.12.12 0 010-.07c0-.03.02-.05.06-.09L454.07 512l-287.7-287.7c-.04-.04-.05-.06-.06-.09a.12.12 0 010-.07c0-.02.02-.04.06-.08l57.7-57.69c.03-.04.05-.05.07-.06a.12.12 0 01.07 0c.03 0 .05.02.09.06L512 454.07l287.7-287.7c.04-.04.06-.05.09-.06a.12.12 0 01.07 0z"
    ></path>
  </svg>
</template>
