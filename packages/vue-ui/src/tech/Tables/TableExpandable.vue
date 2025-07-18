<script setup lang="ts">
  import { shallowRef } from "vue";
  import { VTable } from "../../ui";
  import { COLUMNS } from "./columns";
  import { createRows } from "./rows";
  import type { RowData } from "./types";

  const rows = shallowRef<RowData[]>(createRows(100, true, 5));
  const column = shallowRef<typeof COLUMNS>([
    ...COLUMNS.map((column) => ({
      ...column,
    })).toSpliced(1, 0, {
      id: "expand",
      name: "",
      key: "id",
      sortable: false,
      width: 50,
      additionalCellClass: ["wCenter", "hCenter"],
      leftFrozen: true,
      cellRender: { component: "expand" },
      grouping: undefined,
    }),
  ]);
  function getSubRows(row: RowData) {
    return row.children;
  }
</script>

<template>
  <VTable
    :columns="column"
    :rows="rows"
    :virtual-rows="false"
    :with-filters="true"
    :with-pagination="true"
    :full-size="false"
    :page-sizes="[5, 10, 25, 50, 100]"
    :initial-pagination="{ pageIndex: 0, pageSize: 100 }"
    :get-sub-rows="getSubRows"
  />
</template>

<style lang="scss"></style>
