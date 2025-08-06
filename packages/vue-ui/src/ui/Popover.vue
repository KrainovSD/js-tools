<script setup lang="ts">
  import { computed, ref, useTemplateRef, watch, watchEffect } from "vue";
  import { createInteractiveChildrenController } from "../lib";
  import type { PopperProps, PopperTrigger } from "./Popper.vue";
  import Popper from "./Popper.vue";

  export type PopoverSize = "small" | "default" | "large";

  export type PopoverProps = {
    size?: PopoverSize;
  } & Pick<
    PopperProps,
    | "animationAppear"
    | "animationDisappear"
    | "arrow"
    | "classNamePositionerContent"
    | "closeByScroll"
    | "closeDelay"
    | "fit"
    | "ignoreElements"
    | "modalRoot"
    | "observe"
    | "openDelay"
    | "shiftX"
    | "shiftY"
    | "placement"
    | "zIndex"
    | "triggers"
    | "nested"
    | "closeByClickOutsideEvent"
  >;

  const props = withDefaults(defineProps<PopoverProps>(), {
    animationAppear: "scaleY",
    animationDisappear: "scaleY",
    placement: "bottom-left",
    triggers: (props) => props.triggers ?? ["click", "arrowDown"],
    fit: true,
    interactiveMode: "keyboard",
    size: "default",
  });
  const triggersKey = computed(() => props.triggers.join(";"));
  const triggersArray = computed(() => {
    return triggersKey.value.length === 0
      ? ([] as PopperTrigger[])
      : (triggersKey.value.split(";") as PopperTrigger[]);
  });
  const popperRef = useTemplateRef("popper");
  const positionerContentRef = computed(() => popperRef.value?.positioner?.contentElement);
  const lastActive = ref<HTMLElement | null>();
  const open = defineModel<boolean>();
  const popoverClasses = computed(() => `size-${props.size}`);

  watchEffect(() => {
    popperRef.value?.observedElement?.setAttribute?.("aria-haspopup", "true");
  });

  watch(
    positionerContentRef,
    (positionerContentRef, _, clean) => {
      if (!positionerContentRef) return;

      const eventController = new AbortController();
      lastActive.value = document.activeElement as HTMLElement | null;

      const interactiveChildrenController = createInteractiveChildrenController(
        positionerContentRef,
        {
          autofocus: true,
        },
      );
      positionerContentRef.tabIndex = 0;

      interactiveChildrenController.interactiveElements.forEach((element) => {
        element.addEventListener("blur", escapeHandler, { signal: eventController.signal });
      });

      positionerContentRef.addEventListener("keydown", actionKeyboard, {
        signal: eventController.signal,
      });

      function escapeHandler(event: FocusEvent) {
        if (event.relatedTarget == undefined) {
          positionerContentRef?.focus?.();
        }
      }

      function actionKeyboard(event: KeyboardEvent) {
        if (event.key === "Tab" && !event.shiftKey) {
          event.preventDefault();
          interactiveChildrenController.focusNext();
        } else if (event.key === "Tab" && event.shiftKey) {
          event.preventDefault();
          interactiveChildrenController.focusPrev();
        }
      }

      clean(() => {
        eventController.abort();
      });
    },
    { immediate: true },
  );

  defineExpose({ popper: popperRef });
</script>

<template>
  <Popper
    ref="popper"
    v-model="open"
    v-bind="$attrs"
    role="menu"
    :triggers="triggersArray"
    :animation-appear="$props.animationAppear"
    :animation-disappear="$props.animationDisappear"
    :arrow="$props.arrow"
    :close-by-scroll="$props.closeByScroll"
    :fit="$props.fit"
    :close-delay="$props.closeDelay"
    :ignore-elements="$props.ignoreElements"
    :modal-root="$props.modalRoot"
    :open-delay="$props.openDelay"
    :close-by-click-outside-event="$props.closeByClickOutsideEvent"
    :shift-x="$props.shiftX"
    :shift-y="$props.shiftY"
    :placement="$props.placement"
    :z-index="$props.zIndex"
    :nested="$props.nested"
    :class-name-positioner-content="`ksd-popover__positioner-content ${popoverClasses} ${$props.classNamePositionerContent ?? ''}`"
    :class="[$attrs.class, popoverClasses, 'ksd-popover__positioner']"
  >
    <slot></slot>
    <template #content>
      <slot name="content"></slot>
    </template>
  </Popper>
</template>

<style lang="scss">
  div.ksd-popover__positioner {
    z-index: var(--ksd-popover-z-index);
  }

  .ksd-popover {
    &__positioner-content {
      padding: var(--ksd-popover-inner-padding);
      gap: var(--ksd-popover-gap);

      &.size-small {
        padding: var(--ksd-popover-inner-padding-sm);
      }
      &.size-large {
        padding: var(--ksd-popover-inner-padding-lg);
      }

      &:focus-visible {
        outline: var(--ksd-outline-width) var(--ksd-outline-type) var(--ksd-outline-color);
        outline-offset: 1px;
        transition:
          outline-offset 0s,
          outline 0s;
      }
    }
  }
</style>
