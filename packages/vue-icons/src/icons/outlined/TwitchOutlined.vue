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
      d="M166.13 112L114 251.17v556.46h191.2V912h104.4l104.23-104.4h156.5L879 599V112zm69.54 69.5H809.5v382.63L687.77 685.87H496.5L392.27 790.1V685.87h-156.6zM427 529.4h69.5V320.73H427zm191.17 0h69.53V320.73h-69.53z"
      :fill="color"
    ></path>
  </svg>
</template>
