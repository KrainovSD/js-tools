<script setup lang="ts">
  import { ref, shallowRef } from "vue";
  import { type ColumnFilter, VTable } from "../../ui";
  import { COLUMNS } from "./columns";
  import { FILTER_RENDERS } from "./constants";
  import { createRows } from "./rows";
  import type { RowData } from "./types";

  const rows = shallowRef<RowData[]>(createRows(5000, false));
  const column = shallowRef<typeof COLUMNS>(
    COLUMNS.map((c, i) => {
      switch (i) {
        case 0:
        case 1:
        case 2:
        case 3:
        case 4:
        case 5:
        case 6: {
          return {
            ...c,
            cellClass: ["common"],
            additionalCellClass: ["nowrap", "hCenter", "wCenter", "lineClamp"],
          };
        }
        case 7: {
          return {
            ...c,
            cellClass: ["common"],
            additionalCellClass: ["wCenter", "hCenter", "nowrap"],
          };
        }
        case 8: {
          return {
            ...c,
            cellClass: ["common"],
            additionalCellClass: ["wCenter", "hCenter", "nowrap"],
          };
        }
        case 10: {
          return { ...c, cellClass: ["common"], additionalCellClass: ["lineClamp"] };
        }
        default: {
          return { ...c };
        }
      }
    }),
  );
  const filters = ref<ColumnFilter[]>([
    { id: "firstName", value: "" },
    {
      id: "sport",
      value: "",
    },
  ]);
</script>

<template>
  <VTable
    v-model:column-filters="filters"
    :columns="column"
    :rows="rows"
    :virtual-rows="true"
    :with-filters="true"
    :with-pagination="false"
    :full-size="false"
    :filter-renders="FILTER_RENDERS"
    :virtual-row-size="54"
  />
</template>

<style lang="scss"></style>
