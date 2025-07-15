<script setup lang="ts" generic="RowData extends DefaultRow">
  import { computed } from "vue";
  import CheckBox from "../../../CheckBox.vue";
  import type { DefaultRow, HeaderRenderProps } from "../../types";

  const props = defineProps<HeaderRenderProps<RowData, unknown>>();
  const checked = computed(() => props.context.table.getIsAllPageRowsSelected());
</script>

<template>
  <div>
    <CheckBox
      :model-value="checked"
      class="check"
      @update:model-value="(value) => $props.context.table.toggleAllPageRowsSelected(value)"
    />
  </div>
</template>

<style lang="scss" module></style>
