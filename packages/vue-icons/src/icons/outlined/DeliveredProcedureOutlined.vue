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
      d="M632 698.3l141.9-112a8 8 0 000-12.6L632 461.7c-5.3-4.2-13-.4-13 6.3v76H295c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h324v76c0 6.7 7.8 10.4 13 6.3zm261.3-405L730.7 130.7c-7.5-7.5-16.7-13-26.7-16V112H144c-17.7 0-32 14.3-32 32v278c0 4.4 3.6 8 8 8h56c4.4 0 8-3.6 8-8V184h136v136c0 17.7 14.3 32 32 32h320c17.7 0 32-14.3 32-32V205.8l136 136V422c0 4.4 3.6 8 8 8h56c4.4 0 8-3.6 8-8v-83.5c0-17-6.7-33.2-18.7-45.2zM640 288H384V184h256v104zm264 436h-56c-4.4 0-8 3.6-8 8v108H184V732c0-4.4-3.6-8-8-8h-56c-4.4 0-8 3.6-8 8v148c0 17.7 14.3 32 32 32h736c17.7 0 32-14.3 32-32V732c0-4.4-3.6-8-8-8z"
      :fill="color"
    ></path>
  </svg>
</template>
