<script setup lang="ts">
  import { isArray, isBoolean } from "@krainovsd/js-helpers";
  import { computed, useTemplateRef, watchEffect } from "vue";
  import type { GlobalEmits } from "../types";
  import Tag from "./Tag.vue";

  export type TagCheckableValue = string | number | boolean;
  export type CheckableProps = {
    value: TagCheckableValue;
  };

  const props = defineProps<CheckableProps>();
  defineEmits<GlobalEmits>();
  const tagComponentRef = useTemplateRef("tag");
  const tagRef = computed(() => tagComponentRef.value?.tagRef);
  const checkedModel = defineModel<boolean | TagCheckableValue[]>();
  const checked = computed(() =>
    isBoolean(checkedModel.value)
      ? checkedModel.value
      : isArray(checkedModel.value)
        ? checkedModel.value.some((model) => model === props.value)
        : false,
  );
  const classes = computed(() => ({
    checkable: true,
    checked: checked.value,
  }));

  function updateChecked() {
    if (isBoolean(checkedModel.value)) {
      checkedModel.value = !checked.value;
    }
    if (isArray(checkedModel.value) && props.value != undefined) {
      if (!checked.value) {
        checkedModel.value.push(props.value);
      } else {
        const index = checkedModel.value.findIndex((model) => model === props.value);
        if (index != -1) {
          checkedModel.value.splice(index, 1);
        }
      }
    }
  }

  watchEffect((clean) => {
    if (!tagRef.value) return;

    const eventController = new AbortController();

    function actionKeydown(event: KeyboardEvent) {
      if (event.key === " " || event.key === "Enter") {
        updateChecked();
      }
    }

    tagRef.value.addEventListener("click", updateChecked, { signal: eventController.signal });
    tagRef.value.addEventListener("keydown", actionKeydown, { signal: eventController.signal });

    clean(() => {
      eventController.abort();
    });
  });
</script>

<template>
  <Tag ref="tag" :class="classes" role="checkbox" tabindex="0" :aria-checked="checked">
    <template #icon>
      <slot name="icon"> </slot>
    </template>
    <slot></slot>
  </Tag>
</template>

<style lang="scss">
  span.ksd-tag {
    &.checkable {
      cursor: pointer;
      border-color: transparent;
      background: transparent;

      &:hover {
        color: var(--ksd-accent-color);
        background: var(--ksd-bg-fill-hover-color);
      }
    }

    &.checked {
      background: transparent;
      color: var(--ksd-text-reverse-color);
      background: var(--ksd-accent-color);

      &:hover {
        background: var(--ksd-accent-hover-color);
        color: var(--ksd-text-reverse-color);
      }

      &:active {
        background: var(--ksd-accent-active-color);
      }
    }
  }
</style>
