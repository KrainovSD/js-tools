<script setup lang="ts">
  import { isArray, isString } from "@krainovsd/js-helpers";
  import { isNumber } from "lodash";
  import type { InputSize, InputVariant } from "./Input.vue";
  import Input from "./Input.vue";
  import InputNumber from "./InputNumber.vue";
  import type { SelectItem, SelectValue } from "./Select.vue";
  import Select from "./Select.vue";

  export type ControlComponents = {
    select: {
      props: ControlSelectComponentProps;
      value: SelectValue[] | string | number | null | undefined;
    };
    text: { props: ControlTextComponentProps; value: string };
    number: { props: ControlNumberComponentProps; value: number };
    "number-range": { props: ControlNumberComponentProps; value: [number, number] };
    date: { props: ControlDateComponentProps; value: string };
    "date-range": { props: ControlDateComponentProps; value: [string, string] };
  };
  export type ControlSelectComponentProps = {
    options: SelectItem[];
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
  };
  export type ControlInfo = {
    [K in keyof ControlComponents]: {
      component: K;
      props: ControlComponents[K]["props"];
    };
  }[keyof ControlComponents];

  export type ControlProps = {
    info: ControlInfo;
    controlSize?: InputSize;
    controlVariant?: InputVariant;
  };

  defineProps<ControlProps>();
  const model = defineModel<unknown>();
</script>

<template>
  <Control
    :info="{ component: 'select', props: { options: [] } }"
    :model-value="2"
    @update:model-value="(value) => {}"
  />
  <Input
    v-if="$props.info.component === 'text'"
    :model-value="isString(model) ? model : ''"
    :size="$props.controlSize"
    :variant="$props.controlVariant"
    :allow-clear="$props.info.props?.allowClear"
    :placeholder="$props.info.props?.placeholder"
    class="ksd-filter__field-control text"
    @update:model-value="
      (value) => {
        model = value;
      }
    "
  />
  <InputNumber
    v-if="$props.info.component === 'number'"
    :model-value="isNumber(model) ? model : undefined"
    :size="$props.controlSize"
    :variant="$props.controlVariant"
    :placeholder="$props.info.props?.placeholder"
    :min="$props.info.props?.min"
    :max="$props.info.props?.max"
    :step="$props.info.props?.step"
    class="ksd-filter__field-control number"
    @update:model-value="
      (value) => {
        model = value;
      }
    "
  />
  <template v-if="$props.info.component === 'number-range'">
    <div class="ksd-filter__field-control number-container">
      <InputNumber
        :model-value="isArray(model) && isNumber(model[0]) ? model[0] : undefined"
        :size="$props.controlSize"
        :variant="$props.controlVariant"
        :placeholder="$props.info.props?.placeholder"
        :min="$props.info.props?.min"
        :max="$props.info.props?.max"
        :step="$props.info.props?.step"
        class="ksd-filter__field-control number"
        @update:model-value="
          (value) => {
            if (!isArray(model)) {
              model = [];
            }
            (model as unknown[])[0] = value;
          }
        "
      />
      <span> - </span>
      <InputNumber
        :model-value="isArray(model) && isNumber(model[1]) ? model[1] : undefined"
        :size="$props.controlSize"
        :variant="$props.controlVariant"
        :placeholder="$props.info.props?.placeholder"
        :min="$props.info.props?.min"
        :max="$props.info.props?.max"
        :step="$props.info.props?.step"
        class="ksd-filter__field-control number"
        @update:model-value="
          (value) => {
            if (!isArray(model)) {
              model = [];
            }
            (model as unknown[])[1] = value;
          }
        "
      />
    </div>
  </template>
  <Select
    v-if="$props.info.component === 'select'"
    :options="$props.info.props?.options ?? []"
    :size="$props.controlSize"
    :variant="$props.controlVariant"
    :multiple="$props.info.props?.multiple"
    :search="$props.info.props?.search"
    :clear="$props.info.props?.clear"
    :placeholder="$props.info.props?.placeholder"
    :nested="true"
    class="ksd-filter__field-control select"
    :model-value="
      $props.info.props?.multiple
        ? isArray(model)
          ? (model as SelectValue[])
          : undefined
        : (model as SelectValue)
    "
    @update:model-value="
      (value) => {
        model = value;
      }
    "
  />
  <input
    v-if="$props.info.component === 'date'"
    type="date"
    class="ksd-filter__field-control date"
    :value="isString(model) ? model : ''"
    @input="
      (event: Event) => {
        const target = event.target as HTMLInputElement;
        model = target.value;
      }
    "
  />
  <template v-if="$props.info.component === 'date-range'">
    <div class="ksd-filter__field-control date-container">
      <input
        type="date"
        class="ksd-filter__field-control date"
        :value="isArray(model) ? (isString(model[0]) ? model[0] : '') : ''"
        @input="
          (event: Event) => {
            const target = event.target as HTMLInputElement;
            if (!isArray(model)) {
              model = [];
            }
            (model as unknown[])[0] = target.value;
          }
        "
      />
      <span> - </span>
      <input
        type="date"
        class="ksd-filter__field-control date"
        :value="isArray(model) ? (isString(model[1]) ? model[1] : '') : ''"
        @input="
          (event: Event) => {
            const target = event.target as HTMLInputElement;
            if (!isArray(model)) {
              model = [];
            }
            (model as unknown[])[1] = target.value;
          }
        "
      />
    </div>
  </template>
</template>

<style lang="scss"></style>
