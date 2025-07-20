<script setup lang="ts" generic="RowData extends DefaultRow">
  import { getByPath, isArray, isObject } from "@krainovsd/js-helpers";
  import { computed } from "vue";
  import type { CellRenderProps, DefaultRow } from "../../../ui/Table/types";

  type Props = {
    pathToObject?: string;
    separator?: string;
  };

  const props = defineProps<CellRenderProps<RowData, Props>>();
  const content = computed(() =>
    props.context.column.accessorFn?.(props.context.row.original, props.context.row.index),
  );
  const checkedContent = computed(() =>
    !isArray(content.value) || content.value.length === 0
      ? null
      : isObject(content.value[0]) && props.settings?.pathToObject
        ? content.value
            .map((obj) => {
              const innerValue = getByPath(obj, props.settings?.pathToObject);

              return innerValue;
            })
            .join(props.settings?.separator ?? ", ")
        : content.value.join(props.settings?.separator ?? ", "),
  );
</script>

<template>
  <div v-if="checkedContent != undefined">
    {{ checkedContent }}
  </div>
</template>

<style lang="scss" module></style>
