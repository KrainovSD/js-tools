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
      d="M511.5 65C719.99 65 889 234.01 889 442.5S719.99 820 511.5 820 134 650.99 134 442.5 303.01 65 511.5 65m0 64C338.36 129 198 269.36 198 442.5S338.36 756 511.5 756 825 615.64 825 442.5 684.64 129 511.5 129M745 889v72H278v-72z"
      :fill="color"
    ></path>
  </svg>
</template>
