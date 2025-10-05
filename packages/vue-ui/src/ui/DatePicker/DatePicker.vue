<script setup lang="ts" generic="Multiple extends true | false = false">
  import { dateFormat, isArray, isNumber, isString } from "@krainovsd/js-helpers";
  import { VCalendarOutlined, VCloseCircleFilled } from "@krainovsd/vue-icons";
  import { computed, ref, watch } from "vue";
  import {
    DATE_PICKER_DISPLAY_FORMAT,
    DATE_PICKER_OUTPUT_FORMAT,
    INPUT_POPPER_TRIGGERS,
  } from "../../constants/tech";
  import IconWrapper from "../IconWrapper.vue";
  import type { InputSize, InputVariant } from "../Input.vue";
  import Input from "../Input.vue";
  import type { PopperProps } from "../Popper.vue";
  import Popper from "../Popper.vue";
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
    displayFormat: DATE_PICKER_DISPLAY_FORMAT,
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
      ? dateFormat(firstDate.value, props.displayFormat ?? DATE_PICKER_DISPLAY_FORMAT)
      : undefined,
  );
  const displayedSecondDate = computed(() =>
    secondDate.value != undefined
      ? dateFormat(secondDate.value, props.displayFormat ?? DATE_PICKER_DISPLAY_FORMAT)
      : undefined,
  );

  function onClose() {
    open.value = false;
  }
  function onOpen() {
    open.value = true;
  }

  function actionInputKeyboard() {
    if (!open.value) {
      onOpen();
    }
  }

  watch(
    model,
    (model) => {
      if (props.multiple) {
        if (isArray(model) && model[0] != undefined && model[1] != undefined) {
          open.value = false;
        }
      } else if (model != undefined) {
        open.value = false;
      }
    },
    { immediate: true },
  );
</script>

<template>
  <Popper
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
    <div class="ksd-date-picker">
      <div class="ksd-date-picker__container">
        <Input
          :class-name-root="'ksd-date-picker__input'"
          :size="$props.inputSize"
          :variant="$props.inputVariant"
          :model-value="displayedFirstDate"
          placeholder="Выберите дату"
          @keydown="actionInputKeyboard"
          @blur="onClose"
          @focus="onOpen"
          @click="onOpen"
        >
          <template #suffix>
            <IconWrapper
              class="ksd-date-picker__input-icon calendar"
              @click.prevent.stop="open = !open"
              @mousedown.prevent=""
            >
              <VCalendarOutlined />
            </IconWrapper>
            <IconWrapper
              class="ksd-date-picker__input-icon cancel"
              @click.prevent.stop="model = undefined"
              @mousedown.prevent=""
            >
              <VCloseCircleFilled />
            </IconWrapper>
          </template>
        </Input>
      </div>

      <Text v-if="$props.multiple"> - </Text>
      <div v-if="$props.multiple" class="ksd-date-picker__container">
        <Input
          :size="$props.inputSize"
          :variant="$props.inputVariant"
          placeholder="Выберите дату"
          :model-value="displayedSecondDate"
        />
      </div>
    </div>
    <template #content>
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
    </template>
  </Popper>
</template>

<style lang="scss">
  div.ksd-date-picker__positioner {
    z-index: var(--ksd-select-z-index);
    max-width: none;
    max-height: none;
  }

  .ksd-date-picker {
    display: inline-flex;
    align-items: center;
    gap: var(--ksd-padding-xs);

    &__positioner-content {
      padding: 0px;
      max-width: none;
      max-height: none;
    }

    &__container {
      display: inline-flex;
      position: relative;
    }

    &__input {
      &:hover {
        & .calendar {
          display: none;
        }
        & .cancel {
          display: flex;
        }
      }
    }

    &__input-icon {
      color: currentColor;
      &.calendar {
        display: flex;
      }
      &.cancel {
        display: none;
      }
    }
  }
</style>
