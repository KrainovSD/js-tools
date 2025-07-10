<script setup lang="ts">
  import { ref } from "vue";
  import { VTable } from "../../ui";
  import { COLUMNS } from "./columns";
  import { CELL_RENDERS, FILTER_RENDERS, HEADER_RENDERS } from "./constants";

  type Test = {
    test: string;
  };

  const rows = ref<Test[]>([]);
</script>

<template>
  <VTable :columns="COLUMNS" :rows="rows" />
</template>

<style lang="scss" module></style>
