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
      d="M505.5 658.7c3.2 4.4 9.7 4.4 12.9 0l178-246c3.8-5.3 0-12.7-6.5-12.7H643c-10.2 0-19.9 4.9-25.9 13.2L512 558.6 406.8 413.2c-6-8.3-15.6-13.2-25.9-13.2H334c-6.5 0-10.3 7.4-6.5 12.7l178 246z"
      :fill="color"
    ></path>

    <path
      d="M880 112H144c-17.7 0-32 14.3-32 32v736c0 17.7 14.3 32 32 32h736c17.7 0 32-14.3 32-32V144c0-17.7-14.3-32-32-32zm-40 728H184V184h656v656z"
      :fill="color"
    ></path>
  </svg>
</template>
