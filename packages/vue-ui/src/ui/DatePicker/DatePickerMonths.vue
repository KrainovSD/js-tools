<script setup lang="ts">
  type Props = {
    finalView: boolean;
  };
  defineProps<Props>();
  defineModel<number>("month", { default: 0 });
</script>

<template>
  <div>component</div>
</template>

<style lang="scss" module></style>
