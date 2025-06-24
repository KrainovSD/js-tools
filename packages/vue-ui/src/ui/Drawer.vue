<script setup lang="ts">
  import { VCloseOutlined } from "@krainovsd/vue-icons";
  import { computed, ref, useTemplateRef, watch } from "vue";
  import { execAnimation } from "../lib";
  import Button from "./Button.vue";
  import Flex from "./Flex.vue";
  import Text from "./Text.vue";

  export type DrawerPlacement = "top" | "right" | "bottom" | "left";
  export type DrawerProps = {
    ignoreCloseByClick?: HTMLElement[];
    target?: HTMLElement;
    header?: string;
    zIndex?: number;
    placement?: DrawerPlacement;
    mask?: boolean;
    width?: number;
    height?: number;
    classNameRoot?: string;
  };
  type Emits = {
    close: [];
  };
  const props = withDefaults(defineProps<DrawerProps>(), {
    mask: true,
    placement: "right",
    open: false,
    zIndex: 1000,
    header: undefined,
    ignoreCloseByClick: undefined,
    target: undefined,
    width: 378,
    height: 378,
    classNameRoot: undefined,
  });
  const emit = defineEmits<Emits>();
  const open = defineModel<boolean>();
  const drawerComponentRef = useTemplateRef("drawer");
  const maskComponentRef = useTemplateRef("mask");
  const drawerRef = computed(() => drawerComponentRef.value?.element);
  const maskRef = computed(() => maskComponentRef.value?.element);
  const commonStyles = computed(() => ({ zIndex: props.zIndex }));
  const commonClasses = computed(() => ({
    [props.placement]: true,
  }));
  const drawerStyles = computed(() => ({
    width:
      props.placement === "right" || props.placement === "left" ? `${props.width}px` : undefined,
    height:
      props.placement === "top" || props.placement === "bottom" ? `${props.height}px` : undefined,
  }));
  const modalMode = computed(() => props.mask || props.mask == undefined);
  const prevActiveElement = ref<HTMLElement | null>(null);

  function onClose() {
    if (prevActiveElement.value && modalMode.value) {
      prevActiveElement.value.focus();
    }

    const animationPromises = [execAnimation(drawerRef.value, "out")];
    if (modalMode.value) {
      animationPromises.push(execAnimation(maskRef.value, "out"));
    }

    void Promise.all(animationPromises).then(() => {
      open.value = false;
      emit("close");
    });
  }

  watch(
    drawerRef,
    (drawerRef, _, clean) => {
      if (!drawerRef) return;

      const controller = new AbortController();
      prevActiveElement.value = document.activeElement as HTMLElement | null;

      function closeByClickOutside(event: MouseEvent | TouchEvent) {
        const node = event.target as Node;

        if (
          drawerRef?.contains?.(node) ||
          props.ignoreCloseByClick?.some?.((element) => element?.contains?.(node))
        )
          return;

        onClose();
      }

      function closeByEscape(event: KeyboardEvent) {
        if (event.key === "Escape") {
          onClose();
        }
      }

      const focusableElements = drawerRef.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
      );
      const firstFocusable = focusableElements.item(0) as HTMLElement | null;

      if (firstFocusable) {
        firstFocusable.focus();
      }

      if (modalMode.value) {
        let focusableIndex = 0;

        if (focusableElements.length !== 0) {
          function focusTrap(event: KeyboardEvent) {
            if (event.key !== "Tab") return;

            event.preventDefault();

            if (event.shiftKey) {
              focusableIndex--;
            } else {
              focusableIndex++;
            }

            if (focusableIndex < 0) {
              focusableIndex = focusableElements.length - 1;
            } else if (focusableIndex >= focusableElements.length) {
              focusableIndex = 0;
            }

            const element = focusableElements.item(focusableIndex) as HTMLElement;
            element.focus();
          }

          drawerRef.addEventListener("keydown", focusTrap, { signal: controller.signal });
        }
      }

      document.addEventListener("mousedown", closeByClickOutside, { signal: controller.signal });
      document.addEventListener("touchstart", closeByClickOutside, { signal: controller.signal });
      document.addEventListener("pointerdown", closeByClickOutside, { signal: controller.signal });
      drawerRef.addEventListener("keydown", closeByEscape, { signal: controller.signal });

      clean(() => {
        controller.abort();
      });
    },
    { immediate: true },
  );

  defineExpose({ drawerRef, maskRef });
</script>

<template>
  <Teleport v-if="open" :to="$props.target ?? 'body'">
    <Flex class="ksd-drawer" :class="$props.classNameRoot" :style="commonStyles">
      <Flex v-if="modalMode" ref="mask" class="ksd-drawer__mask" :style="commonStyles"></Flex>
      <Flex
        ref="drawer"
        class="ksd-drawer__base"
        :style="[commonStyles, drawerStyles]"
        :class="[commonClasses, $attrs.class, $attrs.style]"
        role="dialog"
        aria-modal="true"
        vertical
      >
        <slot v-if="$slots['custom-header']" name="custom-header"></slot>
        <Flex v-if="!$slots['custom-header']" flex-align="center" class="ksd-drawer__header">
          <Button type="text" size="small" class="ksd-drawer__header-close" @click="onClose"
            ><template #icon> <VCloseOutlined :size="16" /> </template>
          </Button>
          <Text v-if="$props.header" size="lg" class="ksd-drawer__header-text">{{
            $props.header
          }}</Text>
          <slot v-if="$slots.header" name="header"></slot>
        </Flex>
        <slot v-if="$slots.body" name="body"></slot>
        <Flex v-if="!$slots.body" class="ksd-drawer__body">
          <slot></slot>
        </Flex>
      </Flex>
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

    &__mask {
      position: absolute;
      inset: 0;
      background-color: var(--ksd-bg-mask-color);
      pointer-events: auto;
      animation: ksd-drawer-mask-in var(--ksd-transition-slow) cubic-bezier(0.7, 0.3, 0.1, 1);
      &.out {
        animation: ksd-drawer-mask-out var(--ksd-transition-slow) cubic-bezier(0.7, 0.3, 0.1, 1);
      }
    }

    &__base {
      position: absolute;
      background: var(--ksd-bg-modal-color);
      pointer-events: auto;

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
        animation: ksd-drawer-right-in var(--ksd-transition-slow) cubic-bezier(0.7, 0.3, 0.1, 1);

        &.out {
          animation: ksd-drawer-right-out var(--ksd-transition-slow) cubic-bezier(0.7, 0.3, 0.1, 1);
        }
      }
      &.top {
        animation: ksd-drawer-top-in var(--ksd-transition-slow) cubic-bezier(0.7, 0.3, 0.1, 1);
        &.out {
          animation: ksd-drawer-top-out var(--ksd-transition-slow) cubic-bezier(0.7, 0.3, 0.1, 1);
        }
      }
      &.left {
        animation: ksd-drawer-left-in var(--ksd-transition-slow) cubic-bezier(0.7, 0.3, 0.1, 1);
        &.out {
          animation: ksd-drawer-left-out var(--ksd-transition-slow) cubic-bezier(0.7, 0.3, 0.1, 1);
        }
      }
      &.bottom {
        animation: ksd-drawer-bottom-in var(--ksd-transition-slow) cubic-bezier(0.7, 0.3, 0.1, 1);
        &.out {
          animation: ksd-drawer-bottom-out var(--ksd-transition-slow) cubic-bezier(0.7, 0.3, 0.1, 1);
        }
      }
    }

    &__header {
      font-size: var(--ksd-font-size-lg);
      font-family: var(--ksd-font-family);
      line-height: var(--ksd-line-height);
      border-bottom: var(--ksd-line-width) var(--ksd-line-type) var(--ksd-border-split-color);
      padding: var(--ksd-padding) var(--ksd-padding-lg);
    }

    &__header-close {
      margin-inline-end: var(--ksd-margin-xs);
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
</style>
