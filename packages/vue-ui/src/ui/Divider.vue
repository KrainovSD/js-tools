<script setup lang="ts">
  import { computed } from "vue";

  type Props = {
    type?: "horizontal" | "vertical";
    variant?: "solid" | "dotted" | "dashed";
    orientation?: "left" | "right" | "center";
  };

  const props = defineProps<Props>();

  const componentStyles = computed(() => ({
    [props.variant ?? "solid"]: true,
    [props.type ?? "horizontal"]: true,
    [props.orientation ?? "center"]: true,
  }));
</script>

<template>
  <div
    class="ksd-divider"
    :class="[componentStyles, { slot: $slots.default, alone: !$slots.default }]"
  >
    <slot></slot>
  </div>
</template>

<style lang="scss">
  .ksd-divider {
    &.alone {
      border-width: var(--ksd-divider-width);
      border-color: var(--ksd-divider-color);

      &.solid {
        border-style: solid;
      }
      &.dashed {
        border-style: dashed;
      }
      &.dotted {
        border-style: dotted;
      }

      &.horizontal {
        width: 100%;
        height: 0px;
      }
      &.vertical {
        width: 0px;
        height: auto;
      }
    }

    &.slot {
      display: flex;
      align-items: center;
      --ksd-divider-slot-border-width: var(--ksd-divider-width);
      --ksd-divider-slot-border-color: var(--ksd-divider-color);
      --ksd-divider-slot-height: 0px;

      &.solid {
        --ksd-divider-slot-border-style: solid;
      }
      &.dashed {
        --ksd-divider-slot-border-style: dashed;
      }
      &.dotted {
        --ksd-divider-slot-border-style: dotted;
      }

      &.left {
        --ksd-divider-slot-first-width: 5%;
        --ksd-divider-slot-second-width: 95%;
      }

      &.center {
        --ksd-divider-slot-first-width: 50%;
        --ksd-divider-slot-second-width: 50%;
      }

      &.right {
        --ksd-divider-slot-first-width: 95%;
        --ksd-divider-slot-second-width: 5%;
      }

      &::before {
        content: "";
        display: flex;
        border-width: var(--ksd-divider-slot-border-width);
        border-color: var(--ksd-divider-slot-border-color);
        border-style: var(--ksd-divider-slot-border-style);
        width: var(--ksd-divider-slot-first-width);
        height: var(--ksd-divider-slot-height);
      }
      &::after {
        content: "";
        display: flex;
        border-width: var(--ksd-divider-slot-border-width);
        border-color: var(--ksd-divider-slot-border-color);
        border-style: var(--ksd-divider-slot-border-style);
        width: var(--ksd-divider-slot-second-width);
        height: var(--ksd-divider-slot-height);
      }
    }
  }
</style>
