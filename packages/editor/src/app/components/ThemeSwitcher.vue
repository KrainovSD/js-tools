<script setup lang="ts">
  import { APP_THEMES, type IAppTheme, THEME_LABELS } from "../composables/use-theme";

  const theme = defineModel<IAppTheme>({ required: true });
</script>

<template>
  <div :class="$style.switcher">
    <button
      v-for="value in APP_THEMES"
      :key="value"
      type="button"
      :class="[$style.button, { [$style.button_active]: theme === value }]"
      @click="theme = value"
    >
      {{ THEME_LABELS[value] }}
    </button>
  </div>
</template>

<style lang="scss" module>
  .switcher {
    display: flex;
    gap: 6px;
  }

  .button {
    padding: 4px 10px;
    font: inherit;
    cursor: pointer;
    border: 1px solid light-dark(#333, #eee);
    border-radius: 4px;
    background: light-dark(#fff, #1e1e1e);

    &_active {
      color: light-dark(#eee, #111);
      border-color: light-dark(#111, #eee);
      background: light-dark(#333, #eee);
    }
  }
</style>
