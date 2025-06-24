<script setup lang="ts">
  import { VCloseOutlined } from "@krainovsd/vue-icons";
  import { computed, useTemplateRef, watchEffect } from "vue";
  import Button from "./Button.vue";
  import Flex from "./Flex.vue";
  import Text from "./Text.vue";

  export type DrawerProps = {
    ignoreCloseByClick?: HTMLElement[];
    target?: HTMLElement;
    header?: string;
    open?: boolean;
    zIndex?: number;
    placement?: "top" | "right" | "bottom" | "left";
    mask?: boolean;
    width?: number;
    height?: number;
    rootClassName?: string;
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
    rootClassName: undefined,
  });
  const emit = defineEmits<Emits>();
  const modalRefComponent = useTemplateRef("modal");
  const modalRefElement = computed(() => modalRefComponent.value?.element);
  const componentStyles = computed(() => ({ zIndex: props.zIndex }));
  const modalClasses = computed(() => ({
    [props.placement ?? "right"]: true,
  }));
  const modalStyles = computed(() => ({
    width:
      props.placement === "right" || props.placement === "left" ? `${props.width}px` : undefined,
    height:
      props.placement === "top" || props.placement === "bottom" ? `${props.height}px` : undefined,
  }));
  const modalMode = computed(() => props.mask || props.mask == undefined);

  watchEffect((onCleanup) => {
    if (!props.open || !modalRefElement.value) return;

    const controller = new AbortController();
    const previousActiveElement = document.activeElement as HTMLElement | null;

    function onClose() {
      emit("close");
      if (modalMode.value && previousActiveElement) {
        previousActiveElement.focus();
      }
    }

    function closeByClickOutside(event: MouseEvent | TouchEvent) {
      const node = event.target as Node;

      if (
        modalRefElement.value?.contains?.(node) ||
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

    const focusableElements = modalRefElement.value.querySelectorAll(
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

        modalRefElement.value.addEventListener("keydown", focusTrap, { signal: controller.signal });
      }
    }

    document.addEventListener("mousedown", closeByClickOutside, { signal: controller.signal });
    document.addEventListener("touchstart", closeByClickOutside, { signal: controller.signal });
    document.addEventListener("pointerdown", closeByClickOutside, { signal: controller.signal });
    document.addEventListener("keydown", closeByEscape, { signal: controller.signal });

    onCleanup(() => {
      controller.abort();
    });
  });
</script>

<template>
  <Teleport :to="$props.target ?? 'body'">
    <Flex class="ksd-drawer" :class="$props.rootClassName" :style="componentStyles">
      <Transition name="ksd-drawer-fade">
        <Flex
          v-if="$props.open && modalMode"
          class="ksd-drawer__mask"
          :style="componentStyles"
        ></Flex>
      </Transition>
      <Transition :name="`ksd-drawer-slide-${props.placement}`">
        <Flex
          v-if="$props.open"
          ref="modal"
          class="ksd-drawer__base"
          :style="[componentStyles, modalStyles]"
          :class="[modalClasses, $attrs.class, $attrs.style]"
          role="dialog"
          aria-modal="true"
          vertical
        >
          <slot v-if="$slots['custom-header']" name="custom-header"></slot>
          <Flex v-if="!$slots['custom-header']" flex-align="center" class="ksd-drawer__header">
            <Button
              type="text"
              size="small"
              class="ksd-drawer__header-close"
              @click="$emit('close')"
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
      </Transition>
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

  .ksd-drawer-slide-right-enter-active,
  .ksd-drawer-slide-right-leave-active {
    transition: transform 0.3s cubic-bezier(0.7, 0.3, 0.1, 1);
  }

  .ksd-drawer-slide-right-enter-from,
  .ksd-drawer-slide-right-leave-to {
    transform: translateX(100%);
  }
  .ksd-drawer-slide-left-enter-active,
  .ksd-drawer-slide-left-leave-active {
    transition: transform 0.3s cubic-bezier(0.7, 0.3, 0.1, 1);
  }

  .ksd-drawer-slide-left-enter-from,
  .ksd-drawer-slide-left-leave-to {
    transform: translateX(-100%);
  }
  .ksd-drawer-slide-top-enter-active,
  .ksd-drawer-slide-top-leave-active {
    transition: transform 0.3s cubic-bezier(0.7, 0.3, 0.1, 1);
  }

  .ksd-drawer-slide-top-enter-from,
  .ksd-drawer-slide-top-leave-to {
    transform: translateY(-100%);
  }
  .ksd-drawer-slide-bottom-enter-active,
  .ksd-drawer-slide-bottom-leave-active {
    transition: transform 0.3s cubic-bezier(0.7, 0.3, 0.1, 1);
  }

  .ksd-drawer-slide-bottom-enter-from,
  .ksd-drawer-slide-bottom-leave-to {
    transform: translateY(100%);
  }
  .ksd-drawer-fade-enter-active,
  .ksd-drawer-fade-leave-active {
    transition: opacity 0.3s cubic-bezier(0.7, 0.3, 0.1, 1);
  }

  .ksd-drawer-fade-enter-from,
  .ksd-drawer-fade-leave-to {
    opacity: 0;
  }
</style>
