<script setup lang="ts">
  import { dateFormat } from "@krainovsd/js-helpers";
  import { type GanttInfo, VText, VTooltip } from "../../ui";
  import type { RowData } from "./types";

  type Props = {
    row: GanttInfo<RowData>;
    duration: number;
  };
  defineProps<Props>();
</script>

<template>
  <VTooltip :open-above-cursor="true" :class-name-content="$style.base">
    <slot></slot>
    <template #content>
      <VText :strong="true" type="secondary" :class="$style.header">Идентификатор:</VText>
      <VText :class="$style.info">
        {{ $props.row.id }}
      </VText>
      <VText :strong="true" type="secondary" :class="$style.header">Название:</VText>
      <VText :class="$style.info">
        {{ $props.row.name }}
      </VText>
      <VText :strong="true" type="secondary" :class="$style.header">Начало:</VText>
      <VText :class="$style.info">
        {{ dateFormat($props.row.start, "DD.MM.YYYY") }}
      </VText>
      <VText :strong="true" type="secondary" :class="$style.header">Окончание:</VText>
      <VText :class="$style.info">
        {{ dateFormat($props.row.end, "DD.MM.YYYY") }}
      </VText>
      <VText :strong="true" type="secondary" :class="$style.header">Продолжительность:</VText>
      <VText :class="$style.info">
        {{ $props.duration }}
      </VText>
    </template>
  </VTooltip>
</template>

<style lang="scss" module>
  .base {
    display: flex;
    flex-direction: column;
    gap: var(--ksd-padding-xxs);
  }

  .info {
    color: var(--ksd-text-reverse-color) !important;
  }

  .header {
  }
</style>
