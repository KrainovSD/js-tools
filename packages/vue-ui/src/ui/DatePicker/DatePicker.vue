<script setup lang="ts" generic="Multiple extends true | false = false">
  import { dateFormat, isArray, isNumber, isString } from "@krainovsd/js-helpers";
  import { computed, useTemplateRef } from "vue";
  import { DATE_PICKER_DISPLAY_FORMAT, DATE_PICKER_OUTPUT_FORMAT } from "../../constants/tech";
  import type { InputSize, InputVariant } from "../Input.vue";
  import Input from "../Input.vue";
  import Text from "../Text.vue";
  import DatePickerCalendar from "./DatePickerCalendar.vue";
  import type { DatePickerSize, DatePickerView } from "./date-picker.types";

  export type DatePickerProps<Multiple extends true | false> = {
    multiple?: Multiple;
    outputFormat?: string;
    displayFormat?: string;
    inputSize?: InputSize;
    inputVariant?: InputVariant;
    startWeek?: number;
    locale?: string;
    size?: DatePickerSize;
    view?: DatePickerView;
  };

  type Value = Multiple extends false
    ? string | number | undefined | null
    : (string | number | null)[] | undefined | null;

  const props = withDefaults(defineProps<DatePickerProps<Multiple>>(), {
    displayFormat: DATE_PICKER_DISPLAY_FORMAT,
    outputFormat: DATE_PICKER_OUTPUT_FORMAT,
    inputSize: "default",
    inputVariant: "outlined",
    locale: "ru-RU",
    size: "default",
    view: "days",
    startWeek: 1,
  });
  const model = defineModel<Value>();
  const firstDate = computed(() =>
    !props.multiple
      ? isString(model.value)
        ? model.value
        : isNumber(model.value)
          ? new Date(model.value).toISOString()
          : undefined
      : props.multiple
        ? isArray(model.value)
          ? isString(model.value[0])
            ? model.value[0]
            : isNumber(model.value[0])
              ? new Date(model.value[0]).toISOString()
              : undefined
          : undefined
        : undefined,
  );
  const secondDate = computed(() =>
    props.multiple
      ? isArray(model.value)
        ? isString(model.value[1])
          ? model.value[1]
          : isNumber(model.value[1])
            ? new Date(model.value[1]).toISOString()
            : undefined
        : undefined
      : undefined,
  );

  const displayedFirstDate = computed(() =>
    firstDate.value != undefined
      ? dateFormat(firstDate.value, props.displayFormat ?? DATE_PICKER_DISPLAY_FORMAT)
      : undefined,
  );
  const displayedSecondDate = computed(() =>
    secondDate.value != undefined
      ? dateFormat(secondDate.value, props.displayFormat ?? DATE_PICKER_DISPLAY_FORMAT)
      : undefined,
  );

  const firstDateRef = useTemplateRef("date-first");
  const secondDatedRef = useTemplateRef("date-second");
</script>

<template>
  <div class="ksd-date-picker">
    <div class="ksd-date-picker__container">
      <Input
        :size="$props.inputSize"
        :variant="$props.inputVariant"
        :model-value="displayedFirstDate"
        placeholder="Выберите дату"
        @click="firstDateRef?.showPicker?.()"
      />
      <input
        ref="date-first"
        type="date"
        class="ksd-date-picker__date"
        aria-hidden="true"
        tabindex="-1"
        :value="firstDate"
        @input="
          (event) => {
            const value = (event.target as HTMLInputElement).value;
            const transformedValue =
              value != undefined
                ? dateFormat(value, $props.outputFormat ?? DATE_PICKER_OUTPUT_FORMAT)
                : undefined;
            if ($props.multiple) {
              if (!isArray(model)) {
                model = [transformedValue, undefined] as unknown as Value;
              } else {
                model = [transformedValue, model[1]] as Value;
              }
            } else {
              model = transformedValue as Value;
            }
          }
        "
      />
    </div>

    <Text v-if="$props.multiple"> - </Text>
    <div v-if="$props.multiple" class="ksd-date-picker__container">
      <Input
        :size="$props.inputSize"
        :variant="$props.inputVariant"
        placeholder="Выберите дату"
        :model-value="displayedSecondDate"
        @click="secondDatedRef?.showPicker?.()"
      />
      <input
        ref="date-second"
        type="date"
        class="ksd-date-picker__date"
        aria-hidden="true"
        tabindex="-1"
        :value="secondDate"
        @input="
          (event) => {
            const value = (event.target as HTMLInputElement).value;
            const transformedValue =
              value != undefined
                ? dateFormat(value, $props.outputFormat ?? DATE_PICKER_OUTPUT_FORMAT)
                : undefined;
            if ($props.multiple) {
              if (!isArray(model)) {
                model = [undefined, transformedValue] as unknown as Value;
              } else {
                model = [model[0], transformedValue] as Value;
              }
            }
          }
        "
      />
    </div>

    <DatePickerCalendar
      :locale="$props.locale"
      :size="$props.size"
      :start-week="$props.startWeek"
      :multiple="$props.multiple ?? false"
      :view="$props.view"
      :model-value="isArray(model) ? model : model != undefined ? [model] : []"
      @update:model-value="
        (value) => {
          if ($props.multiple) {
            model = value.map((v) =>
              v ? dateFormat(v, $props.outputFormat ?? DATE_PICKER_OUTPUT_FORMAT) : null,
            ) as Value;
          } else {
            model = (
              value[0]
                ? dateFormat(value[0], $props.outputFormat ?? DATE_PICKER_OUTPUT_FORMAT)
                : null
            ) as Value;
          }
        }
      "
    />
  </div>
</template>

<style lang="scss">
  .ksd-date-picker {
    display: inline-flex;
    align-items: center;
    gap: var(--ksd-padding-xs);

    &__container {
      display: inline-flex;
      position: relative;
    }

    &__date {
      position: absolute;
      visibility: hidden;
      bottom: -5px;
    }
  }
</style>
