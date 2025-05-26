<script setup lang="ts">
  import { computed, onMounted, ref, useTemplateRef } from "vue";
  import ArrowSmallIcon from "../icons/ArrowSmallIcon.vue";
  import Flex from "./Flex.vue";

  export type CollapseProps = {
    initialOpen: boolean;
    size?: "default" | "small" | "large";
    ghost?: boolean;
    borderless?: boolean;
    noArrow?: boolean;
    header?: string;
    bodyClass?: string;
    headerClass?: string;
    baseClass?: string;
  };

  type Emits = {
    toggle: [open: boolean];
  };

  const contentRef = useTemplateRef("body");

  const emit = defineEmits<Emits>();
  const props = defineProps<CollapseProps>();
  const open = ref(props.initialOpen ?? false);

  const componentStyles = computed(() => ({
    default: props.size === "default" || props.size == undefined,
    small: props.size === "small",
    large: props.size === "large",
    borderless: props.borderless,
    ghost: props.ghost,
  }));

  onMounted(() => {
    if (props.initialOpen) contentRef.value?.classList?.add?.("open");
  });

  // function beforeEnter(el: Element) {
  //   (el as HTMLElement).style.maxHeight = "0";
  // }
  // function enter(el: Element) {
  //   (el as HTMLElement).style.maxHeight = `${el.scrollHeight}px`;
  // }
  // function afterEnter(el: Element) {
  //   (el as HTMLElement).style.maxHeight = "none";
  // }
  // function beforeLeave(el: Element) {
  //   (el as HTMLElement).style.maxHeight = `${el.clientHeight}px`;
  // }
  // function leave(el: Element) {
  //   (el as HTMLElement).style.maxHeight = "0";
  // }
  // <Transition
  //   @before-enter="beforeEnter"
  //   @enter="enter"
  //   @leave="leave"
  //   @after-enter="afterEnter"
  //   @before-leave="beforeLeave"
  // >
  //   <Flex
  //     v-show="open"
  //     ref="body"
  //     vertical
  //     :class="[{ body: true, open }, sizeStyle, $props.bodyClass]"
  //   >
  //     <slot></slot> </Flex
  // ></Transition>

  function onClick() {
    const content = contentRef.value;
    if (!content) return;
    open.value = !open.value;
    emit("toggle", open.value);

    const keyframesOpen: Keyframe[] = [
      { maxHeight: `${content.clientHeight}px`, offset: 0 },
      { maxHeight: `${content.scrollHeight}px`, offset: 1 },
    ];
    const keyframesClose: Keyframe[] = [
      { maxHeight: `${content.clientHeight}px`, offset: 0 },
      { maxHeight: "0", offset: 1 },
    ];

    const animate = content.animate(open.value ? keyframesOpen : keyframesClose, {
      duration: 200,
      fill: "forwards",
    });
    animate.onfinish = function onfinish() {
      animate.cancel();
    };
  }
</script>

<template>
  <Flex vertical w-full class="ksd-collapse" :class="[$props.baseClass, componentStyles]">
    <Flex
      class="ksd-collapse__header"
      :class="[$props.headerClass, componentStyles]"
      :gap="12"
      flex-align="center"
      @click.stop="onClick"
    >
      <ArrowSmallIcon
        v-if="!$props.noArrow"
        :size="12"
        class="ksd-collapse__arrow"
        :class="{ open: open }"
      />
      <div v-if="$props.header" class="ksd-collapse__header-text" :class="componentStyles">
        {{ $props.header }}
      </div>
      <slot name="header"></slot>
    </Flex>
    <div ref="body" vertical class="ksd-collapse__body" :class="[{ open }, componentStyles]">
      <div :class="[$props.bodyClass, componentStyles]" class="ksd-collapse__body-box">
        <slot></slot>
      </div>
    </div>
  </Flex>
</template>

<style lang="scss">
  .ksd-collapse {
    border: 1px solid var(--ksd-border-color);
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
      font-size: 1rem;

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
      border-top: 1px solid var(--ksd-border-color);
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
