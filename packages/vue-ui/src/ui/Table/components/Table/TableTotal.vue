<script setup lang="ts">
  import Text from "../../../Text.vue";
  import type { TableTotalProps } from "../../types";

  defineProps<TableTotalProps>();
</script>

<template>
  <div role="contentinfo" class="ksd-table__total">
    <Text>Всего: {{ $props.totalRows }}</Text>
  </div>
</template>

<style lang="scss">
  .ksd-table__total {
    display: flex;
    padding: 8px;
    border-bottom: 1px solid var(--ksd-table-border);
    border-left: 1px solid var(--ksd-table-border);
    border-right: 1px solid var(--ksd-table-border);
    background: var(--ksd-table-footer-bg);
  }
</style>
