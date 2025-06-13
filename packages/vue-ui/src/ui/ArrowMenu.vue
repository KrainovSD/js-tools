<script setup lang="ts">
  import { computed } from "vue";

  export type ArrowMenuProps = {
    direction: "up" | "down" | "right" | "left";
  };

  const props = defineProps<ArrowMenuProps>();
  const classes = computed(() => ({ [props.direction]: true }));
</script>

<template>
  <i class="ksd-arrow-menu" :class="classes"></i>
</template>

<style lang="scss">
  .ksd-arrow-menu {
    position: relative;
    width: calc(var(--ksd-font-size) / 7 * 5);
    color: currentcolor;
    transition: opacity var(--ksd-transition-slow);

    &::before {
      position: absolute;
      width: calc(calc(var(--ksd-font-size) / 7 * 5) * 0.6);
      height: calc(calc(var(--ksd-font-size) / 7 * 5) * 0.15);
      background-color: currentcolor;
      border-radius: var(--ksd-border-radius);
      transition:
        background var(--ksd-transition-slow) ease-in-out,
        transform var(--ksd-transition-slow) ease-in-out,
        top var(--ksd-transition-slow) ease-in-out,
        color var(--ksd-transition-slow) ease-in-out;
      content: "";
    }

    &::after {
      position: absolute;
      width: calc(calc(var(--ksd-font-size) / 7 * 5) * 0.6);
      height: calc(calc(var(--ksd-font-size) / 7 * 5) * 0.15);
      background-color: currentcolor;
      border-radius: var(--ksd-border-radius);
      transition:
        background var(--ksd-transition-slow) ease-in-out,
        transform var(--ksd-transition-slow) ease-in-out,
        top var(--ksd-transition-slow) ease-in-out,
        color var(--ksd-transition-slow) ease-in-out;
      content: "";
    }

    &.down {
      &::before {
        transform: rotate(-45deg) translateX(calc(calc(var(--ksd-font-size) / 7 * 5) * 0.25));
      }
      &::after {
        transform: rotate(45deg)
          translateX(calc(calc(calc(var(--ksd-font-size) / 7 * 5) * 0.25) * -1));
      }
    }
    &.up {
      &::before {
        transform: rotate(45deg) translateX(calc(calc(var(--ksd-font-size) / 7 * 5) * 0.25));
      }
      &::after {
        transform: rotate(-45deg)
          translateX(calc(calc(calc(var(--ksd-font-size) / 7 * 5) * 0.25) * -1));
      }
    }
    &.right {
      &::before {
        transform: rotate(45deg)
          translateY(calc(calc(calc(var(--ksd-font-size) / 7 * 5) * 0.25) * -1));
      }
      &::after {
        transform: rotate(-45deg) translateY(calc(calc(var(--ksd-font-size) / 7 * 5) * 0.25));
      }
    }
    &.left {
      &::before {
        transform: rotate(-45deg)
          translateY(calc(calc(calc(var(--ksd-font-size) / 7 * 5) * 0.25) * -1));
      }
      &::after {
        transform: rotate(45deg) translateY(calc(calc(var(--ksd-font-size) / 7 * 5) * 0.25));
      }
    }
  }
</style>
