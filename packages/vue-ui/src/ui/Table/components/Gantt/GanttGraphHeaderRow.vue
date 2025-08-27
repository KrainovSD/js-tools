<script setup lang="ts">
  import type { GanttHeaderInfo, GanttViewType } from "../../types";
  import GanttGraphHeaderMonth from "./GanttGraphHeaderMonth.vue";
  import GanttGraphHeaderQuarter from "./GanttGraphHeaderQuarter.vue";
  import GanttGraphHeaderWeek from "./GanttGraphHeaderWeek.vue";
  import GanttGraphHeaderYear from "./GanttGraphHeaderYear.vue";

  type Props = {
    headerItems: GanttHeaderInfo[];
    locale: string | undefined;
    columnWidth: number;
    ganttView: GanttViewType;
  };

  defineProps<Props>();
</script>

<template>
  <GanttGraphHeaderWeek
    v-if="$props.ganttView === 'weeks'"
    :column-width="$props.columnWidth"
    :header-items="$props.headerItems"
    :locale="$props.locale"
  />
  <GanttGraphHeaderMonth
    v-if="$props.ganttView === 'months'"
    :column-width="$props.columnWidth"
    :header-items="$props.headerItems"
    :locale="$props.locale"
  />
  <GanttGraphHeaderQuarter
    v-if="$props.ganttView === 'quarters'"
    :column-width="$props.columnWidth"
    :header-items="$props.headerItems"
    :locale="$props.locale"
  />
  <GanttGraphHeaderYear
    v-if="$props.ganttView === 'years'"
    :column-width="$props.columnWidth"
    :header-items="$props.headerItems"
    :locale="$props.locale"
  />
</template>
