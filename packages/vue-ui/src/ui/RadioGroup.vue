<script setup lang="ts">
  import { randomString } from "@krainovsd/js-helpers";
  import { computed } from "vue";
  import type { RadioValue } from "./Radio.vue";
  import Radio from "./Radio.vue";
  import RadioButton from "./RadioButton.vue";

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
    className?: string;
    optionType?: "default" | "button";
    buttonStyle?: "outline" | "solid";
    size?: "small" | "default" | "large";
  };

  const props = defineProps<RadioGroupProps>();
  const model = defineModel<RadioValue>();

  const optionType = computed(() =>
    props.optionType === "default" || !props.optionType ? "default" : "button",
  );
  const name = computed(() => props.name ?? randomString(5));
</script>

<template>
  <template v-for="option in $props.options" :key="option.value">
    <Radio v-if="optionType === 'default'" v-model="model" :value="option.value" :name="name">
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
    >
      {{ option.label }}
    </RadioButton>
  </template>
</template>

<style lang="scss" module></style>
