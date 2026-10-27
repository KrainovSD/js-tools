<script setup lang="ts">
  import type { EditorLanguages } from "@/extensions/markdown";

  const language = defineModel<EditorLanguages["name"]>({ required: true });
</script>

<template>
  <select v-model="language" :class="$style.select">
    <option value="markdown">markdown</option>
    <option value="json">json</option>
  </select>
</template>

<style lang="scss" module>
  .select {
    padding: 4px 6px;
    font: inherit;
    border: 1px solid light-dark(#333, #eee);
    border-radius: 4px;
    background: light-dark(#fff, #1e1e1e);
  }
</style>
