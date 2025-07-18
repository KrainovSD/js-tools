<script setup lang="ts">
  import { shallowRef } from "vue";
  import { VTable } from "../../ui";
  import { COLUMNS } from "./columns";
  import { createRows } from "./rows";
  import type { RowData } from "./types";

  const rows = shallowRef<RowData[]>(createRows(5000, false));
  const column = shallowRef<typeof COLUMNS>(COLUMNS);
</script>

<template>
  <VTable
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
