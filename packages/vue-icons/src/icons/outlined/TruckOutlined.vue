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
      d="M608 192a32 32 0 0132 32v160h174.81a32 32 0 0126.68 14.33l113.19 170.84a32 32 0 015.32 17.68V672a32 32 0 01-32 32h-96c0 70.7-57.3 128-128 128s-128-57.3-128-128H384c0 70.7-57.3 128-128 128s-128-57.3-128-128H96a32 32 0 01-32-32V224a32 32 0 0132-32zM256 640a64 64 0 000 128h1.06A64 64 0 00256 640m448 0a64 64 0 000 128h1.06A64 64 0 00704 640M576 256H128v384h17.12c22.13-38.26 63.5-64 110.88-64 47.38 0 88.75 25.74 110.88 64H576zm221.63 192H640v145.12A127.43 127.43 0 01704 576c47.38 0 88.75 25.74 110.88 64H896v-43.52zM500 448a12 12 0 0112 12v40a12 12 0 01-12 12H332a12 12 0 01-12-12v-40a12 12 0 0112-12zM308 320a12 12 0 0112 12v40a12 12 0 01-12 12H204a12 12 0 01-12-12v-40a12 12 0 0112-12z"
      :fill="color"
    ></path>
  </svg>
</template>
