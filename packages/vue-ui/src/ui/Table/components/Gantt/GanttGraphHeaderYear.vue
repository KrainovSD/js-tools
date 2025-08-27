<script setup lang="ts">
  import type { GanttHeaderInfo } from "../../types";

  type Props = {
    headerItems: GanttHeaderInfo[];
    locale: string | undefined;
    columnWidth: number;
  };

  const props = defineProps<Props>();
</script>

<template>
  <div>component</div>
</template>

<style lang="scss"></style>
