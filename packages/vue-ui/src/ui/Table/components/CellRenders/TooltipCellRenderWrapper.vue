<script setup lang="ts" generic="RowData extends DefaultRow">
  import { getByPath, isArray, isBoolean, isId, isObject } from "@krainovsd/js-helpers";
  import { computed } from "vue";
  import Tooltip from "../../../Tooltip.vue";
  import type { ColumnTooltipSettings, DefaultRow } from "../../types";

  export type CellRenderTooltipProps<RowData extends DefaultRow> = {
    tooltip?: ColumnTooltipSettings<RowData> | boolean;
    row: RowData;
    content: string | number | boolean;
  };

  const props = defineProps<CellRenderTooltipProps<RowData>>();
  const zIndex = computed(() => (isObject(props.tooltip) ? props.tooltip.zIndex : undefined));
  const autoDetect = computed(() => (isObject(props.tooltip) ? props.tooltip.auto : false));
  const content = computed(() => {
    let content = props.content;
    if (isObject(props.tooltip)) {
      if (props.tooltip.customContent) {
        content = props.tooltip.customContent(props.row);
      }
      if (props.tooltip.pathToContent) {
        const tooltipContent = getByPath(props.row, props.tooltip.pathToContent);
        if (isId(tooltipContent) || isBoolean(tooltipContent)) {
          content = tooltipContent;
        }
        if (isArray(tooltipContent)) {
          content = tooltipContent.join(props.tooltip.arraySeparator ?? ", ");
        }
      }
    }

    return content;
  });
</script>

<template>
  <Tooltip
    v-if="props.tooltip"
    :text="content.toString()"
    :z-index="zIndex"
    :open-not-visible="autoDetect"
  >
    <slot></slot>
  </Tooltip>
  <template v-if="!props.tooltip">
    <slot></slot>
  </template>
</template>
