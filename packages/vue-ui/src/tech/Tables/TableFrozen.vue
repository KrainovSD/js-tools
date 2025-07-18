<script setup lang="ts">
  import { shallowRef } from "vue";
  import { VTable } from "../../ui";
  import { COLUMNS } from "./columns";
  import { createRows } from "./rows";
  import type { RowData } from "./types";

  const rows = shallowRef<RowData[]>(createRows(100, false));
  const column = shallowRef<typeof COLUMNS>(
    COLUMNS.map((column) => ({
      ...column,
      leftFrozen: column.id === "select" || column.key === "firstName",
      rightFrozen: column.key === "age" || column.key === "birth",
    })),
  );
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
  />
</template>

<style lang="scss"></style>
