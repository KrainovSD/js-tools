<script setup lang="ts" generic="RowData extends DefaultRow">
  import { isArray, isBoolean, isId, isObject } from "@krainovsd/js-helpers";
  import { computed } from "vue";
  import Tag, { type TagColor, type TagSize } from "../../../Tag.vue";
  import { checkCellVisible } from "../../lib/check-cell-visible";
  import type { CellRenderProps, DefaultRow } from "../../types";
  import TooltipCellRenderWrapper from "./TooltipCellRenderWrapper.vue";

  export type TagCellRenderProps = {
    // eslint-disable-next-line @typescript-eslint/no-redundant-type-constituents
    color?: TagColor | ((content: unknown) => TagColor);
    mappings?: Record<string, string>;
    bordered?: boolean;
    filterable?: boolean;
    size?: TagSize;
  };

  export type TagContent = {
    label: string;
    value: string | number | boolean;
    color: TagColor;
  };

  const props = defineProps<CellRenderProps<RowData, TagCellRenderProps>>();
  const column = computed(() => props.context.column.columnDef);
  const visible = computed(() => checkCellVisible(props.context));
  const expandable = computed(() => column.value.expandable && props.context.row.getCanExpand());
  const filterable = computed(() => column.value.enableColumnFilter && props.settings?.filterable);
  const Expander = computed(() => props.context.table.options.meta?.renderers?.expander);

  const content = computed(() => {
    let initialContent: unknown[] = props.context.column.accessorFn?.(
      props.context.row.original,
      props.context.row.index,
    ) as unknown[];
    if (!isArray(initialContent)) {
      initialContent = [initialContent];
    }
    const content: TagContent[] = initialContent.reduce((acc: TagContent[], content) => {
      if ((isId(content) || isBoolean(content)) && content !== "") {
        let color: TagColor = "default";
        let label = String(content);

        if (props.settings?.color) {
          if (typeof props.settings?.color === "function") {
            color = props.settings?.color(content);
          } else {
            color = props.settings?.color;
          }
        }
        if (isObject(props.settings?.mappings)) {
          label = props.settings?.mappings[label] ?? content;
        }

        acc.push({ color, value: content, label });
      }

      return acc;
    }, []);

    return content;
  });

  function setFilter(event: MouseEvent, value: unknown) {
    if (!filterable.value) return;

    event.stopPropagation();

    const filterRenderProps = (
      props.context.column.columnDef.filterRenders?.find?.(
        (filter) => filter.operatorValue === props.context.column.columnDef.filterFn,
      ) ?? props.context.column.columnDef.filterRenders?.[0]
    )?.props;
    const multiple =
      isObject(filterRenderProps) && "multiple" in filterRenderProps
        ? filterRenderProps.multiple
        : false;

    const filterValue = props.context.column.getFilterValue();

    if (multiple) {
      const checkedFilterValue = isArray(filterValue) ? [...filterValue] : [];

      const oldIndex = checkedFilterValue.findIndex((fv) => fv === value);
      if (oldIndex != -1) {
        checkedFilterValue.splice(oldIndex, 1);
      } else {
        checkedFilterValue.push(value);
      }

      if (checkedFilterValue.length === 0) {
        props.context.column.setFilterValue(undefined);
      } else {
        props.context.column.setFilterValue(checkedFilterValue);
      }
    } else {
      props.context.column.setFilterValue(value);
    }
  }
</script>

<template>
  <template v-if="visible">
    <div class="ksd-table__cell-tag-container">
      <component :is="Expander" v-if="expandable && Expander" :context="$props.context" />

      <TooltipCellRenderWrapper
        :content="
          content
            .map((tag) => tag.label)
            .join(isObject(column.tooltip) ? (column.tooltip.arraySeparator ?? ', ') : ', ')
        "
        :row="$props.context.row.original"
        :tooltip="!!column.tooltip"
        :settings="isObject(column.tooltip) ? column.tooltip : undefined"
      >
        <div class="ksd-table__cell-tag-wrapper">
          <Tag
            v-for="tag in content"
            :key="String(tag.value)"
            :color="tag.color"
            :borderless="$props.settings?.bordered != undefined && !$props.settings.bordered"
            :size="$props.settings?.size ?? 'default'"
            class="ksd-table__cell-tag"
            :style="{ cursor: filterable ? 'pointer' : 'inherit' }"
            :tabindex="$props.settings?.filterable ? 0 : undefined"
            @click="
              (event: MouseEvent) => {
                event.stopPropagation();
                setFilter(event, tag.value);
              }
            "
            @dblclick="(event: MouseEvent) => event.stopPropagation()"
            @keydown="
              (event: KeyboardEvent) => {
                if (event.key === 'Enter' || event.key === ' ') {
                  event.preventDefault();
                  event.stopPropagation();
                  (event.currentTarget as HTMLElement).click();
                }
              }
            "
          >
            {{ tag.label }}
          </Tag>
        </div>
      </TooltipCellRenderWrapper>
    </div>
  </template>
</template>

<style lang="scss">
  span.ksd-table__cell-tag {
    display: inline-block;
    max-width: 100%;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    position: relative;
  }
  .ksd-table {
    &__cell {
      & > div.ksd-table__cell-tag-container {
        height: fit-content;
      }
    }
    &__cell-tag-wrapper {
      display: flex;
      gap: inherit;
      overflow: hidden;
      max-width: 100%;
      height: fit-content;
      width: fit-content;
    }
  }
</style>
