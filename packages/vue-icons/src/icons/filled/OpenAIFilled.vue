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
      d="M475.6 112c-74.03 0-139.72 42.38-172.92 104.58v237.28l92.27 56.48 3.38-235.7 189-127.45A194.33 194.33 0 00475.6 112m202.9 62.25c-13.17 0-26.05 1.76-38.8 4.36L453.2 304.36l-1.37 96.15 186.58-125.25 231.22 137.28a195.5 195.5 0 004.87-42.33c0-108.04-87.93-195.96-195.99-195.96M247.34 266C167.34 290.7 109 365.22 109 453.2c0 27.92 5.9 54.83 16.79 79.36l245.48 139.77 90.58-56.12-214.5-131.38zm392.88 74.67l-72.7 48.85L771.5 517.58 797.3 753C867.41 723.11 916 653.97 916 573.1c0-27.55-5.86-54.12-16.57-78.53zm-123 82.6l-66.36 44.56-1.05 76.12 64.7 39.66 69.54-43.04-1.84-76.48zm121.2 76.12l5.87 248.34L443 866.9A195.65 195.65 0 00567.84 912c79.22 0 147.8-46.52 178.62-114.99L719.4 550.22zm-52.86 105.3L372.43 736.68 169.56 621.15a195.35 195.35 0 00-5.22 44.16c0 102.94 79.84 187.41 180.81 195.18L588.2 716.6z"
      :fill="color"
    ></path>
  </svg>
</template>
