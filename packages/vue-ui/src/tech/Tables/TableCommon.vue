<script setup lang="ts">
  import { shallowRef } from "vue";
  import { VTable } from "../../ui";
  import { COLUMNS } from "./columns";
  import { createRows } from "./rows";
  import type { RowData } from "./types";

  const rows = shallowRef<RowData[]>(createRows(100, false));
  const column = shallowRef<typeof COLUMNS>(COLUMNS);

  // onMounted(() => {
  //   setTimeout(() => {
  //     column.value = COLUMNS;
  //     rows.value = createRows(100, false);
  //     console.log("CHANGED");
  //   }, 2000);
  // });
</script>

<template>
  <VTable :columns="column" :rows="rows" :virtual-rows="false" :with-filters="true" />
</template>

<style lang="scss" module></style>
