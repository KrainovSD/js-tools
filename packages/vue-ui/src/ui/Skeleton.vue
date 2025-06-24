<script setup lang="ts">
  import { computed } from "vue";

  export type SkeletonType = "title" | "button" | "avatar" | "input" | "text" | "default" | "image";

  export type SkeletonSize = "default" | "small" | "large";
  export type SkeletonShape = "default" | "round" | "circle";

  export type SkeletonProps = {
    type?: SkeletonType;
    animation?: boolean;
    size?: SkeletonSize;
    shape?: SkeletonShape;
    width?: number;
    height?: number;
  };

  const props = withDefaults(defineProps<SkeletonProps>(), {
    type: "default",
    animation: true,
    size: "default",
    shape: "default",
    height: undefined,
    width: undefined,
  });
  const classes = computed(() => ({
    animated: props.animation,
    [`type-${props.type}`]: true,
    [`size-${props.size}`]: true,
    [`shape-${props.shape}`]: true,
  }));
  const styles = computed(() => ({
    width: props.width != undefined ? `${props.width}px` : undefined,
    height: props.height != undefined ? `${props.height}px` : undefined,
    "--width": props.width != undefined ? `${props.width}px` : undefined,
    "--height": props.height != undefined ? `${props.height}px` : undefined,
  }));
</script>

<template>
  <span class="ksd-skeleton" v-bind="$attrs" :class="classes" :style="styles">
    <svg
      v-if="$props.type === 'image'"
      width="1em"
      height="1em"
      viewBox="0 0 1098 1024"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M365.714286 329.142857q0 45.714286-32.036571 77.677714t-77.677714 32.036571-77.677714-32.036571-32.036571-77.677714 32.036571-77.677714 77.677714-32.036571 77.677714 32.036571 32.036571 77.677714zM950.857143 548.571429l0 256-804.571429 0 0-109.714286 182.857143-182.857143 91.428571 91.428571 292.571429-292.571429zM1005.714286 146.285714l-914.285714 0q-7.460571 0-12.873143 5.412571t-5.412571 12.873143l0 694.857143q0 7.460571 5.412571 12.873143t12.873143 5.412571l914.285714 0q7.460571 0 12.873143-5.412571t5.412571-12.873143l0-694.857143q0-7.460571-5.412571-12.873143t-12.873143-5.412571zM1097.142857 164.571429l0 694.857143q0 37.741714-26.843429 64.585143t-64.585143 26.843429l-914.285714 0q-37.741714 0-64.585143-26.843429t-26.843429-64.585143l0-694.857143q0-37.741714 26.843429-64.585143t64.585143-26.843429l914.285714 0q37.741714 0 64.585143 26.843429t26.843429 64.585143z"
        fill="currentColor"
      ></path>
    </svg>
  </span>
</template>

<style lang="scss">
  .ksd-skeleton {
    margin: 0;
    padding: 0;
    display: inline-block;
    background: var(--ksd-skeleton-gradient-from-color);
    border-radius: var(--ksd-skeleton-block-radius);

    &.animated {
      background: linear-gradient(
        90deg,
        var(--ksd-skeleton-gradient-from-color) 25%,
        var(--ksd-skeleton-gradient-to-color) 37%,
        var(--ksd-skeleton-gradient-from-color) 63%
      );
      background-size: 400% 100%;
      animation-name: ksd-skeleton-loading;
      animation-duration: 1.4s;
      animation-timing-function: ease;
      animation-iteration-count: infinite;
    }

    &.type-title {
      height: var(--ksd-skeleton-title-height);
      width: 100%;
    }
    &.type-text {
      height: var(--ksd-font-size);
      width: 100%;
    }
    &.type-button {
      outline: none;
      border: none;
      border-radius: var(--ksd-border-radius-sm);

      &.size-default {
        width: calc(var(--ksd-control-height) * 2);
        min-width: calc(var(--ksd-control-height) * 2);
        line-height: var(--ksd-control-height);
        height: var(--ksd-control-height);
        &.shape-round {
          border-radius: var(--ksd-control-height);
        }
        &.shape-circle {
          border-radius: 50%;
          width: var(--ksd-control-height);
          min-width: var(--ksd-control-height);
        }
      }

      &.size-small {
        width: calc(var(--ksd-control-height-sm) * 2);
        min-width: calc(var(--ksd-control-height-sm) * 2);
        line-height: var(--ksd-control-height-sm);
        height: var(--ksd-control-height-sm);
        &.shape-round {
          border-radius: var(--ksd-control-height-sm);
        }
        &.shape-circle {
          border-radius: 50%;
          width: var(--ksd-control-height-sm);
          min-width: var(--ksd-control-height-sm);
        }
      }

      &.size-large {
        width: calc(var(--ksd-control-height-lg) * 2);
        min-width: calc(var(--ksd-control-height-lg) * 2);
        line-height: var(--ksd-control-height-lg);
        height: var(--ksd-control-height-lg);
        &.shape-round {
          border-radius: var(--ksd-control-height-lg);
        }
        &.shape-circle {
          border-radius: 50%;
          width: var(--ksd-control-height-lg);
          min-width: var(--ksd-control-height-lg);
        }
      }
    }
    &.type-input {
      border-radius: var(--ksd-border-radius-sm);

      &.size-default {
        width: calc(var(--ksd-control-height) * 5);
        min-width: calc(var(--ksd-control-height) * 5);
        line-height: var(--ksd-control-height);
        height: var(--ksd-control-height);
      }

      &.size-small {
        width: calc(var(--ksd-control-height-sm) * 5);
        min-width: calc(var(--ksd-control-height-sm) * 5);
        line-height: var(--ksd-control-height-sm);
        height: var(--ksd-control-height-sm);
      }

      &.size-large {
        width: calc(var(--ksd-control-height-lg) * 5);
        min-width: calc(var(--ksd-control-height-lg) * 5);
        line-height: var(--ksd-control-height-lg);
        height: var(--ksd-control-height-lg);
      }
    }
    &.type-avatar {
      border-radius: var(--ksd-border-radius-sm);

      &.shape-circle {
        border-radius: 50%;
      }

      &.size-default {
        width: calc(var(--ksd-control-height));
        min-width: calc(var(--ksd-control-height));
        line-height: var(--ksd-control-height);
        height: var(--ksd-control-height);
      }

      &.size-small {
        width: calc(var(--ksd-control-height-sm));
        min-width: calc(var(--ksd-control-height-sm));
        line-height: var(--ksd-control-height-sm);
        height: var(--ksd-control-height-sm);
      }

      &.size-large {
        width: calc(var(--ksd-control-height-lg));
        min-width: calc(var(--ksd-control-height-lg));
        line-height: var(--ksd-control-height-lg);
        height: var(--ksd-control-height-lg);
      }
    }
    &.type-image {
      --width: 100px;
      --height: 100px;
      width: 100px;
      height: 100px;
      line-height: 100px;
      height: 100px;
      display: flex;
      align-items: center;
      justify-content: center;

      & svg {
        color: #bfbfbf;
        font-size: calc(min(var(--width), var(--height)) / 2);
      }
    }
  }

  @keyframes ksd-skeleton-loading {
    from {
      background-position: 100% 50%;
    }
    to {
      background-position: 0 50%;
    }
  }
</style>
