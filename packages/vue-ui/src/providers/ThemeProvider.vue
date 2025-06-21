<script setup lang="ts" generic="T extends string">
  import "@krainovsd/vue-icons/styles";
  import { watch } from "vue";
  import type { ThemeVariableConfig } from "../types";

  type Props = {
    theme: T;
    fontSize: number;
    themeConfig: Record<T, ThemeVariableConfig>;
  };

  const props = defineProps<Props>();

  watch(
    (): [T, number] => [props.theme, props.fontSize],
    (state) => {
      const variables = Object.values(props.themeConfig[state[0]])
        .map((category) =>
          Object.values(category).map((type) =>
            Object.entries(type).map(([key, value]) =>
              value ? `--${key}: ${value as string};` : "",
            ),
          ),
        )
        .flat(2)
        .filter((el) => el)
        .join(" ");

      document.documentElement.style.cssText = `font-size: ${state[1]}px; ${variables} `;
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
</style>
