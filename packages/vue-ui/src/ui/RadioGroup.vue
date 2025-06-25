<script setup lang="ts">
  import { randomString } from "@krainovsd/js-helpers";
  import { computed } from "vue";
  import type { RadioValue } from "./Radio.vue";
  import Radio from "./Radio.vue";
  import RadioButton from "./RadioButton.vue";

  export type RadioGroupOptionType = "default" | "button";
  export type RadioGroupButtonStyle = "outline" | "solid";
  export type RadioGroupSize = "small" | "default" | "large";
  export type RadioOption = {
    label: string;
    value: RadioValue;
    disabled?: boolean;
    id?: string;
    title?: string;
    className?: string;
  };
  export type RadioGroupProps = {
    options: RadioOption[];
    disabled?: boolean;
    name?: string;
    optionType?: RadioGroupOptionType;
    buttonStyle?: RadioGroupButtonStyle;
    size?: RadioGroupSize;
  };

  const props = defineProps<RadioGroupProps>();
  const model = defineModel<RadioValue>();

  const optionType = computed(() =>
    props.optionType === "default" || props.optionType == undefined ? "default" : "button",
  );
  const name = computed(() => props.name ?? randomString(5));
</script>

<template>
  <template v-for="option in $props.options" :key="option.value">
    <Radio
      v-if="optionType === 'default'"
      v-model="model"
      :value="option.value"
      :name="name"
      :class="option.className"
    >
      {{ option.label }}
    </Radio>
    <RadioButton
      v-if="optionType === 'button'"
      v-model="model"
      :value="option.value"
      :name="name"
      :button-style="$props.buttonStyle"
      :size="$props.size"
      :disabled="$props.disabled || option.disabled"
      :class="option.className"
    >
      {{ option.label }}
    </RadioButton>
  </template>
</template>

<style lang="scss" module></style>
