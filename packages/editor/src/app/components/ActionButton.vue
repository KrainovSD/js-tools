<script setup lang="ts">
  type Props = { disabled?: boolean };

  withDefaults(defineProps<Props>(), { disabled: false });
</script>

<template>
  <button type="button" :class="$style.button" :disabled="$props.disabled">
    <slot></slot>
  </button>
</template>

<style lang="scss" module>
  .button {
    padding: 4px 10px;
    font: inherit;
    cursor: pointer;
    border: 1px solid light-dark(#333, #eee);
    border-radius: 4px;
    background: light-dark(#fff, #1e1e1e);

    &:disabled {
      opacity: 0.5;
      cursor: default;
    }
  }
</style>
