<script setup lang="ts">
  import { shallowRef } from "vue";
  import { VTable } from "../../ui";
  import { COLUMNS } from "./columns";
  import { createRows } from "./rows";
  import type { Column, RowData } from "./types";

  const rows = shallowRef<RowData[]>(createRows(5000, false));
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
    ...Array.from<unknown, Column[]>({ length: 10 }, (_, index) =>
      COLUMNS.toSpliced(0, 1).map<Column>((column) => ({
        ...column,
        id: `${index}:${column.id ?? column.key}`,
        name: `${index}:${column.name}`,
      })),
    ).flat(1),
  ]);
</script>

<template>
  <VTable
    :columns="column"
    :rows="rows"
    :virtual-column="true"
    :virtual-rows="true"
    :with-filters="true"
    :with-pagination="false"
    :full-size="false"
    :virtual-row-size="54"
    :row-height="54"
    :header-height="35"
  />
</template>

<style lang="scss"></style>
