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
      d="M880 298.4H521L403.7 186.2a8.15 8.15 0 00-5.5-2.2H144c-17.7 0-32 14.3-32 32v592c0 17.7 14.3 32 32 32h736c17.7 0 32-14.3 32-32V330.4c0-17.7-14.3-32-32-32zM632 577c0 3.8-3.4 7-7.5 7H540v84.9c0 3.9-3.2 7.1-7 7.1h-42c-3.8 0-7-3.2-7-7.1V584h-84.5c-4.1 0-7.5-3.2-7.5-7v-42c0-3.8 3.4-7 7.5-7H484v-84.9c0-3.9 3.2-7.1 7-7.1h42c3.8 0 7 3.2 7 7.1V528h84.5c4.1 0 7.5 3.2 7.5 7v42z"
      :fill="color"
    ></path>
  </svg>
</template>
