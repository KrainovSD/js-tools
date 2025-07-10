<script
  setup
  lang="ts"
  generic="
    RowData extends DefaultRow,
    GanttData extends DefaultGanttData,
    CellRender extends Record<string, CellRenderComponent<RowData>> = {},
    HeaderRender extends Record<string, HeaderRenderComponent<RowData>> = {},
    FilterRender extends Record<string, FilterRenderComponent<RowData>> = {},
    SortRender extends Record<string, SortRenderComponent<RowData>> = {},
    CellClass extends Record<string, CellClassInterface<RowData>> = {},
    HeaderClass extends Record<string, HeaderClassInterface<RowData>> = {},
    FilterType extends Record<string, FilterFn<RowData>> = {},
    SortType extends Record<string, SortFn<RowData>> = {}
  "
>
  import type {
    CellClassInterface,
    CellRenderComponent,
    DefaultGanttData,
    DefaultRow,
    FilterFn,
    FilterRenderComponent,
    HeaderClassInterface,
    HeaderRenderComponent,
    SortFn,
    SortRenderComponent,
    TableProps,
  } from "./types";

  defineProps<
    TableProps<
      RowData,
      GanttData,
      CellRender,
      HeaderRender,
      FilterRender,
      SortRender,
      CellClass,
      HeaderClass,
      FilterType,
      SortType
    >
  >();
</script>

<template>
  <div>component</div>
</template>

<style lang="scss" module></style>
