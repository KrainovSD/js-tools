<script setup lang="ts">
  import type { GraphSettingsInputInterface } from "@krainovsd/graph";
  import {
    type SelectValue,
    VCheckBox,
    VFlex,
    VSelect,
    VSlider,
    VText,
    VTooltip,
  } from "@krainovsd/vue-ui";

  type Props = {
    inputs: GraphSettingsInputInterface<string>[];
    settings: Record<string, unknown>;
    diffSetting: Set<string>;
  };

  type Emits = {
    change: [key: string, value: unknown];
  };

  const props = defineProps<Props>();
  defineEmits<Emits>();

  function hasDiff(id: string) {
    return props.diffSetting.has(id);
  }
</script>

<template>
  <VFlex
    v-for="input in $props.inputs"
    :key="input.id"
    :gap="10"
    :flex-align="'center'"
    justify="space-between"
  >
    <template v-if="input.type === 'select'">
      <VTooltip :text="input.label ?? input.id" :open-not-visible="true">
        <VText ellipsis :class="[$style.label, hasDiff(input.id) && $style.diff]">
          {{ input.label ?? input.id }}
        </VText>
      </VTooltip>
      <VSelect
        :options="input.options"
        :model-value="($props.settings[input.id] as SelectValue) ?? input.initialValue"
        :class="$style.select"
        @update:model-value="
          (value) => {
            $emit('change', input.id, value);
          }
        "
      />
    </template>

    <template v-if="input.type === 'range'">
      <VTooltip :text="input.label ?? input.id" :open-not-visible="true">
        <VText ellipsis :class="[$style.label, hasDiff(input.id) && $style.diff]">
          {{ input.label ?? input.id }}
        </VText>
      </VTooltip>
      <VFlex :gap="10" :flex-align="'center'">
        <VText nowrap>{{ ` (${settings[input.id] ?? input.initialValue})` }}</VText>
        <VSlider
          :class="$style.slider"
          :min="input.min"
          :max="input.max"
          :step="input.step"
          :model-value="($props.settings[input.id] as number) ?? input.initialValue"
          @update:model-value="(value) => $emit('change', input.id, value)"
      /></VFlex>
    </template>

    <template v-if="input.type === 'checkbox'">
      <VCheckBox
        class="input"
        type="checkbox"
        :class="[$style.checkbox, hasDiff(input.id) && $style.diff]"
        :model-value="Boolean($props.settings[input.id] ?? input.initialValue)"
        @update:model-value="
          (value) => {
            $emit('change', input.id, value);
          }
        "
        >{{ input.label ?? input.id }}</VCheckBox
      >
    </template>

    <template v-if="input.type === 'color'">
      <VTooltip :text="input.label ?? input.id" :open-not-visible="true">
        <VText ellipsis :class="[$style.label, hasDiff(input.id) && $style.diff]">
          {{ input.label ?? input.id }}
        </VText>
      </VTooltip>
      <input
        class="input"
        type="color"
        :value="$props.settings[input.id] ?? input.initialValue"
        @input="(event) => $emit('change', input.id, (event.target as HTMLInputElement).value)"
      />
    </template>
  </VFlex>
</template>

<style lang="scss" module>
  .label {
    &.diff {
      color: var(--ksd-accent-active-color);
      font-weight: 600;
    }
  }

  .checkbox {
    &.diff {
      & > :global(.ksd-checkbox__text) {
        color: var(--ksd-accent-active-color);
        font-weight: 600;
      }
    }
  }

  .select {
    min-width: 200px;
  }

  .slider {
    width: 150px;
  }
</style>
