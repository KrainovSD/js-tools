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
      d="M120.1 770.6L443 823.2V543.8H120.1v226.8zm63.4-163.5h196.2v141.6l-196.2-31.9V607.1zm340.3 226.5l382 62.2v-352h-382v289.8zm63.4-226.5h255.3v214.4l-255.3-41.6V607.1zm-63.4-415.7v288.8h382V128.1l-382 63.3zm318.7 225.5H587.3V245l255.3-42.3v214.2zm-722.4 63.3H443V201.9l-322.9 53.5v224.8zM183.5 309l196.2-32.5v140.4H183.5V309z"
      :fill="color"
    ></path>
  </svg>
</template>
