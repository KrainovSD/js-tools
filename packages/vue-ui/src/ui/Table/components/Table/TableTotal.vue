<script setup lang="ts">
  import Text from "../../../Text.vue";

  type Props = {
    totalRows: number;
  };

  defineProps<Props>();
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
