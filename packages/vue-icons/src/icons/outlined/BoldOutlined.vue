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
      d="M697.8 481.4c33.6-35 54.2-82.3 54.2-134.3v-10.2C752 229.3 663.9 142 555.3 142H259.4c-15.1 0-27.4 12.3-27.4 27.4v679.1c0 16.3 13.2 29.5 29.5 29.5h318.7c117 0 211.8-94.2 211.8-210.5v-11c0-73-37.4-137.3-94.2-175.1zM328 238h224.7c57.1 0 103.3 44.4 103.3 99.3v9.5c0 54.8-46.3 99.3-103.3 99.3H328V238zm366.6 429.4c0 62.9-51.7 113.9-115.5 113.9H328V542.7h251.1c63.8 0 115.5 51 115.5 113.9v10.8z"
      :fill="color"
    ></path>
  </svg>
</template>
