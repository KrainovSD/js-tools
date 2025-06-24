<script setup lang="ts">
  import { VRightOutlined } from "@krainovsd/vue-icons";
  import { computed, onMounted, ref, useTemplateRef } from "vue";
  import Flex from "./Flex.vue";

  export type CollapseProps = {
    initialOpen: boolean;
    size?: "default" | "small" | "large";
    ghost?: boolean;
    borderless?: boolean;
    noArrow?: boolean;
    header?: string;
    classNameBody?: string;
    classNameHeader?: string;
    classNameRoot?: string;
  };

  type Emits = {
    toggle: [open: boolean];
  };

  const bodyRef = useTemplateRef("body");
  const collapseRef = useTemplateRef("collapse");

  const emit = defineEmits<Emits>();
  const props = defineProps<CollapseProps>();
  const open = ref(props.initialOpen ?? false);

  const commonClasses = computed(() => ({
    default: props.size === "default" || props.size == undefined,
    small: props.size === "small",
    large: props.size === "large",
    borderless: props.borderless,
    ghost: props.ghost,
    open: open.value,
  }));

  onMounted(() => {
    if (props.initialOpen) bodyRef.value?.classList?.add?.("open");
  });

  function onToggle() {
    const body = bodyRef.value;
    if (!body) return;
    open.value = !open.value;
    emit("toggle", open.value);

    const keyframesOpen: Keyframe[] = [
      { maxHeight: `${body.clientHeight}px`, offset: 0 },
      { maxHeight: `${body.scrollHeight}px`, offset: 1 },
    ];
    const keyframesClose: Keyframe[] = [
      { maxHeight: `${body.clientHeight}px`, offset: 0 },
      { maxHeight: "0", offset: 1 },
    ];

    const animate = body.animate(open.value ? keyframesOpen : keyframesClose, {
      duration: 200,
      fill: "forwards",
    });
    animate.onfinish = function onfinish() {
      animate.cancel();
    };
  }

  function onClickHeader() {
    onToggle();
  }
  function onKeyDownHeader(event: KeyboardEvent) {
    if (event.key === "Enter" || event.key === " ") {
      onToggle();
    }
  }

  defineExpose({ collapseRef, bodyRef });
</script>

<template>
  <Flex
    ref="collapse"
    vertical
    w-full
    class="ksd-collapse"
    :class="[$props.classNameRoot, commonClasses]"
  >
    <Flex
      class="ksd-collapse__header"
      :class="[$props.classNameHeader, commonClasses]"
      :gap="12"
      flex-align="center"
      role="button"
      :aria-expanded="open"
      tabindex="0"
      @click="onClickHeader"
      @keydown="onKeyDownHeader"
    >
      <VRightOutlined
        v-if="!$props.noArrow"
        :size="12"
        class="ksd-collapse__arrow"
        :class="{ open: open }"
      />
      <div v-if="$props.header" class="ksd-collapse__header-text" :class="commonClasses">
        {{ $props.header }}
      </div>
      <slot name="header"></slot>
    </Flex>
    <div ref="body" vertical class="ksd-collapse__body" :class="commonClasses">
      <div :class="[$props.classNameBody, commonClasses]" class="ksd-collapse__body-box">
        <slot></slot>
      </div>
    </div>
  </Flex>
</template>

<style lang="scss">
  .ksd-collapse {
    border: var(--ksd-line-width) var(--ksd-line-type) var(--ksd-border-color);
    border-radius: var(--ksd-border-radius-lg);
    background-color: var(--ksd-collapse-header-bg);

    &.borderless,
    &.ghost {
      border: none;
    }

    &.ghost {
      background-color: transparent;
    }

    &__header {
      cursor: pointer;
      border-radius: var(--ksd-border-radius-lg);

      &:focus-visible {
        position: relative;
        z-index: 1;
        outline: var(--ksd-outline-width) var(--ksd-outline-type) var(--ksd-outline-color);
        outline-offset: 1px;
        transition:
          outline-offset 0s,
          outline 0s;
      }

      &.open {
        border-radius: var(--ksd-border-radius-lg) var(--ksd-border-radius-lg) 0 0;
      }

      &.default {
        padding: var(--ksd-padding-sm) var(--ksd-padding);
      }

      &.small {
        padding: var(--ksd-padding-xs) var(--ksd-padding-sm);
      }

      &.large {
        padding: var(--ksd-padding) var(--ksd-padding-lg);
      }
    }

    &__arrow {
      transition: transform var(--ksd-transition-mid) ease-out;

      &.open {
        transform: rotate(90deg);
      }
    }

    &__header-text {
      color: var(--ksd-text-main-color);
      line-height: var(--ksd-line-height);
      font-family: var(--ksd-font-family);
      font-size: var(--ksd-font-size);

      &.small {
        font-size: var(--ksd-font-size-sm);
      }

      &.large {
        font-size: var(--ksd-font-size-lg);
      }
    }

    &__body {
      height: auto;
      transition:
        max-height var(--ksd-transition-mid) ease-out,
        opacity var(--ksd-transition-mid) cubic-bezier(0.01, 0, 1, 0);
      overflow: hidden;
      max-height: 0;
      opacity: 0;
      will-change: max-height, opacity;
      color: var(--ksd-text-main-color);
      line-height: var(--ksd-line-height);
      font-family: var(--ksd-font-family);
      border-top: var(--ksd-line-width) var(--ksd-line-type) var(--ksd-border-color);
      background: var(--ksd-collapse-body-bg);
      border-radius: 0 0 var(--ksd-border-radius-lg) var(--ksd-border-radius-lg);

      &.open {
        max-height: none;
        opacity: 1;
        transition:
          max-height var(--ksd-transition-mid) ease-out,
          opacity var(--ksd-transition-mid) cubic-bezier(0.3, 1, 0, 1);
      }

      &.borderless,
      &.ghost {
        border: none;
        background: transparent;
      }
    }

    &__body-box {
      &.default {
        padding: var(--ksd-padding);

        &.borderless {
          padding: var(--ksd-padding-xxs) var(--ksd-padding) var(--ksd-padding);
        }
      }

      &.small {
        padding: var(--ksd-padding-sm);
        font-size: var(--ksd-font-size-sm);

        &.borderless {
          padding: var(--ksd-padding-xxs) var(--ksd-padding-sm) var(--ksd-padding);
        }
      }

      &.large {
        padding: var(--ksd-padding-lg);
        font-size: var(--ksd-font-size-lg);

        &.borderless {
          padding: var(--ksd-padding-xxs) var(--ksd-padding-lg) var(--ksd-padding);
        }
      }
    }
  }
</style>
