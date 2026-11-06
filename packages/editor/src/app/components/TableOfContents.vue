<script setup lang="ts">
  import type { HeaderEntry } from "@/extensions/markdown";

  type Props = {
    headers: HeaderEntry[];
  };
  type Emits = {
    select: [header: HeaderEntry];
  };

  defineProps<Props>();
  const emit = defineEmits<Emits>();
</script>

<template>
  <ul :class="$style.toc">
    <li v-for="header in headers" :key="`${header.id}-${header.from}`">
      <button
        :class="$style.item"
        :style="{ paddingInlineStart: `${(header.level - 1) * 10}px` }"
        type="button"
        :title="header.text"
        @click="emit('select', header)"
      >
        {{ header.text }}
      </button>
    </li>
  </ul>
</template>

<style lang="scss" module>
  .toc {
    display: flex;
    flex: 0 0 350px;
    flex-direction: column;
    gap: 2px;
    min-height: 0;
    margin: 0;
    padding: 8px 4px;
    overflow-y: auto;
    list-style: none;
    border: 1px solid currentColor;
  }

  .item {
    display: block;
    width: 100%;
    padding-block: 2px;
    padding-inline-end: 2px;
    overflow: hidden;
    border: none;
    background: none;
    color: inherit;
    font: inherit;
    text-align: start;
    text-overflow: ellipsis;
    white-space: nowrap;
    cursor: pointer;

    &:hover {
      text-decoration: underline;
    }
  }
</style>
