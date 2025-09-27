<script setup lang="ts">
  import { debounce } from "@krainovsd/js-helpers";
  import { ref, useTemplateRef, watch } from "vue";
  import { COLOR_PICKER_DEFAULT } from "../constants/tech";
  import type { ButtonSize } from "./Button.vue";
  import Button from "./Button.vue";

  export type ColorPickerProps = {
    size?: ButtonSize;
    defaultColor?: string;
    delay?: number;
  };

  const props = withDefaults(defineProps<ColorPickerProps>(), {
    defaultColor: COLOR_PICKER_DEFAULT,
    delay: 400,
    size: "default",
  });
  const model = defineModel<string>({ default: COLOR_PICKER_DEFAULT });
  const color = ref(model.value ?? props.defaultColor);
  const inputRef = useTemplateRef("input");

  const updateModelDebounce = debounce((color: string) => {
    if (model.value !== color) {
      model.value = color;
    }
  }, props.delay);

  watch(
    color,
    (color) => {
      updateModelDebounce(color);
    },
    { immediate: true },
  );

  watch(model, (model) => {
    color.value = model;
  });
</script>

<template>
  <div class="ksd-color-picker">
    <Button :size="$props.size" class="ksd-color-picker__button" @click="inputRef?.click?.()">
      <template #icon>
        <div class="ksd-color-picker__color" :style="{ '--color': color }"></div>
      </template>
    </Button>
    <input
      ref="input"
      v-model="color"
      type="color"
      class="ksd-color-picker__input"
      aria-hidden="true"
      tabindex="-1"
    />
  </div>
</template>

<style lang="scss">
  .ksd-color-picker {
    width: fit-content;
    height: fit-content;
    display: flex;
    position: relative;

    &__input {
      position: absolute;
      visibility: hidden;
      bottom: -5px;
    }

    &__color {
      background-color: var(--color);
      width: 100%;
      height: 100%;
      border-radius: var(--ksd-border-radius-sm);
    }
  }

  button.ksd-color-picker__button {
    background: transparent;
    padding: var(--ksd-padding-xxs) !important;
  }
</style>
