<script setup lang="ts">
  import { type Component, computed, ref, useTemplateRef, watchEffect } from "vue";
  import ArrowMenu, { type ArrowMenuProps } from "./ArrowMenu.vue";
  import Divider from "./Divider.vue";
  import Popper, { type PopperProps, type PopperTrigger } from "./Popper.vue";
  import Text from "./Text.vue";

  export type DropDownFirstPlacement = "top" | "bottom" | "left" | "right";

  export type DropDownMenuItem = {
    key: string;
    danger?: boolean;
    divider?: boolean;
    disabled?: boolean;
    link?: boolean;
    label?: string | Component;
    icon?: Component;
    onClick?: (event: MouseEvent) => void;
    innerOptions?: DropDownMenuItemInner;
  };
  export type DropDownMenuItemInner = {
    innerArrow?: boolean;
    // eslint-disable-next-line @typescript-eslint/no-redundant-type-constituents
  } & DropDownProps;

  export interface HTMLDropDownItem extends HTMLElement {
    nextItem: HTMLDropDownItem | undefined;
    prevItem: HTMLDropDownItem | undefined;
    innerInteractive: HTMLElement | undefined;
  }

  // eslint-disable-next-line @typescript-eslint/no-redundant-type-constituents
  export type DropDownProps = PopperProps & {
    menu: DropDownMenuItem[];
    interactiveMode?: "focusable" | "keyboard";
    level?: number;
    size?: "default" | "large";
  };

  const props = withDefaults(defineProps<DropDownProps>(), {
    animationAppear: "scaleY",
    animationDisappear: "scaleY",
    placement: "bottom-left",
    triggers: (props) => props.triggers ?? ["click"],
    fit: true,
    interactiveMode: "keyboard",
    level: 0,
    size: "default",
  });
  const triggersKey = computed(() => props.triggers.join(";"));
  const triggers = computed(() => {
    return triggersKey.value.length === 0
      ? ([] as PopperTrigger[])
      : (triggersKey.value.split(";") as PopperTrigger[]);
  });
  const popperRef = useTemplateRef("popper");
  const positionerRef = computed(() => popperRef.value?.positioner?.element);
  const positionerContent = computed(() => {
    const children = positionerRef.value?.children;

    return children
      ? children.length === 1
        ? (children[0] as HTMLElement)
        : (children[1] as HTMLElement)
      : undefined;
  });
  const lastActive = ref<HTMLElement | null>();

  const model = defineModel<boolean>();
  const itemClasses = computed(() => ({
    focusable: props.interactiveMode === "focusable",
    large: props.size === "large",
  }));

  function isComponent(component: string | undefined | Component) {
    if (component != undefined && typeof component !== "string") return true;

    return false;
  }

  function getFirstPlacementFromInner(placement?: DropDownProps["placement"]) {
    return (placement ?? "right-top").split("-")[0] as DropDownFirstPlacement;
  }
  function getArrowPosition(placement?: DropDownProps["placement"]): ArrowMenuProps["direction"] {
    const firstPlacement = getFirstPlacementFromInner(placement);

    if (firstPlacement === "bottom") {
      return "down";
    } else if (firstPlacement === "top") {
      return "up";
    } else if (firstPlacement === "left") {
      return "left";
    } else if (firstPlacement === "right") {
      return "right";
    }

    return "right";
  }

  watchEffect(() => {
    popperRef.value?.targetNode?.setAttribute?.("aria-haspopup", "true");
  });

  watchEffect((clean) => {
    if (!positionerContent.value) return;

    const eventController = new AbortController();
    lastActive.value = document.activeElement as HTMLElement | null;

    const interactiveElements = Array.from(
      positionerContent.value.querySelectorAll<HTMLDropDownItem>(".ksd-dropdown__element"),
    );

    interactiveElements.forEach((element) => {
      const interactive = element.querySelector<HTMLDropDownItem>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
      );
      if (interactive) {
        element.innerInteractive = interactive;
        element.setAttribute("tabindex", "-1");
      } else {
        element.setAttribute("tabindex", "0");
      }
    });

    const firstInteractive =
      interactiveElements[0].innerInteractive ??
      (interactiveElements[0] as HTMLDropDownItem | undefined);
    if (firstInteractive && !triggers.value.includes("hover")) {
      firstInteractive.focus();
    }

    interactiveElements.forEach((element, index) => {
      let prevIndex = index - 1;
      let nextIndex = index + 1;
      if (prevIndex < 0) {
        prevIndex = interactiveElements.length - 1;
      }
      if (nextIndex >= interactiveElements.length) {
        nextIndex = 0;
      }

      element.prevItem = interactiveElements[prevIndex];
      element.nextItem = interactiveElements[nextIndex];

      element.addEventListener("click", actionClick, { signal: eventController.signal });
      element.addEventListener("mousedown", actionWheel, { signal: eventController.signal });
      element.addEventListener("mousemove", focusByHover, { signal: eventController.signal });
    });

    positionerContent.value.addEventListener("keydown", actionKeyboard, {
      signal: eventController.signal,
    });
    positionerRef.value?.addEventListener?.("closedropdown", closeDropDown, {
      signal: eventController.signal,
    });

    function actionWheel(event: MouseEvent) {
      const target = event.target as HTMLDropDownItem;
      const wheel = "button" in event && event.button === 1;

      if (!wheel) return;

      if (target.classList.contains("link")) {
        const link = target.querySelector<HTMLElement>("a");
        if (link) {
          event.preventDefault();

          const mouseEvent = new MouseEvent("click", {
            ctrlKey: true,
            bubbles: false,
            cancelable: false,
          });

          link.dispatchEvent(mouseEvent);
          model.value = false;
        }
      }
    }
    function actionClick(event: MouseEvent | KeyboardEvent) {
      const target = event.target as HTMLElement;
      const currentTarget = event.currentTarget as HTMLDropDownItem;

      if (currentTarget.classList.contains("parent")) {
        return;
      }

      if (target.classList.contains("link")) {
        const link = target.querySelector<HTMLElement>("a");
        if (link) {
          const mouseEvent = new MouseEvent("click", {
            ctrlKey: event.ctrlKey,
            shiftKey: event.shiftKey,
            altKey: event.altKey,
            metaKey: event.metaKey,
            bubbles: false,
            cancelable: false,
          });
          link.dispatchEvent(mouseEvent);
        }
      }

      const closeEvent = new Event("closedropdown", { bubbles: true, cancelable: true });
      positionerRef.value?.dispatchEvent?.(closeEvent);
    }
    function focusByHover(event: MouseEvent) {
      const target = event.target as HTMLDropDownItem;
      if (target.innerInteractive) {
        target.innerInteractive.focus();
      } else {
        target.focus();
      }
    }
    function actionKeyboard(event: KeyboardEvent) {
      if (
        event.key !== "ArrowDown" &&
        event.key !== "ArrowUp" &&
        event.key !== "ArrowLeft" &&
        event.key !== "ArrowRight" &&
        event.key !== "Tab" &&
        event.key !== "Enter" &&
        event.key !== " "
      )
        return;

      const currentFocus =
        interactiveElements.find(
          (element) =>
            element === document.activeElement ||
            element.innerInteractive === document.activeElement,
        ) ?? (interactiveElements[0] as HTMLDropDownItem | undefined);

      if (!currentFocus) return;

      if (event.key === "ArrowDown" || (event.key === "Tab" && !event.shiftKey)) {
        /** Down */
        if (currentFocus.nextItem) {
          if (currentFocus.nextItem.innerInteractive) {
            currentFocus.nextItem.innerInteractive.focus();
          } else {
            currentFocus.nextItem.focus();
          }
          event.preventDefault();
        }
      } else if (event.key === "ArrowUp" || (event.key === "Tab" && event.shiftKey)) {
        /** Up */
        if (currentFocus.prevItem) {
          if (currentFocus.prevItem.innerInteractive) {
            currentFocus.prevItem.innerInteractive.focus();
          } else {
            currentFocus.prevItem.focus();
          }
          event.preventDefault();
        }
      } else if (event.key === "Enter" || event.key === " ") {
        /** Click */

        const mouseEvent = new MouseEvent("click", {
          ctrlKey: event.ctrlKey,
          shiftKey: event.shiftKey,
          altKey: event.altKey,
          metaKey: event.metaKey,
          bubbles: true,
          cancelable: true,
        });
        currentFocus.dispatchEvent(mouseEvent);
        event.preventDefault();
      } else if (event.key === "ArrowRight") {
        /** Click for nested */

        const nestedPlacement = currentFocus.getAttribute("data-nested-placement") as
          | DropDownFirstPlacement
          | undefined;

        if (nestedPlacement != undefined && nestedPlacement !== "left") {
          const mouseEvent = new MouseEvent("click", {
            ctrlKey: event.ctrlKey,
            shiftKey: event.shiftKey,
            altKey: event.altKey,
            metaKey: event.metaKey,
            bubbles: true,
            cancelable: true,
          });
          currentFocus.dispatchEvent(mouseEvent);
          event.preventDefault();
        } else if (props.nested && getFirstPlacementFromInner(props.placement) === "left") {
          model.value = false;
          lastActive.value?.focus?.();
        }
      } else if (event.key === "ArrowLeft") {
        /** Click for nested */

        const nestedPlacement = currentFocus.getAttribute("data-nested-placement") as
          | DropDownFirstPlacement
          | undefined;

        if (nestedPlacement != undefined && nestedPlacement === "left") {
          const mouseEvent = new MouseEvent("click", {
            ctrlKey: event.ctrlKey,
            shiftKey: event.shiftKey,
            altKey: event.altKey,
            metaKey: event.metaKey,
            bubbles: true,
            cancelable: true,
          });
          currentFocus.dispatchEvent(mouseEvent);
          event.preventDefault();
        } else if (props.nested && getFirstPlacementFromInner(props.placement) === "right") {
          model.value = false;
          lastActive.value?.focus?.();
        }
      }
    }
    function closeDropDown() {
      model.value = false;
      lastActive.value?.focus?.();
    }

    clean(() => {
      eventController.abort();
    });
  });
</script>

<template>
  <Popper
    ref="popper"
    v-bind="$props"
    v-model="model"
    :triggers="triggers"
    role="menu"
    :class-content="`ksd-dropdown__positioner-content ${$props.classContent ?? ''}`"
    :class="[$attrs.class, 'ksd-dropdown__positioner']"
  >
    <slot></slot>
    <template #content>
      <template v-for="item in $props.menu" :key="item.key">
        <div
          v-if="!item.divider && !item.innerOptions"
          role="menuitem"
          class="ksd-dropdown__element"
          :data-level="$props.level"
          :class="[itemClasses, { link: item.link }]"
          @click="item.onClick"
        >
          <component :is="item.icon" v-if="isComponent(item.icon)" :size="14" />
          <component :is="item.label" v-if="isComponent(item.label)" />
          <Text v-else>{{ item.label }}</Text>
        </div>
        <Divider v-if="item.divider" class="ksd-dropdown__divider" role="separator" />
        <DropDown
          v-if="item.innerOptions"
          v-bind="item.innerOptions"
          :modal-root="positionerRef"
          :placement="item.innerOptions.placement ?? 'right-top'"
          :size="item.innerOptions.size ?? $props.size"
          :nested="true"
          :level="($props.level ?? 0) + 1"
        >
          <div
            role="menuitem"
            class="ksd-dropdown__element parent"
            :data-nested-placement="getFirstPlacementFromInner(item.innerOptions.placement)"
            :class="[itemClasses, { link: item.link }]"
            :data-level="$props.level"
            aria-haspopup="true"
          >
            <ArrowMenu
              v-if="
                item.innerOptions.innerArrow &&
                getFirstPlacementFromInner(item.innerOptions.placement) === 'left'
              "
              :direction="getArrowPosition(item.innerOptions.placement)"
              class="ksd-dropdown__arrow"
            />
            <component :is="item.icon" v-if="isComponent(item.icon)" :size="14" />
            <component :is="item.label" v-if="isComponent(item.label)" />
            <Text v-else>{{ item.label }}</Text>
            <ArrowMenu
              v-if="
                item.innerOptions.innerArrow &&
                getFirstPlacementFromInner(item.innerOptions.placement) !== 'left'
              "
              :direction="getArrowPosition(item.innerOptions.placement)"
              class="ksd-dropdown__arrow"
            />
          </div>
        </DropDown>
      </template>
    </template>
  </Popper>
</template>

<style lang="scss">
  .ksd-dropdown {
    &__element {
      display: flex;
      align-items: center;
      gap: var(--ksd-margin-xs);
      margin: 0;
      padding: var(--ksd-dropdown-inner-padding);
      color: var(--ksd-text-main-color);
      font-weight: var(--ksd-font-weight);
      font-size: 1rem;
      line-height: var(--ksd-line-height);
      cursor: pointer;
      transition: all var(--ksd-transition-mid);
      border-radius: var(--ksd-border-radius-sm);

      &.large {
        padding: var(--ksd-dropdown-inner-padding-lg);
        min-width: var(--ksd-dropdown-inner-min-width-lg);
      }

      &:focus-within {
        background-color: var(--ksd-dropdown-bg-item-color);
        outline: none;
      }

      &:focus-visible {
        outline: none;
      }

      &.focusable {
        &:focus-visible {
          outline: 3px solid var(--ksd-outline-color);
          outline-offset: 1px;
          transition:
            outline-offset 0s,
            outline 0s;
        }
      }
    }

    &__divider {
      margin: var(--ksd-margin-xxs) 0;
    }

    &__arrow {
      &.up {
        margin-inline-start: auto;
      }
      &.down {
        margin-inline-start: auto;
      }

      &.right {
        margin-inline-start: auto;
      }
    }

    &__positioner-content {
      padding: var(--ksd-padding-xxs);
    }
  }
</style>
