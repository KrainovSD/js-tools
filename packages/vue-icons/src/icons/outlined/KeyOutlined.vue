<script setup lang="ts">
  import type { IconProps } from "../../types";

  const { size, color = "currentColor" } = defineProps<IconProps>();
</script>

<template>
  <svg
    width="1em"
    height="1em"
    viewBox="64 64 896 896"
    focusable="false"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    class="ksd-icon"
    :style="{ fontSize: size != undefined ? `${size}px` : size }"
  >
    <path
      d="M608 112c-167.9 0-304 136.1-304 304 0 70.3 23.9 135 63.9 186.5L255.8 713.6l-62.3-62.3a8.19 8.19 0 00-11.4 0l-39.8 39.8a8.19 8.19 0 000 11.4l62.3 62.3-44.9 44.9-62.3-62.3a8.19 8.19 0 00-11.4 0l-39.8 39.8a8.19 8.19 0 000 11.4l110.3 111.2c3.1 3.1 8.2 3.1 11.3 0l253.6-253.6A304.1 304.1 0 00608 720c167.9 0 304-136.1 304-304S775.9 112 608 112m161.2 465.2C726.2 620.3 668.9 644 608 644s-118.2-23.7-161.2-66.8C403.7 534.2 380 476.9 380 416s23.7-118.2 66.8-161.2c43-43.1 100.3-66.8 161.2-66.8s118.2 23.7 161.2 66.8c43.1 43 66.8 100.3 66.8 161.2s-23.7 118.2-66.8 161.2"
      :fill="color"
    ></path>
  </svg>
</template>
