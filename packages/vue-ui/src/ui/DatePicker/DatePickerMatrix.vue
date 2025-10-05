<script setup lang="ts">
  import { isId } from "@krainovsd/js-helpers";
  import { computed, ref } from "vue";
  import type {
    DatePickerCell,
    DatePickerLocalView,
    DatePickerSize,
    DatePickerView,
  } from "./date-picker.types";
  import {
    generateDateMatrix,
    generateDecadeMatrix,
    generateMonthMatrix,
    generateYearMatrix,
    getDayId,
    getMonthId,
  } from "./lib";
  import { isGreatestDate } from "./lib/is-greatest-date";

  type Props = {
    century: number;
    startWeek: number;
    locale: string;
    size: DatePickerSize;
    multiple: boolean;
    targetView: DatePickerView;
  };

  const props = defineProps<Props>();
  const model = defineModel<(Date | string | number | null)[]>({ default: [] });
  const month = defineModel<number>("month", { default: 0 });
  const year = defineModel<number>("year", { default: 0 });
  const decade = defineModel<number>("decade", { default: 0 });
  const view = defineModel<DatePickerLocalView>("view", { default: "days" });

  const startWeek = computed(() => (props.startWeek > 6 ? 0 : props.startWeek));
  const daysMatrix = computed<DatePickerCell[][]>(() => {
    if (view.value === "days") {
      return generateDateMatrix(year.value, month.value, startWeek.value);
    } else if (view.value === "months") {
      return generateMonthMatrix(year.value, props.locale);
    } else if (view.value === "years") {
      return generateYearMatrix(decade.value);
    } else if (view.value === "decades") {
      return generateDecadeMatrix(props.century);
    }

    return [];
  });

  const classes = computed(() => ({ [`size-${props.size}`]: true, [`view-${view.value}`]: true }));
  const hoveredDateId = ref<number | null>(null);

  const firstDate = computed(() => (isId(model.value[0]) ? new Date(model.value[0]) : undefined));
  const secondDate = computed(() => (isId(model.value[1]) ? new Date(model.value[1]) : undefined));
  const firstDateId = computed(() => {
    if (props.targetView === "days") {
      return firstDate.value != undefined
        ? getDayId(
            firstDate.value.getFullYear(),
            firstDate.value.getMonth(),
            firstDate.value.getDate(),
          )
        : undefined;
    } else if (props.targetView === "months") {
      return firstDate.value != undefined
        ? getMonthId(firstDate.value.getFullYear(), firstDate.value.getMonth())
        : undefined;
    } else if (props.targetView === "years") {
      return firstDate.value != undefined ? firstDate.value.getFullYear() : undefined;
    }

    return undefined;
  });
  const secondDateId = computed(() => {
    if (props.targetView === "days") {
      return secondDate.value != undefined
        ? getDayId(
            secondDate.value.getFullYear(),
            secondDate.value.getMonth(),
            secondDate.value.getDate(),
          )
        : undefined;
    } else if (props.targetView === "months") {
      return secondDate.value != undefined
        ? getMonthId(secondDate.value.getFullYear(), secondDate.value.getMonth())
        : undefined;
    } else if (props.targetView === "years") {
      return secondDate.value != undefined ? secondDate.value.getFullYear() : undefined;
    }

    return undefined;
  });
  const range = computed(() => props.multiple && props.targetView === view.value);

  function onClickDay(event: MouseEvent, day: DatePickerCell) {
    if (props.targetView !== view.value) {
      if (view.value === "months") {
        month.value = day.value;
        view.value = "days";
      } else if (view.value === "years") {
        year.value = day.value;
        view.value = "months";
      } else if (view.value === "decades") {
        decade.value = day.value;
        view.value = "years";
      }

      return;
    }

    if (props.multiple) {
      if (model.value[0] != undefined && model.value[1] == undefined) {
        if (isGreatestDate(day.date, model.value[0])) {
          model.value = [model.value[0], day.date];
        } else {
          model.value = [day.date, model.value[0]];
        }
      } else if (model.value[0] != undefined && model.value[1] != undefined) {
        model.value = [day.date, null];
      } else {
        model.value = [day.date, model.value[1]];
      }
    } else {
      model.value = [day.date, model.value[1]];
    }
  }

  function getCellClasses(day: DatePickerCell) {
    const isFirstSelectedDate = firstDateId.value === day.id;
    const isSecondSelectedDate = range.value
      ? secondDateId.value === day.id ||
        (firstDateId.value && !secondDateId.value && hoveredDateId.value === day.id)
      : false;

    const selected = isFirstSelectedDate || isSecondSelectedDate;
    const between = range.value
      ? !selected
        ? (firstDateId.value &&
            secondDateId.value &&
            firstDateId.value < day.id &&
            day.id < secondDateId.value) ||
          (firstDateId.value &&
            !secondDateId.value &&
            hoveredDateId.value &&
            ((firstDateId.value > hoveredDateId.value &&
              hoveredDateId.value < day.id &&
              day.id < firstDateId.value) ||
              (firstDateId.value < hoveredDateId.value &&
                firstDateId.value < day.id &&
                day.id < hoveredDateId.value)))
        : false
      : false;
    const rangeSecondDateId = secondDateId.value ?? hoveredDateId.value;
    const hasRange = range.value && rangeSecondDateId && rangeSecondDateId !== firstDateId.value;
    const selectedInRangeStart = hasRange
      ? (isFirstSelectedDate && firstDateId.value < rangeSecondDateId) ||
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        (isSecondSelectedDate && rangeSecondDateId < firstDateId.value!)
      : false;
    const selectedInRangeEnd = hasRange
      ? (isFirstSelectedDate && firstDateId.value > rangeSecondDateId) ||
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        (isSecondSelectedDate && rangeSecondDateId > firstDateId.value!)
      : false;

    return {
      weekend: day.weekend,
      today: day.today,
      noTarget: day.noTarget,
      hover: hoveredDateId.value === day.id,
      selectedInRangeStart,
      selectedInRangeEnd,
      selected,
      between,
    };
  }
</script>

<template>
  <div v-for="(week, index) in daysMatrix" :key="index" class="ksd-date-picker__week">
    <div
      v-for="day in week"
      :key="day.id"
      class="ksd-date-picker__day-container"
      @click="(event) => onClickDay(event, day)"
      @mouseenter="
        () => {
          hoveredDateId = day.id;
        }
      "
      @mouseleave="
        () => {
          hoveredDateId = null;
        }
      "
    >
      <div
        class="ksd-date-picker__day ksd-date-picker__cell"
        :class="[getCellClasses(day), classes]"
      >
        {{ day?.label }}
      </div>
    </div>
  </div>
</template>

<style lang="scss">
  .ksd-date-picker {
    &__week {
      display: flex;
      align-items: center;
    }

    &__cell {
      width: calc(
        (var(--ksd-date-picker-cells-width) - var(--ksd-date-picker-cell-padding-inline) * 6) / 3
      );
      height: calc(
        (var(--ksd-date-picker-cells-height) - var(--ksd-date-picker-cell-padding-block) * 8) / 4
      );

      &.size-large {
        width: calc(
          (
              var(--ksd-date-picker-cells-width-lg) - var(
                  --ksd-date-picker-cell-padding-inline-lg
                ) *
                6
            ) /
            3
        );
        height: calc(
          (
              var(--ksd-date-picker-cells-height-lg) - var(
                  --ksd-date-picker-cell-padding-block-lg
                ) *
                8
            ) /
            4
        );
      }

      &.view-days {
        width: var(--ksd-date-picker-cell-width);
        height: var(--ksd-date-picker-cell-height);

        &.size-large {
          width: var(--ksd-date-picker-cell-width-lg);
          height: var(--ksd-date-picker-cell-height-lg);
        }
      }
    }

    &__day-container {
      padding-block: var(--ksd-padding-xxs);
      cursor: pointer;
      padding-inline: var(--ksd-padding-xxs);
      position: relative;
      z-index: 2;

      &::before {
        position: absolute;
        top: 50%;
        inset-inline-start: 0;
        inset-inline-end: 0;
        z-index: 1;
        height: calc(
          (var(--ksd-date-picker-cells-height) - var(--ksd-date-picker-cell-padding-block) * 8) / 4
        );
        transform: translateY(-50%);
        content: "";
        pointer-events: none;
      }
      &:has(.size-large) {
        &::before {
          height: calc(
            (
                var(--ksd-date-picker-cells-height-lg) - var(
                    --ksd-date-picker-cell-padding-block-lg
                  ) *
                  8
              ) /
              4
          );
        }
      }
      &:has(.view-days) {
        &::before {
          height: var(--ksd-date-picker-cell-height);
        }

        &:has(.size-large) {
          &::before {
            height: var(--ksd-date-picker-cell-height-lg);
          }
        }
      }

      &:has(.between) {
        &::before {
          background-color: var(--ksd-accent-bg-color);
        }
      }
      &:has(.selectedInRangeStart) {
        &::before {
          background-color: var(--ksd-accent-bg-color);
          inset-inline-start: 50%;
        }
      }
      &:has(.selectedInRangeEnd) {
        &::before {
          background-color: var(--ksd-accent-bg-color);
          inset-inline-end: 50%;
        }
      }
    }

    &__day {
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: var(--ksd-border-radius);
      color: var(--ksd-text-main-color);
      position: relative;
      z-index: 2;

      &.hover {
        background-color: var(--ksd-bg-hover-color);
      }

      &.today {
        color: var(--ksd-success-color);
        border: 1px solid var(--ksd-success-border-color);
        &.hover {
          background-color: var(--ksd-success-bg-hover-color);
        }
      }

      &.weekend {
        color: var(--ksd-error-color);
        &.hover {
          background-color: var(--ksd-error-bg-hover-color);
        }
      }

      &.noTarget {
        color: var(--ksd-text-secondary-color);

        &.hover {
          background-color: var(--ksd-bg-hover-color);
        }
      }

      &.selected {
        color: var(--ksd-text-reverse-color);
        background-color: var(--ksd-accent-color);

        &.hover {
          background-color: var(--ksd-accent-active-color);
        }
      }

      &.between {
        color: var(--ksd-text-main-color);
        background-color: var(--ksd-accent-bg-color);

        &:not(:has(.selected)) {
          border-radius: 0px;
        }

        &.hover {
          background-color: var(--ksd-accent-bg-hover-color);
        }
      }

      &.selectedInRangeStart {
        border-top-right-radius: 0px;
        border-bottom-right-radius: 0px;
      }
      &.selectedInRangeEnd {
        border-top-left-radius: 0px;
        border-bottom-left-radius: 0px;
      }
    }
  }
</style>
