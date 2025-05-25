<script setup lang="ts">
  import { computed, useSlots, useTemplateRef } from "vue";
  import LoadingIcon from "../icons/LoadingIcon.vue";

  type Props = {
    type?: "primary" | "dashed" | "link" | "text" | "default";
    disabled?: boolean;
    loading?: boolean;
    size?: "large" | "default" | "small";
    shape?: "circle" | "default" | "round";
    danger?: boolean;
    ghost?: boolean;
    iconPosition?: "left" | "right";
    block?: boolean;
  };
  const props = defineProps<Props>();
  const slots = useSlots();
  const element = useTemplateRef("button");

  const componentStyles = computed(() => ({
    [`type-${props.type ?? "default"}`]: true,
    [`size-${props.size ?? "default"}`]: true,
    [`shape-${props.shape ?? "default"}`]: true,
    wave: props.type !== "link" && props.type !== "text",
    disabled: props.disabled,
    danger: props.danger,
    ghost: props.ghost,
    loading: props.loading,
    block: props.block,
    // eslint-disable-next-line no-useless-computed-key
    ["icon-only"]: !slots.default,
  }));

  const iconPosition = computed(() => (props.iconPosition === "right" ? "right" : "left"));

  defineExpose({ element });
</script>

<template>
  <button ref="button" :disabled="$props.disabled" class="ksd-button" :class="componentStyles">
    <slot v-if="iconPosition === 'left' && !$props.loading" name="icon"></slot>
    <LoadingIcon v-if="iconPosition === 'left' && $props.loading" />
    <slot></slot>
    <slot v-if="iconPosition === 'right' && !$props.loading" name="icon"></slot>
    <LoadingIcon v-if="iconPosition === 'right' && $props.loading" />
  </button>
</template>

<style>
  .wave-effect {
    position: absolute;
    border-radius: 50%;
    background-color: rgba(22, 119, 255, 0.7);
    transform: scale(1);
    animation: wave 0.6s linear;
    pointer-events: none;
  }

  @keyframes wave {
    100% {
      transform: scale(1.2);
      opacity: 0;
    }
  }
</style>

<style lang="scss">
  .ksd-button {
    outline: none;
    position: relative;
    display: inline-flex;
    gap: var(--ksd-padding-xs);
    align-items: center;
    justify-self: center;
    transition: all 0.2s ease-out;
    border: 1px solid transparent;
    touch-action: manipulation;
    text-align: center;
    white-space: nowrap;
    font-family: var(--ksd-font-family);
    font-weight: var(--ksd-font-weight);
    width: fit-content;
    cursor: pointer;

    &:focus-visible {
      outline: 3px solid var(--ksd-outline-color);
      outline-offset: 1px;
      transition:
        outline-offset 0s,
        outline 0s;
    }

    &:not(.disabled):not(.loading).wave {
      &:after {
        content: "";
        display: block;
        position: absolute;
        border-radius: inherit;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        opacity: 0;
        transition: all 0.5s;
        box-shadow: 0 0 2.5px 10px var(--wave-color);
      }

      &:active:after {
        box-shadow: 0 0 0 0 var(--wave-color);
        position: absolute;
        border-radius: inherit;
        left: 0;
        top: 0;
        opacity: 0.4;
        transition: 0s;
      }
    }

    /** Size */
    &.size-default {
      height: var(--ksd-control-height);
      font-size: 1rem;
      padding: 0px var(--ksd-button-padding);
      border-radius: var(--ksd-border-radius);

      &.shape-round {
        border-radius: var(--ksd-control-height);
      }
      &.icon-only.shape-circle,
      &.icon-only.shape-default {
        width: var(--ksd-control-height);
        padding: 0;
      }
    }
    &.size-small {
      height: var(--ksd-control-height-sm);
      font-size: var(--ksd-font-size-sm);
      padding: 0px var(--ksd-button-padding-sm);
      border-radius: var(--ksd-border-radius-sm);
      &.shape-round {
        border-radius: var(--ksd-control-height-sm);
      }
      &.icon-only.shape-circle,
      &.icon-only.shape-default {
        width: var(--ksd-control-height-sm);
        padding: 0;
      }
    }

    &.size-large {
      height: var(--ksd-control-height-lg);
      font-size: var(--ksd-font-size-lg);
      padding: 0px var(--ksd-button-padding-lg);
      border-radius: var(--ksd-border-radius-lg);
      &.shape-round {
        border-radius: var(--ksd-control-height-lg);
      }
      &.icon-only.shape-circle,
      &.icon-only.shape-default {
        width: var(--ksd-control-height-lg);
        padding: 0;
      }
    }

    &.shape-circle {
      border-radius: 50%;
    }

    &.icon-only {
      & > svg {
        margin: auto;
      }
    }

    /** Type */
    &.type-default {
      color: var(--ksd-text-main-color);
      border-color: var(--ksd-button-border);
      background-color: var(--ksd-button-bg);
      --wave-color: var(--ksd-accent-hover-color);

      &.danger {
        color: var(--ksd-error-color);
        border-color: var(--ksd-error-color);
        background-color: var(--ksd-button-bg);
        --wave-color: var(--ksd-error-hover-color);
      }

      &.ghost {
        background-color: transparent;
        color: var(--ksd-text-reverse-color);
      }

      &.disabled {
        color: var(--ksd-button-text-disabled-color);
        border-color: var(--ksd-button-border-disabled-color);
        background-color: var(--ksd-button-bg-disabled-color);
      }
    }

    &.type-dashed {
      border-style: dashed;
      color: var(--ksd-text-main-color);
      border-color: var(--ksd-button-border);
      background-color: var(--ksd-button-bg);
      --wave-color: var(--ksd-accent-hover-color);

      &.danger {
        color: var(--ksd-error-color);
        border-color: var(--ksd-error-color);
        background-color: var(--ksd-button-bg);
        --wave-color: var(--ksd-error-hover-color);
      }

      &.ghost {
        color: var(--ksd-text-reverse-color);
        background-color: transparent;
      }

      &.disabled {
        color: var(--ksd-button-text-disabled-color);
        border-color: var(--ksd-button-border-disabled-color);
        background-color: var(--ksd-button-bg-disabled-color);
      }
    }

    &.type-primary {
      color: var(--ksd-text-reverse-color);
      border-color: var(--ksd-accent-color);
      background-color: var(--ksd-accent-color);
      --wave-color: var(--ksd-accent-hover-color);

      &.danger {
        color: var(--ksd-text-reverse-color);
        border-color: var(--ksd-error-color);
        background-color: var(--ksd-error-color);
        --wave-color: var(--ksd-error-hover-color);
      }

      &.ghost {
        color: var(--ksd-accent-color);
        background-color: transparent;
      }

      &.disabled {
        color: var(--ksd-button-text-disabled-color);
        border-color: var(--ksd-button-border-disabled-color);
        background-color: var(--ksd-button-bg-disabled-color);
      }
    }

    &.type-text {
      color: var(--ksd-text-main-color);
      border-color: transparent;
      background-color: transparent;

      &.danger {
        color: var(--ksd-error-color);
      }

      &.disabled {
        color: var(--ksd-button-text-disabled-color);
      }
    }

    &.type-link {
      color: var(--ksd-accent-color);
      border-color: transparent;
      background-color: transparent;

      &.danger {
        color: var(--ksd-error-color);
      }

      &.disabled {
        color: var(--ksd-button-text-disabled-color);
      }
    }

    &.loading {
      opacity: 0.65;
      cursor: inherit;
    }

    &.disabled {
      cursor: not-allowed;
    }

    &.block {
      width: auto;
    }

    &:not(.disabled):hover {
      &.type-default {
        color: var(--ksd-accent-hover-color);
        border-color: var(--ksd-accent-hover-color);

        &.danger {
          color: var(--ksd-error-hover-color);
          border-color: var(--ksd-error-hover-color);
        }
      }

      &.type-dashed {
        color: var(--ksd-accent-hover-color);
        border-color: var(--ksd-accent-hover-color);

        &.danger {
          color: var(--ksd-error-hover-color);
          border-color: var(--ksd-error-hover-color);
        }
      }

      &.type-primary {
        border-color: var(--ksd-accent-hover-color);
        background-color: var(--ksd-accent-hover-color);

        &.danger {
          border-color: var(--ksd-error-hover-color);
          background-color: var(--ksd-error-hover-color);
        }

        &.ghost {
          color: var(--ksd-accent-hover-color);
          background-color: transparent;
        }
      }

      &.type-text {
        background-color: var(--ksd-bg-hover-color);
        &.danger {
          color: var(--ksd-error-hover-color);
          background-color: var(--ksd-error-bg-color);
        }
      }

      &.type-link {
        color: var(--ksd-accent-hover-color);
        &.danger {
          color: var(--ksd-error-hover-color);
        }
      }
    }

    &:not(.disabled):active {
      &.type-default {
        color: var(--ksd-accent-active-color);
        border-color: var(--ksd-accent-active-color);
        &.danger {
          color: var(--ksd-error-active-color);
          border-color: var(--ksd-error-active-color);
        }
      }
      &.type-dashed {
        color: var(--ksd-accent-active-color);
        border-color: var(--ksd-accent-active-color);
        &.danger {
          color: var(--ksd-error-active-color);
          border-color: var(--ksd-error-active-color);
        }
      }

      &.type-primary {
        background-color: var(--ksd-accent-active-color);
        border-color: var(--ksd-accent-active-color);
        &.danger {
          background-color: var(--ksd-error-active-color);
          border-color: var(--ksd-error-active-color);
        }
        &.ghost {
          color: var(--ksd-accent-active-color);
          background-color: transparent;
        }
      }

      &.type-text {
        background-color: var(--ksd-bg-active-color);
        &.danger {
          color: var(--ksd-error-active-color);
          background-color: var(--ksd-error-bg-active-color);
        }
      }

      &.type-link {
        color: var(--ksd-accent-active-color);
        &.danger {
          color: var(--ksd-error-active-color);
        }
      }
    }
  }
</style>
