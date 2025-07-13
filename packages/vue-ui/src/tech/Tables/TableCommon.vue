<script setup lang="ts">
  import { onMounted, shallowRef } from "vue";
  import { useWatchDebug } from "../../hooks";
  import { VInput, VTable } from "../../ui";
  import type { ColumnFiltersState } from "../../ui/Table/types";
  import { COLUMNS } from "./columns";
  import type { RowData } from "./types";

  const rows = shallowRef<RowData[]>([]);
  const column = shallowRef<typeof COLUMNS>([]);
  const pageSizes = shallowRef<number[]>([]);
  const filter = shallowRef<ColumnFiltersState>([]);

  onMounted(() => {
    setTimeout(() => {
      column.value = COLUMNS;
      rows.value = [{ test: "filterMe" }];
      // pageSizes.value = [20];
      console.log("CHANGED");
    }, 2000);
  });
</script>

<template>
  <VTable v-model:column-filters="filter" :columns="column" :rows="rows" :page-sizes="pageSizes" />
  <VInput />
</template>

<style lang="scss" module></style>
