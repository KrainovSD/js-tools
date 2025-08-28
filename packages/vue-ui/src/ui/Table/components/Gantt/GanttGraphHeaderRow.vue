<script setup lang="ts">
  import { computed } from "vue";
  import { GANTT_HEADER_HEIGHT, GANTT_WEEK_ARRAY } from "../../constants";
  import { getMonthName } from "../../lib";
  import type { GanttHeaderInfo, GanttViewType } from "../../types";

  type Props = {
    headerItems: GanttHeaderInfo[];
    locale: string | undefined;
    columnWidth: number;
    ganttView: GanttViewType;
  };

  const props = defineProps<Props>();
  const rowStyles = {
    minHeight: `${GANTT_HEADER_HEIGHT}px`,
    maxHeight: `${GANTT_HEADER_HEIGHT}px`,
  };
  const monthFormatter = computed(() => new Intl.DateTimeFormat(props.locale, { month: "short" }));
</script>

<template>
  <template v-if="$props.ganttView === 'weeks'">
    <div class="ksd-gantt-graph__header-row" :style="rowStyles">
      <div
        v-for="headerItem in $props.headerItems"
        :key="headerItem.year"
        class="ksd-gantt-graph__header-cell year"
        :style="{
          minWidth: `${$props.columnWidth * headerItem.months.length * 4}px`,
          maxWidth: `${$props.columnWidth * headerItem.months.length * 4}px`,
        }"
      >
        {{ headerItem.year }}
      </div>
    </div>
    <div class="ksd-gantt-graph__header-row" :style="rowStyles">
      <template v-for="headerItem in $props.headerItems" :key="headerItem.year">
        <div
          v-for="month in headerItem.months"
          :key="`${headerItem.year}:${month}`"
          class="ksd-gantt-graph__header-cell year"
          :style="{
            minWidth: `${$props.columnWidth * 4}px`,
            maxWidth: `${$props.columnWidth * 4}px`,
          }"
        >
          {{ getMonthName(month, $props.locale, "short", monthFormatter) }}
        </div>
      </template>
    </div>
    <div class="ksd-gantt-graph__header-row" :style="rowStyles">
      <template v-for="headerItem in $props.headerItems" :key="headerItem.year">
        <template v-for="month in headerItem.months" :key="`${headerItem.year}:${month}`">
          <div
            v-for="week in GANTT_WEEK_ARRAY"
            :key="`${headerItem.year}:${month}:${week}`"
            class="ksd-gantt-graph__header-cell year"
            :style="{
              minWidth: `${$props.columnWidth}px`,
              maxWidth: `${$props.columnWidth}px`,
            }"
          >
            {{ `W${week + 1}` }}
          </div>
        </template>
      </template>
    </div>
  </template>
</template>

<style lang="scss">
  .ksd-gantt-graph {
    &__header-row {
      background-color: var(--ksd-table-header-bg);
      overflow: initial;
      display: flex;
    }

    &__header-cell {
      position: relative;
      border-block-end: 1px solid var(--ksd-table-border);
      border-inline-end: 1px solid var(--ksd-table-border);
      padding: 0 8px;
      border-spacing: 0px;
      overflow: hidden;
      white-space: pre-wrap;
      background: var(--ksd-table-header-cell-bg);
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 8px;
      color: var(--ksd-table-text-color);
      line-height: 22px;
      font-size: 14px;
      font-weight: 500;
      font-family: var(--ksd-table-font-family);

      &.year {
        justify-content: center;
      }
    }
  }
</style>
