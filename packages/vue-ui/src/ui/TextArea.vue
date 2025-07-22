<script setup lang="ts">
  import { type HTMLAttributes, computed, useTemplateRef, watch } from "vue";
  import type { InputProps } from "./Input.vue";

  export type TextAreaResize = "vertical" | "horizontal" | "both";

  export type TextAreaProps = {
    rows?: number;
    maxLength?: number;
    resize?: TextAreaResize;
    autoSize?: boolean;
  } & Omit<InputProps, "allowClear" | "className"> &
    /*@vue-ignore*/ HTMLAttributes;

  const props = withDefaults(defineProps<TextAreaProps>(), {
    autofocus: false,
    disabled: false,
    maxLength: undefined,
    rows: 4,
    size: "default",
    status: "default",
    variant: "outlined",
    resize: undefined,
    autoSize: false,
  });
  const value = defineModel<string>();
  const inputRef = useTemplateRef("input");
  const inputClasses = computed(() => ({
    [`variant-${props.variant}`]: true,
    [`size-${props.size}`]: true,
    [`status-${props.status}`]: true,
    [`resize-${props.resize}`]: props.resize != undefined,
    disabled: props.disabled,
    autosize: props.autoSize,
  }));

  /** Resize input in multiple mode */
  const resizeObserver = watch(
    () => [value.value, inputRef.value],
    () => {
      if (!props.autoSize || !inputRef.value) return;

      inputRef.value.style.height = "0px";
      inputRef.value.style.height = `${inputRef.value.scrollHeight}px`;
    },
    { immediate: false, flush: "post" },
  );

  watch(
    () => props.autoSize,
    (autoSize) => {
      if (autoSize) {
        resizeObserver.resume();
      } else {
        resizeObserver.pause();
      }
    },
    { immediate: true },
  );

  defineExpose({ inputRef });
</script>

<template>
  <textarea
    ref="input"
    v-bind="$attrs"
    v-model="value"
    class="ksd-input ksd-text-area"
    :class="inputClasses"
    :rows="$props.autoSize ? 1 : $props.rows"
    :maxlength="$props.maxLength"
    :disabled="$props.disabled"
  ></textarea>
</template>

<style lang="scss">
  .ksd-text-area {
    resize: none;

    &.resize-vertical {
      resize: vertical;
    }
    &.resize-horizontal {
      resize: horizontal;
    }
    &.resize-both {
      resize: both;
    }
    &.autosize {
      overflow: hidden;
    }
  }
</style>
