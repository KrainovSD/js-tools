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
      d="M832 64H192c-17.7 0-32 14.3-32 32v832c0 17.7 14.3 32 32 32h640c17.7 0 32-14.3 32-32V96c0-17.7-14.3-32-32-32zM647 470.4l-87.2 161h45.9c4.6 0 8.4 3.8 8.4 8.4v25.1c0 4.6-3.8 8.4-8.4 8.4h-63.3v28.6h63.3c4.6 0 8.4 3.8 8.4 8.4v25c.2 4.6-3.6 8.5-8.2 8.5h-63.3v49.9c0 4.6-3.8 8.4-8.4 8.4h-43.7c-4.6 0-8.4-3.8-8.4-8.4v-49.9h-63c-4.6 0-8.4-3.8-8.4-8.4v-25.1c0-4.6 3.8-8.4 8.4-8.4h63v-28.6h-63c-4.6 0-8.4-3.8-8.4-8.4v-25.1c0-4.6 3.8-8.4 8.4-8.4h45.4l-87.5-161c-2.2-4.1-.7-9.1 3.4-11.4 1.3-.6 2.6-1 3.9-1h48.8c3.2 0 6.1 1.8 7.5 4.6l71.9 141.8 71.9-141.9a8.5 8.5 0 017.5-4.6h47.8c4.6 0 8.4 3.8 8.4 8.4-.1 1.5-.5 2.9-1.1 4.1zM512.6 323L289 148h446L512.6 323z"
      :fill="color"
    ></path>
  </svg>
</template>
