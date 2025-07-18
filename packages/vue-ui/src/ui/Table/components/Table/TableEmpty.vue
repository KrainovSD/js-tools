<script setup lang="ts">
  import Empty from "../../../Empty.vue";
</script>

<template>
  <Empty class="ksd-table__empty" />
</template>

<style lang="scss">
  .ksd-table__empty {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    justify-content: center;
    padding: var(--ksd-padding);
    z-index: 10;
    pointer-events: none;
  }
</style>
