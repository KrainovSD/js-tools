<script setup lang="ts" generic="RowData extends DefaultRow">
  import {
    dateFormat,
    getByPath,
    isArray,
    isBoolean,
    isId,
    isNullable,
    isNumber,
    isObject,
  } from "@krainovsd/js-helpers";
  import { type Component, computed } from "vue";
  import { checkCellVisible } from "../../lib/check-cell-visible";
  import type { CellContext, CellRenderProps, DefaultRow } from "../../types";
  import TooltipCellRenderWrapper from "./TooltipCellRenderWrapper.vue";

  export type DefaultCellRenderProps<RowData extends DefaultRow> = {
    arraySeparator?: string;
    objectPath?: string;
    mappings?: Record<string, string | number | React.ReactNode>;
    Link?: Component<{ context: CellContext<RowData> }>;
    floatRound?: boolean;
    floatFixed?: number;
    dateFormat?: string;
    customContent?: (context: CellContext<RowData>) => string | number | boolean;
    Content?: Component<{ context: CellContext<RowData> }>;
  };

  const props = defineProps<CellRenderProps<RowData, DefaultCellRenderProps<RowData>>>();
  const column = computed(() => props.context.column.columnDef);
  const visible = computed(() => checkCellVisible(props.context));
  const expandable = computed(() => column.value.expandable && props.context.row.getCanExpand());
  const Expander = computed(() => props.context.table.options.meta?.renderers?.expander);
  const Link = computed(() => props.settings?.Link);
  const Content = computed(() => props.settings?.Content);

  const content = computed(() => {
    const initialContent: unknown = props.context.column.accessorFn?.(
      props.context.row.original,
      props.context.row.index,
    );
    let content = initialContent;
    if (isObject(initialContent) && props.settings?.objectPath) {
      content = getByPath(initialContent, props.settings?.objectPath);
    }
    if (isArray(initialContent) && props.settings?.arraySeparator) {
      if (isObject(initialContent[0]) && props.settings?.objectPath) {
        content = initialContent
          .reduce((acc: string[], item) => {
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            const innerContent = getByPath(item, props.settings!.objectPath!);
            // eslint-disable-next-line @typescript-eslint/no-base-to-string
            if (!isNullable(innerContent)) acc.push(String(innerContent));

            return acc;
          }, [])
          .join(props.settings?.arraySeparator);
      } else {
        content = initialContent.join(props.settings?.arraySeparator);
      }
    }
    if (isNumber(initialContent)) {
      if (props.settings?.floatRound) {
        content = Math.round(initialContent);
      }
      if (props.settings?.floatFixed != undefined) {
        content = initialContent.toFixed(props.settings?.floatFixed);
      }
    }
    if (isObject(props.settings?.mappings)) {
      content = props.settings?.mappings[String(initialContent)];
    }
    if (isId(initialContent) && props.settings?.dateFormat) {
      content = dateFormat(initialContent, props.settings?.dateFormat);
    }
    if (props.settings?.customContent) {
      content = props.settings?.customContent(props.context);
    }

    return content;
  });
</script>

<template>
  <div>
    <component :is="Content" v-if="visible && Content" :context="$props.context" />
    <template v-if="visible && (isId(content) || isBoolean(content)) && !Content">
      <component :is="Expander" v-if="expandable && Expander" :context="$props.context" />
      <component :is="Link" v-if="Link" :context="$props.context">
        <TooltipCellRenderWrapper
          :content="content"
          :row="$props.context.row.original"
          :tooltip="!!column.tooltip"
          :settings="isObject(column.tooltip) ? column.tooltip : undefined"
        >
          <span class="ksd-table__cell-default-text"> {{ content }}</span>
        </TooltipCellRenderWrapper>
      </component>
      <TooltipCellRenderWrapper
        v-if="!Link"
        :content="content"
        :row="props.context.row.original"
        :tooltip="!!column.tooltip"
        :settings="isObject(column.tooltip) ? column.tooltip : undefined"
      >
        <span class="ksd-table__cell-default-text"> {{ content }}</span>
      </TooltipCellRenderWrapper>
    </template>
  </div>
</template>

<style lang="scss">
  .ksd-table {
    &__cell-default-text {
      text-overflow: ellipsis;
      overflow: hidden;
      max-width: 100%;
      display: block;
    }
  }
</style>
