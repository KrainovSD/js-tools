<script setup lang="ts" generic="RowData extends DefaultRow">
  import { computed } from "vue";
  import CheckBox from "../../../CheckBox.vue";
  import { checkCellVisible } from "../../lib/check-cell-visible";
  import type { CellContext, CellRenderProps, DefaultRow, RowInterface } from "../../types";

  export type SelectCellRenderProps = {
    hover?: boolean;
  };

  const props = defineProps<CellRenderProps<RowData, SelectCellRenderProps>>();
  const visible = computed(() => checkCellVisible(props.context));
  const number = computed(() => {
    let number: string | number = props.settings?.hover ? props.context.row.index + 1 : 0;

    if (props.context.row.parentId != undefined) {
      function collectNumberRecursively(context: CellContext<RowData>, row: RowInterface<RowData>) {
        let number: number[] = [];

        if (row.parentId != undefined) {
          const parent = context.table.getRow(row.parentId);
          if (parent != undefined) {
            const parentNumber = parent.index + 1;
            number.push(parentNumber);

            const deepParentNumber = collectNumberRecursively(context, parent);
            number = deepParentNumber.concat(number);
          }
        }

        return number;
      }

      const parentNumbers = collectNumberRecursively(props.context, props.context.row);
      parentNumbers.push(number);
      number = parentNumbers.join(".");
    }

    return number;
  });
  const checked = computed(() => props.context.row.getIsSelected());
  const hover = computed(() => !checked.value && props.settings?.hover);
</script>

<template>
  <div
    v-if="visible"
    class="ksd-table__cell-select"
    @click="(event) => event.stopPropagation()"
    @dblclick="(event) => event.stopPropagation()"
  >
    <span v-if="hover" class="number">{{ number }}</span>
    <CheckBox
      :model-value="checked"
      class="check"
      :class="{ visible: !hover }"
      @update:model-value="(value) => $props.context.row.toggleSelected(value)"
    />
  </div>
</template>

<style lang="scss">
  div.ksd-table__cell-select {
    width: 100%;
    height: 100%;
    display: flex;

    & > .number {
      display: block;
    }
    & > .check {
      display: none;

      &.visible {
        display: inline-flex;
      }
    }

    &:hover {
      & > .number {
        display: none;
      }
      & > .check {
        display: inline-flex;
      }
    }
  }
</style>
