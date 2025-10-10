<script setup lang="ts">
  import { dateFormat } from "@krainovsd/js-helpers";
  import { type GanttInfo, VText, VTooltip } from "../../..";

  type Props = {
    row: GanttInfo<unknown>;
    duration: number;
  };
  defineProps<Props>();
</script>

<template>
  <VTooltip :open-above-cursor="true" class-name-content="ksd-gantt-graph__tooltip">
    <slot></slot>
    <template #content>
      <VText :strong="true" type="secondary" class="ksd-gantt-graph__tooltip-header"
        >Идентификатор:</VText
      >
      <VText class="ksd-gantt-graph__tooltip-info">
        {{ $props.row.id }}
      </VText>
      <VText :strong="true" type="secondary" class="ksd-gantt-graph__tooltip-header"
        >Название:</VText
      >
      <VText class="ksd-gantt-graph__tooltip-info">
        {{ $props.row.name }}
      </VText>
      <VText :strong="true" type="secondary" class="ksd-gantt-graph__tooltip-header">Начало:</VText>
      <VText class="ksd-gantt-graph__tooltip-info">
        {{ dateFormat($props.row.start, "DD.MM.YYYY") }}
      </VText>
      <VText :strong="true" type="secondary" class="ksd-gantt-graph__tooltip-header"
        >Окончание:</VText
      >
      <VText class="ksd-gantt-graph__tooltip-info">
        {{ dateFormat($props.row.end, "DD.MM.YYYY") }}
      </VText>
      <VText :strong="true" type="secondary" class="ksd-gantt-graph__tooltip-header"
        >Продолжительность:</VText
      >
      <VText class="ksd-gantt-graph__tooltip-info">
        {{ $props.duration }}
      </VText>
    </template>
  </VTooltip>
</template>

<style lang="scss">
  .ksd-gantt-graph {
    &__tooltip {
      display: flex;
      flex-direction: column;
      gap: var(--ksd-padding-xxs);
    }
    /* &__tooltip-header {
      color: var(--ksd-text-reverse-color) !important;

    } */
    &__tooltip-info {
      color: var(--ksd-text-reverse-color) !important;
    }
  }
</style>
