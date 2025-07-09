<script
  setup
  lang="ts"
  generic="
    RowData extends DefaultRow,
    GanttData extends DefaultGanttData,
    CellRender extends Record<string, CellRenderComponent<RowData>>,
    HeaderRender extends Record<string, HeaderRenderComponent<RowData>>,
    FilterRender extends Record<string, FilterRenderComponent<RowData>>,
    SortRender extends Record<string, SortRenderComponent<RowData>>,
    CellClass extends Record<string, string | CellClassFn<RowData>>,
    HeaderClass extends Record<string, string | HeaderClassFn<RowData>>,
    FilterType extends Record<string, FilterFn<RowData>>,
    SortType extends Record<string, SortFn<RowData>>
  "
>
  import type {
    CellClassFn,
    CellRenderComponent,
    DefaultGanttData,
    DefaultRow,
    FilterFn,
    FilterRenderComponent,
    HeaderClassFn,
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
