<script setup lang="ts" generic="RowData extends DefaultRow">
  import { getByPath, isArray, isBoolean, isId, isObject } from "@krainovsd/js-helpers";
  import { computed } from "vue";
  import Tooltip from "../../../Tooltip.vue";
  import type { ColumnTooltipSettings, DefaultRow } from "../../types";

  export type CellRenderTooltipProps<RowData extends DefaultRow> = {
    settings?: ColumnTooltipSettings<RowData>;
    tooltip?: boolean;
    row: RowData;
    content: string | number | boolean;
  };

  const props = defineProps<CellRenderTooltipProps<RowData>>();
  const zIndex = computed(() => (isObject(props.settings) ? props.settings.zIndex : undefined));
  const autoDetect = computed(() => (isObject(props.settings) ? props.settings.auto : false));
  const content = computed(() => {
    let content = props.content;
    if (isObject(props.settings)) {
      if (props.settings.customContent) {
        content = props.settings.customContent(props.row);
      }
      if (props.settings.pathToContent) {
        const tooltipContent = getByPath(props.row, props.settings.pathToContent);
        if (isId(tooltipContent) || isBoolean(tooltipContent)) {
          content = tooltipContent;
        }
        if (isArray(tooltipContent)) {
          content = tooltipContent.join(props.settings.arraySeparator ?? ", ");
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
