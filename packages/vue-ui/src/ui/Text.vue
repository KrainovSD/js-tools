<script setup lang="ts">
  import { computed } from "vue";

  export type TextProps = {
    ellipsis?: boolean;
    nowrap?: boolean;
    rows?: number;
    weight?: number | string;
    size?: number | "sm" | "lg" | "xl";
    italic?: boolean;
    strong?: boolean;
    delete?: boolean;
    underline?: boolean;
    disabled?: boolean;
    type?: "secondary" | "success" | "warning" | "error";
  };

  const props = defineProps<TextProps>();
  const componentClasses = computed(() => ({
    ellipsis: props.ellipsis,
    nowrap: props.nowrap,
    rows: props.rows != undefined,
    [`size-${typeof props.size === "string" ? props.size : "default"}`]: true,
    italic: props.italic,
    strong: props.strong,
    delete: props.delete,
    underline: props.underline,
    [`type-${props.type ?? "default"}`]: true,
    disabled: props.disabled,
  }));
  const componentStyles = computed(() => ({
    "-webkit-line-clamp": props.rows,
    "line-clamp": props.rows,
    fontWeight: props.weight,
    fontSize: typeof props.size === "number" ? `${props.size}px` : undefined,
  }));
</script>

<template>
  <span class="ksd-text" :class="[componentClasses]" :style="componentStyles"><slot></slot></span>
</template>

<style lang="scss">
  .ksd-text {
    font-family: var(--ksd-font-family);
    font-weight: var(--ksd-font-weight);
    line-height: var(--ksd-line-height);
    word-break: break-word;

    &.nowrap {
      white-space: nowrap;
    }

    &.ellipsis {
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      display: inline-block;
      max-width: 100%;
    }

    &.rows {
      -webkit-box-orient: vertical;
      align-self: stretch;
      display: -webkit-box;
      overflow: hidden;
    }

    &.size-default {
      font-size: 1rem;
    }
    &.size-sm {
      font-size: var(--ksd-font-size-sm);
    }
    &.size-lg {
      font-size: var(--ksd-font-size-lg);
    }
    &.size-xl {
      font-size: var(--ksd-font-size-xl);
    }

    &.italic {
      font-style: italic;
    }
    &.strong {
      font-weight: 600;
    }
    &.delete {
      text-decoration: line-through;
    }
    &.underline {
      text-decoration: underline;
    }

    &.type-default {
      color: var(--ksd-text-main-color);
    }
    &.type-secondary {
      color: var(--ksd-text-secondary-color);
    }
    &.type-success {
      color: var(--ksd-success-color);
    }
    &.type-warning {
      color: var(--ksd-warning-color);
    }
    &.type-error {
      color: var(--ksd-error-color);
    }
    &.disabled {
      color: var(--ksd-text-main-disabled-color);
    }
  }
</style>
