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
  //     column.value = COLUMNS.map((column) => {
  //       if (column.key === "age") {
  //         return {
  //           ...column,
  //           filterType: "number-in-range",
  //         };
  //       }

  //       return column;
  //     });
  //   }, 2000);
  // });
</script>

<template>
  <VTable
    :columns="column"
    :rows="rows"
    :virtual-rows="true"
    :with-filters="true"
    :initial-column-filters="[
      {
        id: 'age',
        value: [18, 19],
      },
    ]"
  />
</template>

<style lang="scss" module></style>
