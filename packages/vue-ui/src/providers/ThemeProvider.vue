<script setup lang="ts" generic="T extends string">
  import { watch } from "vue";
  import { injectThemeStyle } from "../lib";
  import type { ThemeVariableConfig } from "../types";

  type Props = {
    theme?: T;
    fontSize?: number;
    themeConfig?: Record<T, ThemeVariableConfig>;
  };

  const props = defineProps<Props>();

  watch(
    (): [T | undefined, number | undefined] => [props.theme, props.fontSize],
    (state) => {
      injectThemeStyle({ fontSize: state[1], theme: state[0], themeConfig: props.themeConfig });
    },
    { immediate: true },
  );
</script>

<template>
  <slot></slot>
</template>

<style lang="scss">
  .ksd-icon {
    width: 1em;
    height: 1em;
    min-width: 1em;
    min-height: 1em;
    max-width: 1em;
    max-height: 1em;
  }

  .ksd-icon {
    &.spin {
      animation: spin 1s linear infinite;
    }
  }

  @keyframes spin {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
</style>
