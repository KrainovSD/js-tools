<script setup lang="ts">
  import { getUniqueId } from "../../lib";
  import type { IconProps } from "../../types";

  const { size, color = "currentColor" } = defineProps<IconProps>();

  const UNIQUE_ID_NUMBER_1 = getUniqueId();
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
    <g :clip-path="`url(#${UNIQUE_ID_NUMBER_1})`" filter="url(#a)" transform="translate(9 9)">
      <path
        d="M185.14 112L128 254.86V797.7h171.43V912H413.7L528 797.71h142.86l200-200V112zm314.29 428.57H413.7V310.21h85.72zm200 0H613.7V310.21h85.72z"
        :fill="color"
      ></path>
    </g>
  </svg>
</template>
