<script setup lang="ts">
  import { onMounted, shallowRef } from "vue";
  import { VTable } from "../../ui";
  import type { ColumnFiltersState } from "../../ui/Table/types";
  import { COLUMNS } from "./columns";
  import { createRows } from "./rows";
  import type { RowData } from "./types";

  const rows = shallowRef<RowData[]>(createRows(1000, false));
  const column = shallowRef<typeof COLUMNS>(COLUMNS);
  const pageSizes = shallowRef<number[]>([]);
  const filter = shallowRef<ColumnFiltersState>([]);

  onMounted(() => {
    setTimeout(() => {
      column.value = COLUMNS;
      rows.value = createRows(1000, false);
      console.log("CHANGED");
    }, 2000);
  });
</script>

<template>
  <VTable
    v-model:column-filters="filter"
    :columns="column"
    :rows="rows"
    :page-sizes="pageSizes"
    :virtual-rows="true"
  />
</template>

<style lang="scss" module></style>
