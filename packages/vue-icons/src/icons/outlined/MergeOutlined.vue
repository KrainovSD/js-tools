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
    <path d="M248 752h72V264h-72z" :fill="color"></path>

    <path
      d="M740 863c61.86 0 112-50.14 112-112 0-48.33-30.6-89.5-73.5-105.2l-.01-113.04a50.73 50.73 0 00-34.95-48.2l-434.9-142.41-22.4 68.42 420.25 137.61.01 95.92C661 658.34 628 700.8 628 751c0 61.86 50.14 112 112 112m-456 61c61.86 0 112-50.14 112-112s-50.14-112-112-112-112 50.14-112 112 50.14 112 112 112m456-125a48 48 0 110-96 48 48 0 010 96m-456 61a48 48 0 110-96 48 48 0 010 96m0-536c61.86 0 112-50.14 112-112s-50.14-112-112-112-112 50.14-112 112 50.14 112 112 112m0-64a48 48 0 110-96 48 48 0 010 96"
      :fill="color"
    ></path>
  </svg>
</template>
