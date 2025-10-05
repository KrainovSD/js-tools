<script setup lang="ts">
  import { computed, ref, watch } from "vue";
  import DatePickerHeader from "./DatePickerHeader.vue";
  import DatePickerMatrix from "./DatePickerMatrix.vue";
  import DatePickerWeekDays from "./DatePickerWeekDays.vue";
  import type { DatePickerLocalView, DatePickerSize, DatePickerView } from "./date-picker.types";

  type Props = {
    startWeek: number;
    locale: string;
    size: DatePickerSize;
    multiple: boolean;
    view: DatePickerView;
    targetDate: Date | null;
  };

  const props = defineProps<Props>();

  const model = defineModel<(Date | string | number | null)[]>({ default: [] });

  const localView = ref<DatePickerLocalView>(props.view);
  const now = new Date();
  const year = ref(props.targetDate ? props.targetDate.getFullYear() : now.getFullYear());
  const month = ref(props.targetDate ? props.targetDate.getMonth() : now.getMonth());
  const decade = ref(Math.floor(year.value / 10));
  const century = computed(() => Math.floor(decade.value / 10));

  watch(
    () => props.targetDate,
    (targetDate) => {
      if (!targetDate) return;

      year.value = targetDate.getFullYear();
      month.value = targetDate.getMonth();
      decade.value = Math.floor(targetDate.getFullYear() / 10);
    },
    { immediate: true },
  );
</script>

<template>
  <div class="ksd-date-picker__calendar" @mousedown.prevent="">
    <DatePickerHeader
      v-model:month="month"
      v-model:year="year"
      v-model:decade="decade"
      v-model:view="localView"
      :locale="$props.locale"
      :size="$props.size"
      :century="century"
    />
    <div class="ksd-date-picker__matrix-container">
      <DatePickerWeekDays
        v-if="localView === 'days'"
        :locale="$props.locale"
        :size="$props.size"
        :start-week="$props.startWeek"
      />
      <DatePickerMatrix
        v-model="model"
        v-model:decade="decade"
        v-model:year="year"
        v-model:month="month"
        v-model:view="localView"
        :locale="$props.locale"
        :size="$props.size"
        :start-week="$props.startWeek"
        :multiple="$props.multiple"
        :target-view="$props.view"
        :century="century"
      />
    </div>
  </div>
</template>

<style lang="scss">
  .ksd-date-picker {
    &__calendar {
      display: flex;
      flex-direction: column;
    }

    &__matrix-container {
      display: flex;
      flex-direction: column;
      padding: var(--ksd-padding-xxs) var(--ksd-padding-xs);

      --ksd-date-picker-cell-width: var(--ksd-control-height);
      --ksd-date-picker-cell-width-lg: var(--ksd-control-height-lg);
      --ksd-date-picker-cell-height: var(--ksd-control-height);
      --ksd-date-picker-cell-height-lg: var(--ksd-control-height-lg);
      --ksd-date-picker-cell-padding-inline: var(--ksd-padding-xxs);
      --ksd-date-picker-cell-padding-block: var(--ksd-padding-xxs);
      --ksd-date-picker-cell-padding-inline-lg: var(--ksd-padding-xxs);
      --ksd-date-picker-cell-padding-block-lg: var(--ksd-padding-xxs);

      --ksd-date-picker-cells-width: calc(
        var(--ksd-date-picker-cell-width) * 7 + var(--ksd-date-picker-cell-padding-inline) * 14
      );
      --ksd-date-picker-cells-height: calc(
        var(--ksd-date-picker-cell-height) * 5 + var(--ksd-date-picker-cell-height) +
          var(--ksd-date-picker-cell-padding-block) * 10
      );

      --ksd-date-picker-cells-width-lg: calc(
        var(--ksd-date-picker-cell-width-lg) * 7 + var(--ksd-date-picker-cell-padding-inline-lg) *
          14
      );
      --ksd-date-picker-cells-height-lg: calc(
        var(--ksd-date-picker-cell-height-lg) * 5 + var(--ksd-date-picker-cell-height-lg) +
          var(--ksd-date-picker-cell-padding-block-lg) * 10
      );
    }
  }
</style>
