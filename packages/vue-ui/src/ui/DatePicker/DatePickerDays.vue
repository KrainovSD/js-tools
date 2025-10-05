<script setup lang="ts">
  import { isId } from "@krainovsd/js-helpers";
  import { computed, ref } from "vue";
  import type { DatePickerCell, DatePickerSize } from "./date-picker.types";
  import { generateDateMatrix, getDayId } from "./lib";
  import { isGreatestDate } from "./lib/is-greatest-date";

  type Props = {
    year: number;
    month: number;
    startWeek: number;
    locale: string;
    size: DatePickerSize;
    multiple: boolean;
    targetView: boolean;
  };

  const props = defineProps<Props>();
  const model = defineModel<(Date | string | number | null)[]>({ default: [] });

  const startWeek = computed(() => (props.startWeek > 6 ? 0 : props.startWeek));
  const daysMatrix = computed(() => generateDateMatrix(props.year, props.month, startWeek.value));

  const classes = computed(() => ({ [`size-${props.size}`]: true }));
  const hoveredDateId = ref<number | null>(null);

  const firstDate = computed(() => (isId(model.value[0]) ? new Date(model.value[0]) : undefined));
  const secondDate = computed(() => (isId(model.value[1]) ? new Date(model.value[1]) : undefined));
  const firstDateId = computed(() =>
    firstDate.value != undefined
      ? getDayId(
          firstDate.value.getFullYear(),
          firstDate.value.getMonth(),
          firstDate.value.getDate(),
        )
      : undefined,
  );
  const secondDateId = computed(() =>
    secondDate.value != undefined
      ? getDayId(
          secondDate.value.getFullYear(),
          secondDate.value.getMonth(),
          secondDate.value.getDate(),
        )
      : undefined,
  );

  function onClickDay(day: DatePickerCell) {
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

  function getDayClasses(day: DatePickerCell) {
    const isFirstSelectedDate = firstDateId.value === day.id;
    const isSecondSelectedDate = props.multiple
      ? secondDateId.value === day.id ||
        (firstDateId.value && !secondDateId.value && hoveredDateId.value === day.id)
      : false;

    const selected = isFirstSelectedDate || isSecondSelectedDate;
    const between = props.multiple
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
    const hasRange = props.multiple && rangeSecondDateId && rangeSecondDateId !== firstDateId.value;
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
      @click="() => onClickDay(day)"
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
        :class="[getDayClasses(day), classes]"
      >
        {{ day?.value }}
      </div>
    </div>
  </div>
</template>

<style lang="scss">
  .ksd-date-picker {
    &__cell {
      width: var(--ksd-control-height);
      height: var(--ksd-control-height);

      &.size-small {
        width: var(--ksd-control-height-sm);
        height: var(--ksd-control-height-sm);
      }
      &.size-large {
        width: var(--ksd-control-height-lg);
        height: var(--ksd-control-height-lg);
      }
    }

    &__week {
      display: flex;
      align-items: center;
    }

    &__day-container {
      padding-top: var(--ksd-padding-xxs);
      cursor: pointer;
    }

    &__day {
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: var(--ksd-border-radius);
      color: var(--ksd-text-main-color);

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
