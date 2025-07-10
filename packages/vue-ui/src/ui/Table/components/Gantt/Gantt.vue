<script setup lang="ts">
  import { useTemplateRef } from "vue";

  const ganttContainerRef = useTemplateRef("gantt");

  defineExpose({ ganttContainerRef });
</script>

<template>
  <div ref="gantt">component</div>
</template>

<style lang="scss" module></style>
