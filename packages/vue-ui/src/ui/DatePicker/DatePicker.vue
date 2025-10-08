<script setup lang="ts" generic="Multiple extends true | false = false">
  import { dateFormat, isArray, isNumber, isString } from "@krainovsd/js-helpers";
  import { computed, ref, watch } from "vue";
  import { INPUT_POPPER_TRIGGERS, NUMBER_KEYS } from "../../constants/tech";
  import type { InputSize, InputVariant } from "../Input.vue";
  import type { PopperProps } from "../Popper.vue";
  import Popper from "../Popper.vue";
  import DatePickerCalendar from "./DatePickerCalendar.vue";
  import DatePickerInput from "./DatePickerInput.vue";
  import { DATE_PICKER_OUTPUT_FORMAT, DISPLAY_FORMATS } from "./date-picker.constants";
  import type {
    DatePickerDisplayFormat,
    DatePickerSize,
    DatePickerView,
  } from "./date-picker.types";
  import { mutateDateByFormatMask, parseDateFromInput } from "./lib";

  export type DatePickerProps<Multiple extends true | false> = {
    multiple?: Multiple;
    outputFormat?: string;
    displayFormat?: DatePickerDisplayFormat;
    inputSize?: InputSize;
    inputVariant?: InputVariant;
    startWeek?: number;
    disabled?: boolean;
    locale?: string;
    size?: DatePickerSize;
    view?: DatePickerView;
  } & Pick<
    PopperProps,
    | "animationAppear"
    | "animationDisappear"
    | "arrow"
    | "classNamePositionerContent"
    | "closeByScroll"
    | "closeDelay"
    | "ignoreElements"
    | "modalRoot"
    | "observe"
    | "openDelay"
    | "shiftX"
    | "shiftY"
    | "placement"
    | "zIndex"
    | "nested"
    | "closeByClickOutsideEvent"
  >;
  type Value = Multiple extends false
    ? string | number | undefined | null
    : (string | number | null)[] | undefined | null;

  const props = withDefaults(defineProps<DatePickerProps<Multiple>>(), {
    displayFormat: "ru-dot",
    outputFormat: DATE_PICKER_OUTPUT_FORMAT,
    inputSize: "default",
    inputVariant: "outlined",
    locale: "ru-RU",
    size: "default",
    view: "days",
    startWeek: 1,
    animationAppear: "scaleY",
    animationDisappear: "scaleY",
    placement: "bottom-left",
    openDelay: 0,
    disabled: false,
  });
  const model = defineModel<Value>();
  const open = ref(false);

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
      ? dateFormat(firstDate.value, DISPLAY_FORMATS[props.view]?.[props.displayFormat])
      : undefined,
  );
  const displayedSecondDate = computed(() =>
    secondDate.value != undefined
      ? dateFormat(secondDate.value, DISPLAY_FORMATS[props.view]?.[props.displayFormat])
      : undefined,
  );
  const firstInputValue = ref(displayedFirstDate.value);
  const secondInputValue = ref(displayedSecondDate.value);
  const targetDate = ref<Date | null>(null);

  function onClose() {
    open.value = false;
  }

  function setTargetDate(input: number) {
    if (input === 0 && firstDate.value != undefined) {
      targetDate.value = new Date(firstDate.value);
    } else if (input === 0 && firstDate.value == undefined && secondDate.value != undefined) {
      targetDate.value = new Date(secondDate.value);
    } else if (input === 1 && secondDate.value != undefined) {
      targetDate.value = new Date(secondDate.value);
    } else if (input === 1 && secondDate.value == undefined && firstDate.value != undefined) {
      targetDate.value = new Date(firstDate.value);
    } else {
      targetDate.value = new Date();
    }
  }
  function onOpen(input: number) {
    setTargetDate(input);
    open.value = true;
  }

  function actionInputKeyboard(event: KeyboardEvent, input: number) {
    if (event.key === "Tab") {
      return;
    }
    if (!open.value) {
      onOpen(input);
    }
    event.preventDefault();
    if (!NUMBER_KEYS.has(event.key) && event.key !== "Backspace" && event.key !== "Delete") {
      return;
    }

    mutateDateByFormatMask({
      displayFormat: props.displayFormat,
      target: event.target as HTMLInputElement,
      updateValue: input === 0 ? updateFirstInputValue : updateSecondInputValue,
      view: props.view,
      delete: event.key === "Backspace" || event.key === "Delete",
      key: event.key,
    });
  }

  /** process custom input  */
  function updateFirstInputValue(value: string | undefined) {
    const formattedDate = parseDateFromInput(
      value,
      props.outputFormat,
      props.view,
      props.displayFormat,
    );

    if (formattedDate != undefined || value == undefined) {
      if (props.multiple) {
        model.value = [formattedDate, isArray(model.value) ? model.value?.[1] : null] as Value;
      } else {
        model.value = formattedDate as Value;
      }
    }
    if (formattedDate != undefined) {
      setTargetDate(0);
    }

    firstInputValue.value = value;
  }
  function updateSecondInputValue(value: string | undefined) {
    const formattedDate = parseDateFromInput(
      value,
      props.outputFormat,
      props.view,
      props.displayFormat,
    );

    if (formattedDate != undefined || value == undefined) {
      if (props.multiple) {
        model.value = [isArray(model.value) ? model.value?.[0] : null, formattedDate] as Value;
      }
    }
    if (formattedDate != undefined) {
      setTargetDate(1);
    }

    secondInputValue.value = value;
  }

  /** update input value after model change */
  watch(
    displayedFirstDate,
    (date) => {
      firstInputValue.value = date;
    },
    { immediate: true },
  );
  watch(
    displayedSecondDate,
    (date) => {
      secondInputValue.value = date;
    },
    { immediate: true },
  );
</script>

<template>
  <Popper
    v-if="!props.disabled"
    ref="popper"
    v-model="open"
    role="listbox"
    :animation-appear="$props.animationAppear"
    :animation-disappear="$props.animationDisappear"
    :arrow="$props.arrow"
    :close-by-scroll="$props.closeByScroll"
    :fit="true"
    :close-delay="$props.closeDelay"
    :ignore-elements="$props.ignoreElements"
    :modal-root="$props.modalRoot"
    :nested="$props.nested"
    :close-by-click-outside-event="$props.closeByClickOutsideEvent"
    :observe="$props.observe"
    :open-delay="$props.openDelay"
    :shift-x="$props.shiftX"
    :shift-y="$props.shiftY"
    :placement="$props.placement"
    :z-index="$props.zIndex"
    :triggers="INPUT_POPPER_TRIGGERS"
    :class-name-positioner-content="`ksd-date-picker__positioner-content ${$props.classNamePositionerContent ?? ''}`"
    :class="`ksd-date-picker__positioner`"
  >
    <DatePickerInput
      v-model:first-value="firstInputValue"
      v-model:second-value="secondInputValue"
      :input-size="$props.inputSize"
      :input-variant="$props.inputVariant"
      :multiple="$props.multiple ?? false"
      :disabled="$props.disabled"
      :displayed-first-date="displayedFirstDate"
      :displayed-second-date="displayedSecondDate"
      @update-first-input-value="updateFirstInputValue"
      @update-second-input-value="updateSecondInputValue"
      @action-input-keyboard="actionInputKeyboard"
      @open="onOpen"
      @close="onClose"
      @toggle="open = !open"
      @clear="model = undefined"
    />
    <template #content>
      <DatePickerCalendar
        :locale="$props.locale"
        :target-date="targetDate"
        :size="$props.size"
        :start-week="$props.startWeek"
        :multiple="$props.multiple ?? false"
        :view="$props.view"
        :model-value="isArray(model) ? model : model != undefined ? [model] : []"
        @update:model-value="
          (value) => {
            let newModel: Value;

            if ($props.multiple) {
              newModel = value.map((v) =>
                v ? dateFormat(v, $props.outputFormat ?? DATE_PICKER_OUTPUT_FORMAT) : null,
              ) as Value;
            } else {
              newModel = (
                value[0]
                  ? dateFormat(value[0], $props.outputFormat ?? DATE_PICKER_OUTPUT_FORMAT)
                  : null
              ) as Value;
            }

            if (props.multiple) {
              if (isArray(newModel) && newModel[0] != undefined && newModel[1] != undefined) {
                open = false;
              }
            } else if (newModel != undefined) {
              open = false;
            }

            model = newModel;
          }
        "
      />
    </template>
  </Popper>
  <DatePickerInput
    v-else
    v-model:first-value="firstInputValue"
    v-model:second-value="secondInputValue"
    :input-size="$props.inputSize"
    :input-variant="$props.inputVariant"
    :multiple="$props.multiple ?? false"
    :disabled="$props.disabled"
    :displayed-first-date="displayedFirstDate"
    :displayed-second-date="displayedSecondDate"
    @update-first-input-value="updateFirstInputValue"
    @update-second-input-value="updateSecondInputValue"
    @action-input-keyboard="actionInputKeyboard"
    @open="onOpen"
    @close="onClose"
    @toggle="open = !open"
    @clear="model = undefined"
  />
</template>

<style lang="scss">
  div.ksd-date-picker__positioner {
    z-index: var(--ksd-select-z-index);
    max-width: none;
    max-height: none;
  }

  .ksd-date-picker {
    &__positioner-content {
      padding: 0px;
      max-width: none;
      max-height: none;
    }
  }
</style>
