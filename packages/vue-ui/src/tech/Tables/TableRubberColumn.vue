<script setup lang="ts">
  import { nextTick, shallowRef, useTemplateRef, watch } from "vue";
  import { type ColumnsVisibleState, VButton, VTable } from "../../ui";
  import { createRows } from "./rows";
  import type { Column, RowData } from "./types";

  const tableComponentRef = useTemplateRef("table");

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
      key: "birth",
      name: "birth",
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
  const visibleColumns = shallowRef<ColumnsVisibleState>(
    Object.fromEntries(column.value.map((column) => [column.id ?? column.key, true])),
  );

  function toggleVisible() {
    if (visibleColumns.value?.firstName) {
      visibleColumns.value = { ...visibleColumns.value, firstName: false, birth: true };
    } else {
      visibleColumns.value = { ...visibleColumns.value, firstName: true, birth: false };
    }

    void nextTick(() => {
      tableComponentRef.value?.defineRubberColumnSize?.();
    });
  }

  watch(
    () => tableComponentRef.value?.element,
    (tableRef, _, clean) => {
      if (!tableRef) return;

      const resizeObserver = new ResizeObserver(() => {
        tableComponentRef.value?.defineRubberColumnSize?.();
      });
      resizeObserver.observe(tableRef);

      clean(() => {
        resizeObserver.disconnect();
      });
    },
    { immediate: true },
  );
</script>

<template>
  <div :class="$style.base">
    <VButton @click="toggleVisible">Toggle Columns</VButton>
    <VTable
      ref="table"
      v-model:column-visibility="visibleColumns"
      :columns="column"
      :rows="rows"
      :virtual-rows="true"
      :with-filters="true"
      :with-pagination="true"
      :full-size="false"
      :rubber-column="false"
      :page-sizes="[5, 10, 25, 50, 100]"
      :initial-pagination="{ pageIndex: 0, pageSize: 100 }"
    />
  </div>
</template>

<style lang="scss" module>
  .base {
    display: flex;
    flex-direction: column;
    gap: 10px;
    width: 100%;
  }
</style>
