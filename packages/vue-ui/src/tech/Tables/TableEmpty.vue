<script setup lang="ts">
  import { shallowRef } from "vue";
  import { VTable } from "../../ui";
  import { COLUMNS } from "./columns";

  const column = shallowRef<typeof COLUMNS>(COLUMNS);
</script>

<template>
  <VTable
    :columns="column"
    :rows="[]"
    :virtual-rows="true"
    :with-filters="true"
    :with-pagination="true"
    :full-size="true"
  />
</template>

<style lang="scss"></style>
