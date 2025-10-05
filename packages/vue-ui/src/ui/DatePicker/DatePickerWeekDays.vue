<script setup lang="ts">
  import { computed } from "vue";
  import type { DatePickerSize } from "./date-picker.types";
  import { generateWeekDay } from "./lib";

  type Props = {
    startWeek: number;
    locale: string;
    size: DatePickerSize;
  };

  const props = defineProps<Props>();
  const startWeek = computed(() => (props.startWeek > 6 ? 0 : props.startWeek));
  const weekDay = computed(() => generateWeekDay(startWeek.value, props.locale));
  const classes = computed(() => ({ [`size-${props.size}`]: true }));
</script>

<template>
  <div class="ksd-date-picker__week-days">
    <div
      v-for="day in weekDay"
      :key="day.value"
      class="ksd-date-picker__week-day ksd-date-picker__cell"
      :class="[{ weekend: day.weekend }, classes]"
    >
      {{ day.label }}
    </div>
  </div>
</template>

<style lang="scss">
  .ksd-date-picker {
    &__week-days {
      display: flex;
      align-items: center;
    }

    &__week-day {
      display: flex;
      align-items: center;
      justify-content: center;
      width: calc(
        var(--ksd-date-picker-cell-width) + var(--ksd-date-picker-cell-padding-inline) * 2
      );
      height: var(--ksd-date-picker-cell-height);

      &.size-large {
        width: calc(
          var(--ksd-date-picker-cell-width-lg) + var(--ksd-date-picker-cell-padding-inline-lg) * 2
        );
        height: var(--ksd-date-picker-cell-height-lg);
      }
    }
  }
</style>
