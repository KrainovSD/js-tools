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
      const themeConfig = props.themeConfig[state[0]];
      const common = Object.values(themeConfig.common)
        .map((type) =>
          Object.entries(type).map(([key, value]) =>
            value != undefined ? `--${key}: ${value};` : "",
          ),
        )
        .flat(2)
        .filter((el) => el != "")
        .join(" ");
      const components = Object.values(themeConfig.components)
        .map((type) =>
          Object.entries(type).map(([key, value]) =>
            value != undefined ? `--${key}: ${value};` : "",
          ),
        )
        .flat(2)
        .filter((el) => el != "")
        .join(" ");

      document.documentElement.style.cssText = `font-size: ${state[1]}px; ${common} ${components} `;
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
