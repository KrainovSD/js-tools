<script setup lang="ts">
  import { type PositionPlacements, startWith } from "@krainovsd/js-helpers";
  import { computed, ref, shallowRef, useTemplateRef, watchEffect } from "vue";
  import Positioner, { type PositionerTargetNodePosition } from "./Positioner.vue";

  export type TooltipProps = {
    show?: undefined | boolean;
    text: string | number;
    openByFocus?: boolean;
    openByHover?: boolean;
    openByClick?: boolean;
    openNotVisible?: boolean;
    openAboveCursor?: boolean;
    stickyCursor?: boolean;
    observe?: boolean;
    openDelay?: number;
    closeDelay?: number;
    zIndex?: number;
    placement?: Exclude<PositionPlacements, "flex">;
    modalRoot?: string | HTMLElement | null;
    animationAppear?: boolean;
    animationDisappear?: boolean;
    visibleArea?: HTMLElement;
  };

  defineOptions({
    inheritAttrs: false,
  });

  const props = withDefaults(defineProps<TooltipProps>(), {
    show: undefined,
    openDelay: 100,
    closeDelay: 0,
    modalRoot: undefined,
    observe: false,
    openAboveCursor: false,
    openByClick: false,
    openByFocus: false,
    openByHover: true,
    openNotVisible: false,
    placement: "bottom-center",
    stickyCursor: false,
    zIndex: undefined,
    animationAppear: true,
    animationDisappear: true,
    visibleArea: undefined,
  });
  const elementRef = useTemplateRef("tooltip");
  const positionerRef = useTemplateRef("positioner");
  const content = computed(() => elementRef.value?.nextElementSibling as HTMLElement | undefined);
  const shiftY = computed(() =>
    props.placement
      ? startWith(props.placement, "top")
        ? 16
        : startWith(props.placement, "bottom")
          ? 16
          : 0
      : 16,
  );
  const shiftX = computed(() =>
    props.placement
      ? startWith(props.placement, "left")
        ? 16
        : startWith(props.placement, "right")
          ? 16
          : 0
      : 0,
  );

  const localOpen = ref(false);
  const openTimer = ref<NodeJS.Timeout | null>(null);
  const closeTimer = ref<NodeJS.Timeout | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-redundant-type-constituents
  const cursorPosition = shallowRef<PositionerTargetNodePosition | null>(null);
  const open = computed(() => props.show ?? localOpen.value);

  watchEffect((clean) => {
    if (!content.value) return;

    const eventController = new AbortController();

    function getPlacement(event: MouseEvent | FocusEvent) {
      const target = event.target as HTMLElement;

      if (props.openNotVisible) {
        if (target.scrollWidth <= target.clientWidth && target.scrollHeight <= target.clientHeight)
          return;
      }
      if ((props.openAboveCursor || props.stickyCursor) && "clientX" in event) {
        const { x, y, height, width } = target.getBoundingClientRect();

        const orientation = props.placement
          ? startWith(props.placement, "bottom") || startWith(props.placement, "top")
            ? "y"
            : "x"
          : "y";

        cursorPosition.value = {
          width: orientation === "x" ? width : 1,
          height: orientation === "y" ? height : 1,
          x: orientation === "x" ? x : event.clientX,
          y: orientation === "y" ? y : event.clientY,
        };
      }

      localOpen.value = true;
    }

    function onAppear(event: MouseEvent | FocusEvent) {
      if (closeTimer.value != undefined) {
        clearTimeout(closeTimer.value);
      }

      openTimer.value = setTimeout(() => {
        getPlacement(event);
      }, props.openDelay);
    }

    function onDisAppear() {
      if (openTimer.value) {
        clearTimeout(openTimer.value);
      }

      closeTimer.value = setTimeout(() => {
        localOpen.value = false;
      }, props.closeDelay);
    }

    if (props.openByHover == undefined || props.openByHover) {
      content.value.addEventListener("mouseenter", onAppear, { signal: eventController.signal });
      content.value.addEventListener("mouseleave", onDisAppear, { signal: eventController.signal });
      if (props.stickyCursor) {
        content.value.addEventListener("mousemove", getPlacement, {
          signal: eventController.signal,
        });
      }
    }
    if (props.openByFocus) {
      content.value.addEventListener("focus", onAppear, { signal: eventController.signal });
      content.value.addEventListener("blur", onDisAppear, { signal: eventController.signal });
    }

    const observer = new MutationObserver((mutations) => {
      mutations.forEach(() => {
        positionerRef.value?.updatePosition?.();
      });
    });

    if (props.observe) {
      observer.observe(content.value, {
        subtree: false,
        attributes: true,
        attributeFilter: ["style", "class"],
      });
    }

    clean(() => {
      eventController.abort();
      observer.disconnect();
    });
  });
</script>

<template>
  <span ref="tooltip" class="ksd-tooltip" aria-hidden="true" tabindex="-1"></span>
  <slot ref="slot"></slot>
  <Positioner
    ref="positioner"
    :open="open"
    arrow
    :target="cursorPosition != undefined ? cursorPosition : content"
    class-content="ksd-tooltip__positioner-content"
    :class="'ksd-tooltip__positioner'"
    v-bind="$attrs"
    :modal-root="$props.modalRoot"
    :placement="$props.placement"
    :shift-x="shiftX"
    :shift-y="shiftY"
    :z-index="$props.zIndex"
    :animation-appear="$props.animationAppear ? 'translate' : undefined"
    :animation-disappear="$props.animationDisappear ? 'translate' : undefined"
    :visible-area="$props.visibleArea"
    >{{ $props.text }}</Positioner
  >
</template>

<style lang="scss">
  .ksd-tooltip {
    width: 1px;
    height: 1px;
    clip-path: inset(50%);
    overflow: hidden;
    position: absolute;
    white-space: nowrap;

    &__positioner {
      border-radius: var(--ksd-border-radius);
    }

    &__positioner-content {
      border-radius: var(--ksd-border-radius);
      background-color: var(--ksd-bg-reverse-color);
      color: var(--ksd-text-reverse-color);
      padding: calc(var(--ksd-padding-sm) / 2) var(--ksd-padding-xs);
      word-break: break-word;
      max-width: 250px;
      overflow: hidden;
      max-height: 350px;
      min-width: calc(var(--ksd-border-radius) * 2 + 32px);
      min-height: var(--ksd-control-height);
    }
  }
</style>
