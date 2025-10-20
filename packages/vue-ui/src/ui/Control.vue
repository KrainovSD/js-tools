<script setup lang="ts">
  import { isArray, isId, isNumber, isString } from "@krainovsd/js-helpers";
  import DatePicker from "./DatePicker/DatePicker.vue";
  import type { InputSize, InputVariant } from "./Input.vue";
  import Input from "./Input.vue";
  import InputNumber from "./InputNumber.vue";
  import type { SelectItem } from "./Select.vue";
  import Select from "./Select.vue";
  import type { UserPickerPosition, UserPickerUser } from "./UserPicker.vue";
  import UserPicker from "./UserPicker.vue";

  export type ControlComponents = {
    select: ControlSelectComponentProps;
    user: ControlUserComponentProps;
    text: ControlTextComponentProps;
    number: ControlNumberComponentProps;
    "number-range": ControlNumberComponentProps;
    date: ControlDateComponentProps;
  };

  export type ControlUserComponentProps = {
    multiple?: boolean;
    header?: string;
    count?: number;
    shift?: number;
    position?: UserPickerPosition;
    users: UserPickerUser<string | number>[];
  };
  export type ControlSelectComponentProps = {
    options: SelectItem<string | number>[];
    multiple?: boolean;
    placeholder?: string;
    search?: boolean;
    clear?: boolean;
  };
  export type ControlTextComponentProps = {
    allowClear?: boolean;
    placeholder?: string;
  };
  export type ControlNumberComponentProps = {
    min?: number;
    max?: number;
    step?: number;
    placeholder?: string;
  };
  export type ControlDateComponentProps = {
    format?: string;
    multiple?: boolean;
  };

  export type ControlProps = {
    autofocus?: boolean;
    component: keyof ControlComponents;
    props?: Record<string, unknown>;
    controlSize?: InputSize;
    controlVariant?: InputVariant;
  };

  defineProps<ControlProps>();
  const model = defineModel<unknown>();
</script>

<template>
  <Input
    v-if="$props.component === 'text'"
    v-bind="$attrs"
    :model-value="isString(model) ? model : ''"
    :size="$props.controlSize"
    :variant="$props.controlVariant"
    :autofocus="$props.autofocus"
    :allow-clear="($props.props as ControlTextComponentProps)?.allowClear"
    :placeholder="($props.props as ControlTextComponentProps)?.placeholder"
    @update:model-value="
      (value) => {
        model = value;
      }
    "
  />
  <InputNumber
    v-if="$props.component === 'number'"
    v-bind="$attrs"
    :model-value="isNumber(model) ? model : undefined"
    :size="$props.controlSize"
    :variant="$props.controlVariant"
    :autofocus="$props.autofocus"
    :placeholder="($props.props as ControlNumberComponentProps)?.placeholder"
    :min="($props.props as ControlNumberComponentProps)?.min"
    :max="($props.props as ControlNumberComponentProps)?.max"
    :step="($props.props as ControlNumberComponentProps)?.step"
    @update:model-value="
      (value) => {
        model = value;
      }
    "
  />
  <template v-if="$props.component === 'number-range'">
    <div v-bind="$attrs" class="ksd-control__number-container">
      <InputNumber
        :model-value="isArray(model) && isNumber(model[0]) ? model[0] : undefined"
        :size="$props.controlSize"
        :variant="$props.controlVariant"
        :autofocus="$props.autofocus"
        :placeholder="($props.props as ControlNumberComponentProps)?.placeholder"
        :min="($props.props as ControlNumberComponentProps)?.min"
        :max="($props.props as ControlNumberComponentProps)?.max"
        :step="($props.props as ControlNumberComponentProps)?.step"
        @update:model-value="
          (value) => {
            if (!isArray(model)) {
              model = [];
            }

            model = [value, (model as unknown[])?.[1]];
          }
        "
      />
      <span> - </span>
      <InputNumber
        :model-value="isArray(model) && isNumber(model[1]) ? model[1] : undefined"
        :size="$props.controlSize"
        :variant="$props.controlVariant"
        :placeholder="($props.props as ControlNumberComponentProps)?.placeholder"
        :min="($props.props as ControlNumberComponentProps)?.min"
        :max="($props.props as ControlNumberComponentProps)?.max"
        :step="($props.props as ControlNumberComponentProps)?.step"
        @update:model-value="
          (value) => {
            if (!isArray(model)) {
              model = [];
            }

            model = [(model as unknown[])?.[0], value];
          }
        "
      />
    </div>
  </template>
  <Select
    v-if="$props.component === 'select'"
    v-bind="$attrs"
    :options="($props.props as ControlSelectComponentProps)?.options ?? []"
    :size="$props.controlSize"
    :variant="$props.controlVariant"
    :autofocus="$props.autofocus"
    :multiple="($props.props as ControlSelectComponentProps)?.multiple"
    :search="($props.props as ControlSelectComponentProps)?.search"
    :clear="($props.props as ControlSelectComponentProps)?.clear"
    :placeholder="($props.props as ControlSelectComponentProps)?.placeholder"
    :nested="true"
    :model-value="
      $props.props?.multiple
        ? isArray(model)
          ? (model as string[] | number[])
          : undefined
        : (model as string | number)
    "
    @update:model-value="
      (value) => {
        model = value;
      }
    "
  />
  <DatePicker
    v-if="$props.component === 'date'"
    v-bind="$attrs"
    :input-size="$props.controlSize"
    :autofocus="$props.autofocus"
    :input-variant="$props.controlVariant"
    :nested="true"
    :multiple="($props.props as ControlDateComponentProps)?.multiple"
    :model-value="
      ($props.props as ControlDateComponentProps)?.multiple
        ? isArray(model)
          ? (model as [string, string])
          : undefined
        : isString(model)
          ? model
          : ''
    "
    @update:model-value="
      (value) => {
        model = value;
      }
    "
  />
  <UserPicker
    v-if="$props.component === 'user'"
    v-bind="$attrs"
    :model-value="
      ($props.props as ControlUserComponentProps)?.multiple
        ? isArray(model)
          ? (model as string[] | number[])
          : []
        : isId(model)
          ? model
          : undefined
    "
    :users="($props.props as ControlUserComponentProps)?.users ?? []"
    :multiple="($props.props as ControlUserComponentProps)?.multiple"
    :header="($props.props as ControlUserComponentProps)?.header"
    :count="($props.props as ControlUserComponentProps)?.count"
    :shift="($props.props as ControlUserComponentProps)?.shift"
    :position="($props.props as ControlUserComponentProps)?.position"
    :size="$props.controlSize"
    :autofocus="$props.autofocus"
    :nested="true"
    @update:model-value="
      (value) => {
        model = value;
      }
    "
  />
</template>

<style lang="scss">
  .ksd-control {
    &__number-container {
      display: flex;
      gap: var(--ksd-margin-xs);
      align-items: center;
    }
  }
</style>
