<script setup lang="ts">
  import { execAnimation } from "@krainovsd/js-helpers";
  import { VCloseOutlined } from "@krainovsd/vue-icons";
  import { computed, ref, useSlots, useTemplateRef, watch } from "vue";
  import { DEFAULT_CLOSE_BY_CLICK_OUTSIDE_EVENT, POPPER_SELECTOR } from "../constants/tech";
  import { createInteractiveChildrenController, getWatchedNode } from "../lib";
  import type { CloseByClickOutsideEvent } from "../types";
  import Button from "./Button.vue";
  import Flex from "./Flex.vue";
  import Text from "./Text.vue";

  export type DrawerPlacement = "top" | "right" | "bottom" | "left";
  export type DrawerProps = {
    ignoreCloseByClick?: HTMLElement[];
    target?: HTMLElement;
    autofocus?: boolean;
    header?: string;
    zIndex?: number;
    placement?: DrawerPlacement;
    mask?: boolean;
    block?: boolean;
    width?: number;
    height?: number;
    classNameRoot?: string;
    classNameBody?: string;
    classNameHeader?: string;
    closeByClickOutsideEvent?: CloseByClickOutsideEvent;
    closeByClickOutside?: boolean;
    closeByEscape?: boolean;
  };
  type Emits = {
    close: [];
  };
  const props = withDefaults(defineProps<DrawerProps>(), {
    mask: true,
    placement: "right",
    open: false,
    zIndex: undefined,
    header: undefined,
    ignoreCloseByClick: undefined,
    target: undefined,
    width: 378,
    height: 378,
    classNameRoot: undefined,
    block: false,
    closeByClickOutside: true,
    closeByEscape: true,
    closeByClickOutsideEvent: DEFAULT_CLOSE_BY_CLICK_OUTSIDE_EVENT,
    classNameBody: undefined,
    classNameHeader: undefined,
    autofocus: true,
  });
  const emit = defineEmits<Emits>();
  const open = defineModel<boolean>();
  const localOpen = ref(false);
  const drawerGhostRef = useTemplateRef("drawer-ghost");
  const targetNode = computed(() => getWatchedNode(drawerGhostRef.value));
  const slots = useSlots();
  const drawerComponentRef = useTemplateRef("drawer");
  const maskComponentRef = useTemplateRef("mask");
  const drawerRef = computed(() => drawerComponentRef.value?.element);
  const maskRef = computed(() => maskComponentRef.value?.element);
  const commonStyles = computed(() => ({ zIndex: props.zIndex }));
  const commonClasses = computed(() => ({
    [props.placement]: true,
    block: props.block,
  }));
  const drawerStyles = computed(() => ({
    "--drawer-width":
      props.placement === "right" || props.placement === "left" ? `${props.width}px` : undefined,
    "--drawer-height":
      props.placement === "top" || props.placement === "bottom" ? `${props.height}px` : undefined,
  }));
  const modalMode = computed(() => (props.mask || props.mask == undefined) && !props.block);
  const prevActiveElement = ref<HTMLElement | null>(null);

  async function onClose() {
    if (prevActiveElement.value && modalMode.value) {
      prevActiveElement.value.focus();
    }

    const animationPromises = [execAnimation(drawerRef.value, "out")];
    if (modalMode.value) {
      animationPromises.push(execAnimation(maskRef.value, "out"));
    }

    await Promise.all(animationPromises);

    if (!open.value) {
      localOpen.value = false;
    }
  }
  async function close() {
    open.value = false;

    return onClose();
  }

  /** register listeners after open */
  watch(
    drawerRef,
    (drawerRef, _, clean) => {
      if (!drawerRef) return;

      const controller = new AbortController();
      prevActiveElement.value = document.activeElement as HTMLElement | null;

      function closeByClickOutside(event: MouseEvent | TouchEvent) {
        const node = event.target as HTMLElement;
        if (node.closest(POPPER_SELECTOR)) {
          return;
        }

        if (
          drawerRef?.contains?.(node) ||
          targetNode.value?.contains?.(node) ||
          props.ignoreCloseByClick?.some?.((element) => element?.contains?.(node))
        )
          return;

        open.value = false;
      }

      function closeByEscape(event: KeyboardEvent) {
        if (event.key === "Escape") {
          open.value = false;
        }
      }

      const interactiveChildrenController = createInteractiveChildrenController(drawerRef, {
        autofocus: props.autofocus,
      });

      if (modalMode.value) {
        function focusTrap(event: KeyboardEvent) {
          if (event.key !== "Tab") return;

          event.preventDefault();

          if (event.shiftKey) {
            interactiveChildrenController.focusPrev();
          } else {
            interactiveChildrenController.focusNext();
          }
        }

        drawerRef.addEventListener("keydown", focusTrap, { signal: controller.signal });
      }

      if (props.closeByClickOutside) {
        document.addEventListener(props.closeByClickOutsideEvent, closeByClickOutside, {
          signal: controller.signal,
        });
      }
      if (props.closeByEscape) {
        document.addEventListener("keydown", closeByEscape, { signal: controller.signal });
      }

      clean(() => {
        controller.abort();
      });
    },
    { immediate: true },
  );
  /** observe slot for click */
  watch(
    targetNode,
    (targetNode, _, clean) => {
      if (!targetNode || !slots.default) return;

      function toggleDrawer() {
        if (!open.value) {
          open.value = true;
        } else {
          open.value = false;
        }
      }

      targetNode.addEventListener("click", toggleDrawer);

      clean(() => {
        targetNode.removeEventListener("click", toggleDrawer);
      });
    },
    { immediate: true },
  );
  /** toggle local open state */
  watch(
    open,
    (open) => {
      if (open) {
        localOpen.value = true;
      } else {
        void onClose();
        emit("close");
      }
    },
    { immediate: true },
  );
  /** animation by open */
  watch(
    drawerRef,
    (drawer) => {
      if (drawer) {
        void execAnimation(drawer, "in");
      }
    },
    { immediate: true, flush: "pre" },
  );
  watch(
    maskRef,
    (mask) => {
      if (mask) {
        void execAnimation(mask, "in");
      }
    },
    { immediate: true, flush: "pre" },
  );

  defineExpose({ element: drawerRef, maskElement: maskRef, close });
  defineOptions({
    inheritAttrs: false,
  });
</script>

<template>
  <span
    ref="drawer-ghost"
    class="ksd-drawer__ghost"
    aria-hidden="true"
    tabindex="-1"
    ksd-watcher="true"
  ></span>
  <slot></slot>
  <Teleport v-if="localOpen && !props.block" :to="$props.target ?? 'body'">
    <Flex class="ksd-drawer" :class="[$props.classNameRoot]" :style="commonStyles">
      <Flex v-if="modalMode" ref="mask" class="ksd-drawer__mask" :style="commonStyles"></Flex>
      <Flex
        ref="drawer"
        v-bind="$attrs"
        class="ksd-drawer__base"
        :style="[commonStyles, drawerStyles]"
        :class="[commonClasses, $attrs.class, $attrs.style]"
        role="dialog"
        aria-modal="true"
        vertical
      >
        <slot v-if="$slots['custom-header']" name="custom-header"></slot>
        <Flex
          v-if="!$slots['custom-header']"
          flex-align="center"
          class="ksd-drawer__header"
          :class="$props.classNameHeader"
        >
          <Button type="text" size="small" class="ksd-drawer__header-close" @click="open = false"
            ><template #icon> <VCloseOutlined :size="16" /> </template>
          </Button>
          <Text v-if="$props.header" size="large" class="ksd-drawer__header-text">{{
            $props.header
          }}</Text>
          <slot v-if="$slots.header" name="header"></slot>
        </Flex>
        <slot v-if="$slots.body" name="body"></slot>
        <Flex v-if="!$slots.body" class="ksd-drawer__body" :class="$props.classNameBody">
          <slot name="content"></slot>
        </Flex>
      </Flex>
    </Flex>
  </Teleport>
  <Teleport v-if="localOpen && props.block" :to="$props.target ?? 'body'">
    <Flex
      ref="drawer"
      v-bind="$attrs"
      class="ksd-drawer__block-wrapper"
      :style="[commonStyles, drawerStyles]"
      :class="[commonClasses, $props.classNameRoot]"
      role="dialog"
      aria-modal="true"
      vertical
    >
      <div class="ksd-drawer__block">
        <slot v-if="$slots['custom-header']" name="custom-header"></slot>
        <Flex
          v-if="!$slots['custom-header']"
          flex-align="center"
          class="ksd-drawer__header"
          :class="$props.classNameHeader"
        >
          <Button type="text" size="small" class="ksd-drawer__header-close" @click="open = false"
            ><template #icon> <VCloseOutlined :size="16" /> </template>
          </Button>
          <Text v-if="$props.header" size="large" class="ksd-drawer__header-text">{{
            $props.header
          }}</Text>
          <slot v-if="$slots.header" name="header"></slot>
        </Flex>
        <slot v-if="$slots.body" name="body"></slot>
        <Flex v-if="!$slots.body" class="ksd-drawer__body" :class="$props.classNameBody">
          <slot name="content"></slot>
        </Flex>
      </div>
    </Flex>
  </Teleport>
</template>

<style lang="scss">
  .ksd-drawer {
    width: 100%;
    height: 100%;
    position: fixed;
    inset: 0;
    pointer-events: none;
    z-index: var(--ksd-modal-z-index);

    &__ghost {
      width: 1px;
      height: 1px;
      clip-path: inset(50%);
      overflow: hidden;
      position: absolute;
      white-space: nowrap;
    }

    &__mask {
      position: absolute;
      inset: 0;
      background-color: var(--ksd-bg-mask-color);
      pointer-events: auto;
      &.in {
        animation: ksd-drawer-mask-in var(--ksd-transition-slow) cubic-bezier(0.7, 0.3, 0.1, 1);
      }
      &.out {
        animation: ksd-drawer-mask-out var(--ksd-transition-slow) cubic-bezier(0.7, 0.3, 0.1, 1);
      }
    }

    &__base {
      position: absolute;
      background: var(--ksd-bg-modal-color);
      pointer-events: auto;
      width: var(--drawer-width);
      height: var(--drawer-height);

      &.left {
        top: 0;
        left: 0;
        bottom: 0;
        box-shadow: var(--ksd-shadow-left);
      }
      &.right {
        top: 0;
        right: 0;
        bottom: 0;
        box-shadow: var(--ksd-shadow-right);
      }
      &.top {
        top: 0;
        inset-inline: 0;
        box-shadow: var(--ksd-shadow-top);
      }
      &.bottom {
        bottom: 0;
        inset-inline: 0;
        box-shadow: var(--ksd-shadow-bottom);
      }

      &.right {
        &.in {
          animation: ksd-drawer-right-in var(--ksd-transition-slow) cubic-bezier(0.7, 0.3, 0.1, 1);
        }
        &.out {
          animation: ksd-drawer-right-out var(--ksd-transition-slow) cubic-bezier(0.7, 0.3, 0.1, 1);
        }
      }
      &.top {
        &.in {
          animation: ksd-drawer-top-in var(--ksd-transition-slow) cubic-bezier(0.7, 0.3, 0.1, 1);
        }

        &.out {
          animation: ksd-drawer-top-out var(--ksd-transition-slow) cubic-bezier(0.7, 0.3, 0.1, 1);
        }
      }
      &.left {
        &.in {
          animation: ksd-drawer-left-in var(--ksd-transition-slow) cubic-bezier(0.7, 0.3, 0.1, 1);
        }

        &.out {
          animation: ksd-drawer-left-out var(--ksd-transition-slow) cubic-bezier(0.7, 0.3, 0.1, 1);
        }
      }
      &.bottom {
        &.in {
          animation: ksd-drawer-bottom-in var(--ksd-transition-slow) cubic-bezier(0.7, 0.3, 0.1, 1);
        }

        &.out {
          animation: ksd-drawer-bottom-out var(--ksd-transition-slow) cubic-bezier(0.7, 0.3, 0.1, 1);
        }
      }

      @keyframes ksd-drawer-right-in {
        from {
          transform: translateX(100%);
        }
        to {
          transform: translateX(0%);
        }
      }
      @keyframes ksd-drawer-right-out {
        from {
          transform: translateX(0%);
        }
        to {
          transform: translateX(100%);
        }
      }
      @keyframes ksd-drawer-left-in {
        from {
          transform: translateX(-100%);
        }
        to {
          transform: translateX(0%);
        }
      }
      @keyframes ksd-drawer-left-out {
        from {
          transform: translateX(0%);
        }
        to {
          transform: translateX(-100%);
        }
      }
      @keyframes ksd-drawer-top-in {
        from {
          transform: translateY(-100%);
        }
        to {
          transform: translateY(0%);
        }
      }
      @keyframes ksd-drawer-top-out {
        from {
          transform: translateY(0%);
        }
        to {
          transform: translateY(-100%);
        }
      }
      @keyframes ksd-drawer-bottom-in {
        from {
          transform: translateY(100%);
        }
        to {
          transform: translateY(0%);
        }
      }
      @keyframes ksd-drawer-bottom-out {
        from {
          transform: translateY(0%);
        }
        to {
          transform: translateY(100%);
        }
      }
    }

    &__block-wrapper {
      background: var(--ksd-bg-modal-color);
      width: var(--drawer-width);
      height: var(--drawer-height);
      overflow: hidden;

      &.left {
        box-shadow: var(--ksd-shadow-left);
      }
      &.right {
        box-shadow: var(--ksd-shadow-right);
      }
      &.top {
        box-shadow: var(--ksd-shadow-top);
      }
      &.bottom {
        box-shadow: var(--ksd-shadow-bottom);
      }

      &.right {
        &.in {
          transform-origin: right;
          animation: ksd-drawer-right-in-block var(--ksd-transition-slow)
            cubic-bezier(0.7, 0.3, 0.1, 1);
        }
        &.out {
          transform-origin: right;
          animation: ksd-drawer-right-out-block var(--ksd-transition-slow)
            cubic-bezier(0.7, 0.3, 0.1, 1);
        }
      }
      &.top {
        &.in {
          transform-origin: bottom;
          animation: ksd-drawer-bottom-in-block var(--ksd-transition-slow)
            cubic-bezier(0.7, 0.3, 0.1, 1);
        }
        &.out {
          transform-origin: bottom;
          animation: ksd-drawer-bottom-out-block var(--ksd-transition-slow)
            cubic-bezier(0.7, 0.3, 0.1, 1);
        }
      }
      &.left {
        &.in {
          transform-origin: right;
          animation: ksd-drawer-right-in-block var(--ksd-transition-slow)
            cubic-bezier(0.7, 0.3, 0.1, 1);
        }
        &.out {
          transform-origin: right;
          animation: ksd-drawer-right-out-block var(--ksd-transition-slow)
            cubic-bezier(0.7, 0.3, 0.1, 1);
        }
      }
      &.bottom {
        &.in {
          transform-origin: bottom;
          animation: ksd-drawer-bottom-in-block var(--ksd-transition-slow)
            cubic-bezier(0.7, 0.3, 0.1, 1);
        }
        &.out {
          transform-origin: bottom;
          animation: ksd-drawer-bottom-out-block var(--ksd-transition-slow)
            cubic-bezier(0.7, 0.3, 0.1, 1);
        }
      }

      @keyframes ksd-drawer-right-in-block {
        0% {
          width: 0px;
          transform: scaleX(0);
        }
        30% {
          width: var(--drawer-width);
        }
        100% {
          transform: scaleX(1);
        }
      }
      @keyframes ksd-drawer-right-out-block {
        from {
          width: var(--drawer-width);
        }
        to {
          width: 0;
        }
      }
      @keyframes ksd-drawer-bottom-in-block {
        0% {
          height: 0px;
          transform: scaleY(0);
        }
        30% {
          height: var(--drawer-height);
        }
        100% {
          transform: scaleY(1);
        }
      }
      @keyframes ksd-drawer-bottom-out-block {
        from {
          height: var(--drawer-height);
        }
        to {
          height: 0;
        }
      }
    }
    &__block {
      display: flex;
      flex-direction: column;
      width: var(--drawer-width);
      height: var(--drawer-height);
      overflow: visible;
    }

    &__header {
      font-size: var(--ksd-font-size-lg);
      font-family: var(--ksd-font-family);
      line-height: var(--ksd-line-height);
      border-bottom: var(--ksd-line-width) var(--ksd-line-type) var(--ksd-divider-color);
      padding: var(--ksd-padding) var(--ksd-padding-lg);
    }

    &__header-close {
      margin-inline-end: var(--ksd-margin-xs);
    }

    &__header-text {
      flex: 1;
    }

    &__body {
      padding: var(--ksd-padding-lg);
      flex: 1;
      min-width: 0;
      min-height: 0;
    }
  }

  @keyframes ksd-drawer-mask-in {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
  @keyframes ksd-drawer-mask-out {
    from {
      opacity: 1;
    }
    to {
      opacity: 0;
    }
  }
</style>
