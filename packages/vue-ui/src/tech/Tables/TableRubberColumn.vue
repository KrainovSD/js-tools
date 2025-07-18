<script setup lang="ts">
  import { shallowRef } from "vue";
  import { VTable } from "../../ui";
  import { createRows } from "./rows";
  import type { Column, RowData } from "./types";

  const rows = shallowRef<RowData[]>(createRows(100, false));
  const column = shallowRef<Column[]>([
    {
      id: "select",
      key: "id",
      name: "",
      sortable: false,
      width: 100,
      additionalCellClass: ["hCenter", "wCenter"],
      cellRender: {
        component: "select",
        props: { hover: true },
      },
      additionalHeaderClass: ["hCenter", "wCenter"],
      headerRender: {
        component: "select",
      },
      expandable: true,
      expandedShift: 10,
      leftFrozen: true,
    },
    {
      key: "firstName",
      name: "firstName",
      minWidth: 250,
    },
    {
      key: "age",
      name: "age",
      maxWidth: 200,
      minWidth: 75,
    },
    {
      key: "sport",
      name: "sport",
      width: 150,
    },
  ]);
</script>

<template>
  <VTable
    :columns="column"
    :rows="rows"
    :virtual-rows="true"
    :with-filters="true"
    :with-pagination="true"
    :full-size="false"
    :rubber-column="true"
    :page-sizes="[5, 10, 25, 50, 100]"
    :initial-pagination="{ pageIndex: 0, pageSize: 100 }"
  />
</template>

<style lang="scss"></style>
