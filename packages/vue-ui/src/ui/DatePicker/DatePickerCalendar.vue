<script setup lang="ts">
  import { ref } from "vue";
  import DatePickerDays from "./DatePickerDays.vue";
  import DatePickerHeader from "./DatePickerHeader.vue";
  import DatePickerMonths from "./DatePickerMonths.vue";
  import type { DatePickerSize, DatePickerView } from "./date-picker.types";

  type Props = {
    startWeek: number;
    locale: string;
    size: DatePickerSize;
    multiple: boolean;
    view: DatePickerView;
  };

  const props = defineProps<Props>();
  const model = defineModel<(Date | string | number | null)[]>({ default: [] });

  const localView = ref(props.view);
  const now = new Date();
  const year = ref(now.getFullYear());
  const month = ref(now.getMonth());
  const decade = ref(Math.floor(year.value / 10));
</script>

<template>
  <div class="ksd-date-picker__calendar">
    <DatePickerHeader
      v-model:month="month"
      v-model:year="year"
      v-model:decade="decade"
      v-model:view="localView"
      :locale="$props.locale"
      :size="$props.size"
    />
    <div class="ksd-date-picker__matrix-container">
      <DatePickerDays
        v-if="localView === 'days'"
        v-model="model"
        :month="month"
        :year="year"
        :locale="$props.locale"
        :size="$props.size"
        :start-week="$props.startWeek"
        :multiple="$props.multiple"
      />
      <DatePickerMonths
        v-if="localView === 'months'"
        v-model="model"
        v-model:month="month"
        :final-view="$props.view === 'months'"
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
      /* gap: var(--ksd-padding-xxs); */
    }
  }
</style>
