<script setup lang="ts">
  import { shallowRef } from "vue";
  import { VTable } from "../../ui";
  import { COLUMNS } from "./columns";
  import { createRows } from "./rows";
  import type { RowData } from "./types";

  const rows = shallowRef<RowData[]>(createRows(100, false));
  const column = shallowRef<typeof COLUMNS>([
    {
      id: "drag",
      key: "id",
      sortable: false,
      name: "",
      width: 50,
      additionalCellClass: ["hCenter", "wCenter"],
      cellRender: { component: "drag", props: { dragCondition: (row) => row.id % 2 === 0 } },
      leftFrozen: true,
    },
    ...COLUMNS,
  ]);

  function dragRow(sourceId: string, targetId: string) {
    const sourceIndex = rows.value.findIndex((row) => row.id === +sourceId);
    const targetIndex = rows.value.findIndex((row) => row.id === +targetId);
    const source = rows.value[sourceIndex];
    if (sourceIndex === -1 || targetIndex === -1 || !source) return;

    const changedRows = rows.value.toSpliced(sourceIndex, 1);
    changedRows.splice(targetIndex, 0, source);

    rows.value = changedRows;
  }

  function getRowId(row: RowData) {
    return row.id.toString();
  }

  function canDrop(dropId: string) {
    return +dropId % 2 === 0;
  }
</script>

<template>
  <VTable
    :get-row-id="getRowId"
    :columns="column"
    :rows="rows"
    :virtual-rows="true"
    :with-filters="true"
    :with-pagination="true"
    :full-size="false"
    :page-sizes="[5, 10, 25, 50, 100]"
    :initial-pagination="{ pageIndex: 0, pageSize: 100 }"
    :draggable-row="true"
    :can-drop-to-row="canDrop"
    @drag-row="dragRow"
  />
</template>

<style lang="scss"></style>
