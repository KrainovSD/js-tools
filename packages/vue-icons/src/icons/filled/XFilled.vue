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
    <g :clip-path="`url(#${UNIQUE_ID_NUMBER_1})`">
      <path
        d="M823.11 912H200.9A88.9 88.9 0 01112 823.11V200.9A88.9 88.9 0 01200.89 112H823.1A88.9 88.9 0 01912 200.89V823.1A88.9 88.9 0 01823.11 912"
        :fill="color"
      ></path>

      <path
        d="M740 735H596.94L286 291h143.06zm-126.01-37.65h56.96L412 328.65h-56.96z"
        :fill="color"
      ></path>

      <path
        d="M331.3 735L491 549.73 470.11 522 286 735zM521 460.39L541.21 489 715 289h-44.67z"
        :fill="color"
      ></path>
    </g>
  </svg>
</template>
