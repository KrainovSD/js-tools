<script setup lang="ts">
  import Loader from "../../../Loader.vue";
</script>

<template>
  <div class="ksd-table__loading">
    <div class="ksd-table__loading-blur"></div>
    <Loader type="tertiary" />
  </div>
</template>

<style lang="scss">
  .ksd-table__loading {
    position: absolute;
    inset: 0;
    z-index: 10;
  }

  .ksd-table__loading-blur {
    position: absolute;
    inset: 0;
    opacity: var(--ksd-table-loader-opacity);
    background: var(--ksd-table-loader-bg-color);
  }
</style>
