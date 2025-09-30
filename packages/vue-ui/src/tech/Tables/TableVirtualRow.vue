<script setup lang="ts">
  import { ref, shallowRef } from "vue";
  import { type ColumnFilter, VTable } from "../../ui";
  import { COLUMNS } from "./columns";
  import { createRows } from "./rows";
  import type { RowData } from "./types";

  const rows = shallowRef<RowData[]>(createRows(5000, false));
  const column = shallowRef<typeof COLUMNS>(COLUMNS);
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
    :virtual-row-size="54"
  />
</template>

<style lang="scss"></style>
