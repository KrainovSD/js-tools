<script setup lang="ts">
  type Props = {
    ellipsis?: boolean;
    nowrap?: boolean;
  };

  defineProps<Props>();
</script>

<template>
  <span :class="[{ base: true, ellipsis: $props.ellipsis, nowrap: $props.nowrap }]"
    ><slot></slot
  ></span>
</template>

<style lang="scss" scoped>
  .base {
    font-family: var(--ksd-font-family);
    font-weight: var(--ksd-font-weight);
    line-height: var(--ksd-line-height);
    font-size: 1rem;
    color: var(--ksd-text-main-color);
    word-break: break-word;
  }

  .nowrap {
    white-space: nowrap;
  }

  .ellipsis {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    display: inline-block;
    max-width: 100%;
  }
</style>
