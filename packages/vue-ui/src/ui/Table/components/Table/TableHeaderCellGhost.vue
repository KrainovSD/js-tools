<script setup lang="ts" generic="RowData extends DefaultRow">
  import { computed } from "vue";
  import type { DefaultRow, HeaderInterface } from "../../types";

  type Props = {
    header: HeaderInterface<RowData>;
  };
  const props = defineProps<Props>();
  const headerContext = computed(() => props.header.getContext());
  const HeaderRender = computed(() => props.header.column.columnDef.headerRender);
  const headerConfigClasses = computed(() =>
    props.header.column.columnDef.headerClass.map((className) =>
      className instanceof Function
        ? className(headerContext.value, props.header.column.columnDef.headerClassProps)
        : className,
    ),
  );
</script>

<template>
  <div class="ksd-table__header-cell ghost" :class="[headerConfigClasses]">
    <component
      :is="HeaderRender"
      v-if="HeaderRender"
      :context="headerContext"
      :settings="headerContext.column.columnDef.headerRenderProps"
    />
  </div>
</template>

<style lang="scss">
  .ksd-table {
    &__header-cell {
      &.ghost {
        background-color: var(--ksd-table-header-bg);
      }
    }
  }
</style>
