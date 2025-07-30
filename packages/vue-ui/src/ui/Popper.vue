<script setup lang="ts">
  import { type PositionPlacements, isString } from "@krainovsd/js-helpers";
  import { computed, ref, useTemplateRef, watchEffect } from "vue";
  import { DEFAULT_CLOSE_BY_CLICK_OUTSIDE_EVENT, POPPER_SELECTOR } from "../constants/tech";
  import { getWatchedNode } from "../lib";
  import type { CloseByClickOutsideEvent } from "../types";
  import Positioner, { type PositionerAnimations } from "./Positioner.vue";

  export type PopperTrigger = "click" | "hover" | "contextMenu" | "arrowDown";

  export type PopperProps = {
    arrow?: boolean;
    openDelay?: number;
    hoverDelay?: number;
    classNamePositionerContent?: string;
    classNamePositionerArrow?: string;
    closeDelay?: number;
    zIndex?: number;
    placement?: Exclude<PositionPlacements, "flex">;
    modalRoot?: string | HTMLElement | null;
    shiftX?: number;
    shiftY?: number;
    animationAppear?: PositionerAnimations;
    animationDisappear?: PositionerAnimations;
    triggers?: PopperTrigger[];
    closeByScroll?: boolean;
    observe?: boolean;
    ignoreElements?: (string | HTMLElement | null | undefined)[];
    fit?: boolean;
    nested?: boolean;
    closeByClickOutsideEvent?: CloseByClickOutsideEvent;
  };

  const props = withDefaults(defineProps<PopperProps>(), {
    animationAppear: "scaleY",
    animationDisappear: "scaleY",
    arrow: false,
    observe: false,
    classNamePositionerContent: undefined,
    classNamePositionerArrow: undefined,
    closeDelay: 0,
    openDelay: 100,
    hoverDelay: 0,
    modalRoot: undefined,
    placement: "bottom-left",
    shiftX: undefined,
    shiftY: undefined,
    zIndex: undefined,
    closeByScroll: false,
    triggers: (props) => props.triggers ?? ["click"],
    ignoreElements: undefined,
    fit: true,
    nested: false,
    closeByClickOutsideEvent: DEFAULT_CLOSE_BY_CLICK_OUTSIDE_EVENT,
  });
  const open = defineModel<boolean>();
  const popperRef = useTemplateRef("popper");
  const positionerComponentRef = useTemplateRef("positioner");
  const triggersKey = computed(() => props.triggers.join(";"));
  // eslint-disable-next-line vue/no-dupe-keys
  const triggers = computed(() => {
    return triggersKey.value.length === 0
      ? ([] as PopperTrigger[])
      : (triggersKey.value.split(";") as PopperTrigger[]);
  });
  const targetNode = computed(() => getWatchedNode(popperRef.value));
  const targetNodeWidth = ref(0);
  const firstPlacement = computed(() => props.placement.split("-")[0]);
  const lastActive = ref<HTMLElement | null>();
  const checkedModalRoot = computed(() =>
    props.nested && props.modalRoot == undefined
      ? popperRef.value?.closest?.<HTMLElement>(POPPER_SELECTOR)
      : props.modalRoot,
  );

  const shiftY = computed(
    () =>
      props.shiftY ??
      (firstPlacement.value === "bottom"
        ? props.arrow
          ? 10
          : 5
        : firstPlacement.value === "top"
          ? props.arrow
            ? 10
            : 5
          : 0),
  );
  const shiftX = computed(
    () =>
      props.shiftX ??
      (firstPlacement.value === "left"
        ? props.arrow
          ? 10
          : 5
        : firstPlacement.value === "right"
          ? props.arrow
            ? 10
            : 5
          : 0),
  );
  const openTimer = ref<NodeJS.Timeout | null>(null);
  const closeTimer = ref<NodeJS.Timeout | null>(null);
  const hoverCloseTimer = ref<NodeJS.Timeout | null>(null);

  function onAppear() {
    if (closeTimer.value != undefined) {
      clearTimeout(closeTimer.value);
      closeTimer.value = null;
    }

    openTimer.value = setTimeout(() => {
      open.value = true;
    }, props.openDelay);
  }

  function onDisAppear() {
    if (openTimer.value) {
      clearTimeout(openTimer.value);
      openTimer.value = null;
    }

    closeTimer.value = setTimeout(() => {
      open.value = false;
    }, props.closeDelay);
  }

  function checkDisappear(
    event: MouseEvent | FocusEvent,
    checkElement?: HTMLElement,
    cb?: (close: boolean) => void,
  ) {
    try {
      const target = checkElement ?? (event.target as HTMLElement);

      const ignored = props.ignoreElements
        ? props.ignoreElements.some((element) => {
            if (isString(element)) {
              try {
                const domElement = document.querySelector(element);
                if (target === domElement) {
                  return true;
                }
              } catch {}
            } else if (element != undefined && target === element) {
              return true;
            }

            return false;
          })
        : false;
      const popper = positionerComponentRef.value?.positionerRef?.contains?.(target);
      const element = targetNode.value?.contains?.(target);

      if (ignored || popper || element) {
        if (cb) {
          cb(false);
        }

        return;
      }

      if (cb) {
        return void cb(true);
      }

      onDisAppear();
    } catch {
      onDisAppear();
    }
  }

  /** Effect by appear positioner  */

  watchEffect((clean) => {
    const positioner = positionerComponentRef.value?.positionerRef;
    if (!positioner) return;

    const eventController = new AbortController();

    /** Close by escape and return focus to last element */
    positioner.addEventListener("keydown", closeByEscape, { signal: eventController.signal });
    targetNode.value?.addEventListener?.("keydown", closeByEscape, {
      signal: eventController.signal,
    });

    function closeByEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.stopPropagation();
        if (lastActive.value) {
          lastActive.value.focus();
          lastActive.value = null;
        } else {
          targetNode.value?.focus?.();
        }
        onDisAppear();
      }
    }

    clean(() => {
      eventController.abort();
    });
  });

  /** Effect by open positioner */
  watchEffect((clean) => {
    if (!open.value) return;

    const eventController = new AbortController();
    lastActive.value = document.activeElement as HTMLElement;

    /** Close by click outside */
    document.addEventListener(props.closeByClickOutsideEvent, checkDisappear, {
      signal: eventController.signal,
    });
    /** Close by focus outside */
    window.addEventListener("focus", checkDisappear, {
      signal: eventController.signal,
      capture: true,
    });
    /** Update position by resize */
    window.addEventListener(
      "resize",
      () => {
        positionerComponentRef.value?.updatePosition?.();
      },
      {
        signal: eventController.signal,
        passive: true,
      },
    );
    /** Update position by scroll */
    window.addEventListener(
      "scroll",
      () => {
        if (props.closeByScroll) {
          onDisAppear();
        } else {
          positionerComponentRef.value?.updatePosition?.();
        }
      },
      {
        signal: eventController.signal,
        passive: true,
      },
    );

    if (triggers.value.includes("hover")) {
      /** Close hover trigger by leave */
      document.addEventListener(
        "mouseleave",
        (event) => {
          if (event.relatedTarget) {
            checkDisappear(event, event.relatedTarget as HTMLElement, (close) => {
              if (close) {
                hoverCloseTimer.value = setTimeout(() => {
                  onDisAppear();
                }, props.hoverDelay);
              } else if (hoverCloseTimer.value) {
                clearTimeout(hoverCloseTimer.value);
                hoverCloseTimer.value = null;
              }
            });
          }
        },
        {
          capture: true,
          signal: eventController.signal,
        },
      );
    }

    clean(() => {
      eventController.abort();
    });
  });

  /** Effect by observe slot */
  watchEffect((clean) => {
    if (!targetNode.value) return;

    const eventController = new AbortController();

    function toggleAppearByClick(event: MouseEvent) {
      event.preventDefault();

      if (open.value) {
        onDisAppear();
      } else {
        onAppear();
      }
    }
    function appearByKeyboard(event: KeyboardEvent) {
      if ((event.key === "Enter" || event.key === " ") && !open.value) {
        onAppear();
      }
    }
    function appearByArrowDown(event: KeyboardEvent) {
      if (event.key === "ArrowDown" && !open.value) {
        onAppear();
      }
    }

    const resizeObserver = new ResizeObserver((entries) => {
      targetNodeWidth.value = entries[0]?.target?.clientWidth ?? 0;
    });

    if (!props.fit) {
      resizeObserver.observe(targetNode.value);
    }

    if (triggers.value.includes("arrowDown")) {
      targetNode.value.addEventListener("keydown", appearByArrowDown, {
        signal: eventController.signal,
      });
    }
    if (
      (triggers.value.includes("click") && !(targetNode.value instanceof HTMLButtonElement)) ||
      triggers.value.includes("hover") ||
      triggers.value.includes("contextMenu")
    ) {
      targetNode.value.addEventListener("keydown", appearByKeyboard, {
        signal: eventController.signal,
      });
    }
    if (triggers.value.includes("hover")) {
      targetNode.value.addEventListener("mouseenter", onAppear, { signal: eventController.signal });
    }
    if (triggers.value.includes("click")) {
      targetNode.value.addEventListener("click", toggleAppearByClick, {
        signal: eventController.signal,
      });
    }
    if (triggers.value.includes("contextMenu")) {
      targetNode.value.addEventListener("contextmenu", toggleAppearByClick, {
        signal: eventController.signal,
      });
    }

    const mutationObserver = new MutationObserver((mutations) => {
      mutations.forEach(() => {
        positionerComponentRef.value?.updatePosition?.();
      });
    });
    const sizeContentObserver = new ResizeObserver(() => {
      positionerComponentRef.value?.updatePosition?.();
    });

    if (props.observe) {
      mutationObserver.observe(targetNode.value, {
        subtree: false,
        attributes: true,
        attributeFilter: ["style", "class"],
      });
      sizeContentObserver.observe(targetNode.value);
    }

    clean(() => {
      eventController.abort();
      mutationObserver.disconnect();
      sizeContentObserver.disconnect();
      resizeObserver.disconnect();
    });
  });

  defineExpose({ positioner: positionerComponentRef, targetNode });
</script>

<template>
  <span ref="popper" class="ksd-popper" aria-hidden="true" tabindex="-1" ksd-watcher="true"></span>
  <slot></slot>
  <Positioner
    ref="positioner"
    :open="open"
    :arrow="$props.arrow"
    :target="targetNode"
    :class-name-content="`ksd-popper__positioner-content ${$props.classNamePositionerContent ?? ''}`"
    :class-name-arrow="`ksd-popper__positioner-arrow ${props.classNamePositionerArrow ?? ''}`"
    :class="['ksd-popper__positioner']"
    v-bind="$attrs"
    :z-index="$props.zIndex"
    :modal-root="checkedModalRoot"
    :placement="$props.placement"
    :shift-x="shiftX"
    :shift-y="shiftY"
    :animation-appear="$props.animationAppear"
    :animation-disappear="$props.animationDisappear"
    :nested="$props.nested"
    :ksd-popper="true"
    :style="{
      width: $props.fit
        ? undefined
        : targetNodeWidth != undefined
          ? `${targetNodeWidth}px`
          : undefined,
    }"
    ><slot name="content"></slot
  ></Positioner>
</template>

<style lang="scss">
  .ksd-popper {
    width: 1px;
    height: 1px;
    clip-path: inset(50%);
    overflow: hidden;
    position: absolute;
    white-space: nowrap;

    &__positioner {
      border-radius: var(--ksd-border-radius-lg);
      color: var(--ksd-bg-popper-color);
      max-width: 400px;
      max-height: 400px;
      z-index: var(--ksd-popper-z-index);

      &[placement="bottom-left"],
      &[placement="bottom-center"],
      &[placement="bottom-right"] {
        &::before {
          content: "";
          position: absolute;
          height: 5px;
          top: -5px;
          left: 0;
          width: 100%;
        }

        &.arrow {
          &::before {
            height: 10px;
            top: -10px;
          }
        }
      }
      &[placement="top-left"],
      &[placement="top-center"],
      &[placement="top-right"] {
        &::before {
          content: "";
          position: absolute;
          height: 5px;
          bottom: -5px;
          left: 0;
          width: 100%;
        }
        &.arrow {
          &::before {
            height: 10px;
            bottom: -10px;
          }
        }
      }
      &[placement="left-top"],
      &[placement="left-center"],
      &[placement="left-bottom"] {
        &::before {
          content: "";
          position: absolute;
          width: 5px;
          right: -5px;
          left: auto;
          top: 0;
          height: 100%;
        }
        &.arrow {
          &::before {
            width: 10px;
            left: -10px;
          }
        }
      }
      &[placement="right-top"],
      &[placement="right-center"],
      &[placement="right-bottom"] {
        &::before {
          content: "";
          position: absolute;
          width: 5px;
          left: -5px;
          top: 0;
          height: 100%;
        }
        &.arrow {
          &::before {
            width: 10px;
            left: -10px;
          }
        }
      }
    }

    &__positioner-arrow {
      color: var(--ksd-bg-popper-color);
    }

    &__positioner-content {
      border-radius: var(--ksd-border-radius-lg);
      border: var(--ksd-line-width) var(--ksd-line-type) var(--ksd-border-popup-color);
      color: var(--ksd-text-main-color);
      font-size: var(--ksd-font-size);
      line-height: var(--ksd-line-height);
      background-color: var(--ksd-bg-popper-color);
      padding: var(--ksd-popper-inner-padding);
      min-width: calc(var(--ksd-border-radius) * 2 + 32px);
      min-height: var(--ksd-control-height);
      max-height: min(50dvh, 400px);
      overflow: auto;
      max-width: 400px;
      display: flex;
      flex-direction: column;
      width: max-content;
    }
  }
</style>
