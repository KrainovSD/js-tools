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

  type Quarter = {
    quarter: number;
    months: number;
  };

  const props = defineProps<Props>();
  const rowStyles = {
    minHeight: `${GANTT_HEADER_HEIGHT}px`,
    maxHeight: `${GANTT_HEADER_HEIGHT}px`,
  };
  const monthFormatter = computed(() => new Intl.DateTimeFormat(props.locale, { month: "short" }));
  const firstYear = computed(() => props.headerItems[0]?.year);
  const lastYear = computed(() => props.headerItems[props.headerItems.length - 1].year);

  const quarters = computed(() => {
    if (props.ganttView !== "quarters") return [];

    const quarters: Quarter[] = [];
    let cursor = 0;
    const headerItemsLength = props.headerItems.length;

    for (let i = 0; i < headerItemsLength; i++) {
      const headerItem = props.headerItems[i];
      const monthLength = headerItem.months.length;

      for (let j = 0; j < monthLength; j++) {
        const month = headerItem.months[j];
        if ((month === 0 || month === 3 || month === 6 || month === 9) && quarters[cursor]) {
          cursor++;
        }

        if (!quarters[cursor]) {
          const quarter = Math.floor(month / 3);
          quarters.push({ quarter, months: 0 });
        }

        quarters[cursor].months += 1;
      }
    }

    return quarters;
  });
  function getYearCellWidth(headerItem: GanttHeaderInfo) {
    switch (props.ganttView) {
      case "weeks": {
        return props.columnWidth * headerItem.months.length * 4;
      }
      case "months":
      case "quarters": {
        return props.columnWidth * headerItem.months.length;
      }
      case "years": {
        return props.columnWidth;
      }
      default: {
        return props.columnWidth;
      }
    }
  }
  function getMonthCellWidth() {
    switch (props.ganttView) {
      case "weeks": {
        return props.columnWidth * 4;
      }
      case "months":
      case "quarters": {
        return props.columnWidth;
      }
      default: {
        return props.columnWidth;
      }
    }
  }
</script>

<template>
  <div
    v-if="$props.ganttView === 'years'"
    class="ksd-gantt-graph__header-row years"
    :style="rowStyles"
  >
    <div
      class="ksd-gantt-graph__header-cell years center"
      :style="{
        minWidth: `${$props.columnWidth * $props.headerItems.length}px`,
        maxWidth: `${$props.columnWidth * $props.headerItems.length}px`,
      }"
    >
      {{ firstYear !== lastYear ? `${firstYear} - ${lastYear}` : firstYear }}
    </div>
  </div>
  <div
    v-if="
      $props.ganttView === 'years' ||
      $props.ganttView === 'quarters' ||
      $props.ganttView === 'months' ||
      $props.ganttView === 'weeks'
    "
    class="ksd-gantt-graph__header-row year"
    :style="rowStyles"
  >
    <div
      v-for="headerItem in $props.headerItems"
      :key="headerItem.year"
      class="ksd-gantt-graph__header-cell year"
      :class="{ center: $props.ganttView !== 'years' }"
      :style="{
        minWidth: `${getYearCellWidth(headerItem)}px`,
        maxWidth: `${getYearCellWidth(headerItem)}px`,
      }"
    >
      {{ headerItem.year }}
    </div>
  </div>
  <div
    v-if="$props.ganttView === 'quarters'"
    class="ksd-gantt-graph__header-row quarter"
    :style="rowStyles"
  >
    <div
      v-for="quarter in quarters"
      :key="quarter.quarter"
      class="ksd-gantt-graph__header-cell quarter center"
      :style="{
        minWidth: `${$props.columnWidth * quarter.months}px`,
        maxWidth: `${$props.columnWidth * quarter.months}px`,
      }"
    >
      {{ `Q${quarter.quarter + 1}` }}
    </div>
  </div>
  <div
    v-if="
      $props.ganttView === 'quarters' ||
      $props.ganttView === 'months' ||
      $props.ganttView === 'weeks'
    "
    class="ksd-gantt-graph__header-row month"
    :style="rowStyles"
  >
    <template v-for="headerItem in $props.headerItems" :key="headerItem.year">
      <div
        v-for="month in headerItem.months"
        :key="`${headerItem.year}:${month}`"
        class="ksd-gantt-graph__header-cell month"
        :style="{
          minWidth: `${getMonthCellWidth()}px`,
          maxWidth: `${getMonthCellWidth()}px`,
        }"
      >
        {{ getMonthName(month, $props.locale, "short", monthFormatter) }}
      </div>
    </template>
  </div>
  <div
    v-if="$props.ganttView === 'weeks'"
    class="ksd-gantt-graph__header-row week"
    :style="rowStyles"
  >
    <template v-for="headerItem in $props.headerItems" :key="headerItem.year">
      <template v-for="month in headerItem.months" :key="`${headerItem.year}:${month}`">
        <div
          v-for="week in GANTT_WEEK_ARRAY"
          :key="`${headerItem.year}:${month}:${week}`"
          class="ksd-gantt-graph__header-cell week"
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

      &.center {
        justify-content: center;
      }
    }
  }
</style>
