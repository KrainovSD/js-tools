<script setup lang="ts">
  import { VSyncOutlined } from "@krainovsd/vue-icons";
</script>

<template>
  <VSyncOutlined class="rotate" />
</template>

<style lang="scss" scoped>
  .rotate {
    animation: spin 1s linear infinite;

    @keyframes spin {
      from {
        transform: rotate(0deg);
      }
      to {
        transform: rotate(360deg);
      }
    }
  }
</style>
