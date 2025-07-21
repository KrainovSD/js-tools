<script setup lang="ts">
  import { VCloseOutlined } from "@krainovsd/vue-icons";
  import { computed, useTemplateRef } from "vue";
  import IconWrapper from "./IconWrapper.vue";

  export type TagSize = "default" | "large" | "extra-large";
  export type TagColor =
    | "magenta"
    | "red"
    | "volcano"
    | "orange"
    | "gold"
    | "lime"
    | "green"
    | "cyan"
    | "blue"
    | "geekblue"
    | "purple"
    | "success"
    | "processing"
    | "warning"
    | "error"
    | "default";

  export type TagProps = {
    color?: TagColor;
    closable?: boolean;
    size?: TagSize;
    borderless?: boolean;
  };

  type Emits = {
    close: [];
  };

  const props = withDefaults(defineProps<TagProps>(), {
    borderless: false,
    closable: false,
    color: "default",
    value: undefined,
    size: "default",
  });
  defineEmits<Emits>();

  const classes = computed(() => ({
    [`color-${props.color}`]: true,
    borderless: props.borderless,
    [`size-${props.size}`]: true,
  }));
  const tagRef = useTemplateRef("tag");

  defineExpose({ tagRef });
</script>

<template>
  <span ref="tag" class="ksd-tag" :class="classes" v-bind="$attrs">
    <slot v-if="$slots.icon" name="icon"></slot>
    <slot></slot>
    <IconWrapper v-if="$props.closable" class="ksd-tag__close" @click="$emit('close')"
      ><VCloseOutlined
    /></IconWrapper>
  </span>
</template>

<style lang="scss">
  .ksd-tag {
    font-size: var(--ksd-font-size-sm);
    line-height: var(--ksd-line-height-sm);
    list-style: none;
    font-family: var(--ksd-font-family);
    display: inline-block;
    height: auto;
    padding-inline: calc(8px - var(--ksd-line-width));
    white-space: nowrap;
    border: var(--ksd-line-width) var(--ksd-line-type) transparent;
    border-radius: var(--ksd-border-radius-sm);
    opacity: 1;
    transition: all var(--ksd-transition-mid);
    position: relative;
    width: fit-content;
    display: flex;
    align-items: center;
    gap: var(--ksd-margin-xs);

    &:focus-visible {
      outline: var(--ksd-outline-width) var(--ksd-outline-type) var(--ksd-outline-color);
      outline-offset: 1px;
      transition:
        outline-offset 0s,
        outline 0s;
    }

    &.color-default {
      color: var(--ksd-tag-default-color);
      background: var(--ksd-tag-default-bg);
      border-color: var(--ksd-border-color);
    }

    &.color-processing {
      color: var(--ksd-tag-text-color-processing);
      background: var(--ksd-tag-bg-color-processing);
      border-color: var(--ksd-tag-border-color-processing);
    }
    &.color-success {
      color: var(--ksd-tag-text-color-success);
      background: var(--ksd-tag-bg-color-success);
      border-color: var(--ksd-tag-border-color-success);
    }
    &.color-error {
      color: var(--ksd-tag-text-color-error);
      background: var(--ksd-tag-bg-color-error);
      border-color: var(--ksd-tag-border-color-error);
    }
    &.color-warning {
      color: var(--ksd-tag-text-color-warning);
      background: var(--ksd-tag-bg-color-warning);
      border-color: var(--ksd-tag-border-color-warning);
    }
    &.color-magenta {
      color: var(--ksd-tag-text-color-magenta);
      background: var(--ksd-tag-bg-color-magenta);
      border-color: var(--ksd-tag-border-color-magenta);
    }
    &.color-red {
      color: var(--ksd-tag-text-color-red);
      background: var(--ksd-tag-bg-color-red);
      border-color: var(--ksd-tag-border-color-red);
    }
    &.color-volcano {
      color: var(--ksd-tag-text-color-volcano);
      background: var(--ksd-tag-bg-color-volcano);
      border-color: var(--ksd-tag-border-color-volcano);
    }
    &.color-orange {
      color: var(--ksd-tag-text-color-orange);
      background: var(--ksd-tag-bg-color-orange);
      border-color: var(--ksd-tag-border-color-orange);
    }
    &.color-gold {
      color: var(--ksd-tag-text-color-gold);
      background: var(--ksd-tag-bg-color-gold);
      border-color: var(--ksd-tag-border-color-gold);
    }
    &.color-lime {
      color: var(--ksd-tag-text-color-lime);
      background: var(--ksd-tag-bg-color-lime);
      border-color: var(--ksd-tag-border-color-lime);
    }
    &.color-green {
      color: var(--ksd-tag-text-color-green);
      background: var(--ksd-tag-bg-color-green);
      border-color: var(--ksd-tag-border-color-green);
    }
    &.color-cyan {
      color: var(--ksd-tag-text-color-cyan);
      background: var(--ksd-tag-bg-color-cyan);
      border-color: var(--ksd-tag-border-color-cyan);
    }
    &.color-blue {
      color: var(--ksd-tag-text-color-blue);
      background: var(--ksd-tag-bg-color-blue);
      border-color: var(--ksd-tag-border-color-blue);
    }
    &.color-geekblue {
      color: var(--ksd-tag-text-color-geekblue);
      background: var(--ksd-tag-bg-color-geekblue);
      border-color: var(--ksd-tag-border-color-geekblue);
    }
    &.color-purple {
      color: var(--ksd-tag-text-color-purple);
      background: var(--ksd-tag-bg-color-purple);
      border-color: var(--ksd-tag-border-color-purple);
    }

    &.borderless {
      border-color: transparent;
    }

    & > svg:first-child {
      font-size: var(--ksd-font-size-sm);
    }

    &__close {
      transition: all var(--ksd-transition-mid);
      color: var(--ksd-icon-color);
      font-size: calc((var(--ksd-font-size-sm) - var(--ksd-line-width) * 2));

      &:hover {
        color: var(--ksd-icon-hover-color);
      }
    }

    &.size-large {
      padding-inline: calc(8px - var(--ksd-line-width));
      font-size: var(--ksd-font-size);
      line-height: var(--ksd-line-height);

      & > svg:first-child {
        font-size: var(--ksd-font-size);
      }

      &__close {
        font-size: calc((var(--ksd-font-size) - var(--ksd-line-width) * 2));
      }
    }
    &.size-extra-large {
      padding-inline: calc(8px - var(--ksd-line-width));
      font-size: var(--ksd-font-size-lg);
      line-height: var(--ksd-line-height);

      & > svg:first-child {
        font-size: var(--ksd-font-size-lg);
      }

      &__close {
        font-size: calc((var(--ksd-font-size-lg) - var(--ksd-line-width) * 2));
      }
    }
  }
</style>
