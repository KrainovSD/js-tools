<script setup lang="ts">
  import { type SelectItem, VSelect } from "../ui";

  const OPTIONS: SelectItem[] = Array.from({ length: 20 }, (_, i) => ({
    label: `Значение ${i}`,
    value: i,
  }));
</script>

<template>
  <VSelect :class-name-positioner-content="$style.test" :options="OPTIONS" />
</template>

<style lang="scss" module>
  .test {
    max-height: 400px;
  }
</style>
