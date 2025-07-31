<script setup lang="ts">
  import { VRightOutlined } from "@krainovsd/vue-icons";
  import { computed, nextTick, onMounted, ref, useTemplateRef, watch } from "vue";
  import { createInteractiveChildrenController } from "../lib";
  import Flex from "./Flex.vue";

  export type CollapseSize = "default" | "small" | "large";
  export type CollapseProps = {
    initialOpen?: boolean;
    size?: CollapseSize;
    ghost?: boolean;
    borderless?: boolean;
    noArrow?: boolean;
    header: string;
    classNameBody?: string;
    classNameHeader?: string;
    classNameRoot?: string;
    destroySlot?: boolean;
  };

  type Emits = {
    toggle: [open: boolean];
  };

  const bodyRef = useTemplateRef("body");
  const collapseRef = useTemplateRef("collapse");

  const emit = defineEmits<Emits>();
  const props = withDefaults(defineProps<CollapseProps>(), {
    borderless: false,
    classNameBody: undefined,
    classNameHeader: undefined,
    classNameRoot: undefined,
    ghost: false,
    initialOpen: false,
    noArrow: false,
    destroySlot: false,
    size: "default",
  });
  const open = defineModel<boolean>({ default: false });
  const localOpen = ref(props.initialOpen);

  const commonClasses = computed(() => ({
    [props.size]: true,
    borderless: props.borderless,
    ghost: props.ghost,
    open: localOpen.value,
  }));

  onMounted(() => {
    if (props.initialOpen) {
      open.value = true;
      bodyRef.value?.classList?.add?.("open");
    } else if (!props.destroySlot && bodyRef.value) {
      const interactiveElementsController = createInteractiveChildrenController(bodyRef.value);
      interactiveElementsController.interactiveElements.forEach((element) =>
        element.setAttribute("tabindex", "-1"),
      );
    }
  });

  function onClose() {
    const body = bodyRef.value;
    if (!body) return;
    emit("toggle", false);

    const keyframesClose: Keyframe[] = [
      { maxHeight: `${body.clientHeight}px`, offset: 0 },
      { maxHeight: "0", offset: 1 },
    ];
    const animate = body.animate(keyframesClose, {
      duration: 200,
      fill: "forwards",
    });
    animate.onfinish = function onfinish() {
      animate.cancel();
      if (!open.value) {
        localOpen.value = false;

        if (!props.destroySlot) {
          const interactiveElementsController = createInteractiveChildrenController(body);
          interactiveElementsController.interactiveElements.forEach((element) =>
            element.setAttribute("tabindex", "-1"),
          );
        }
      }
    };
  }
  function onOpen() {
    localOpen.value = true;
    if (
      bodyRef.value?.classList?.contains?.("open") &&
      bodyRef.value?.clientHeight === bodyRef.value?.scrollHeight
    )
      return;

    void nextTick(() => {
      const body = bodyRef.value;
      if (!body) return;
      emit("toggle", true);

      if (!props.destroySlot) {
        const interactiveElementsController = createInteractiveChildrenController(body);
        interactiveElementsController.interactiveElements.forEach((element) =>
          element.setAttribute("tabindex", "0"),
        );
      }

      const keyframesOpen: Keyframe[] = [
        {
          maxHeight: `${body.clientHeight === body.scrollHeight ? 0 : body.clientHeight}px`,
          offset: 0,
        },
        { maxHeight: `${body.scrollHeight}px`, offset: 1 },
      ];
      const animate = body.animate(keyframesOpen, {
        duration: 200,
        fill: "forwards",
      });
      animate.onfinish = function onfinish() {
        animate.cancel();
      };
    });
  }

  function onToggle() {
    open.value = !open.value;
  }
  function onClickHeader() {
    onToggle();
  }
  function onKeyDownHeader(event: KeyboardEvent) {
    if (event.key === "Enter" || event.key === " ") {
      onToggle();
    }
  }

  /** Open state */
  watch(
    open,
    (open) => {
      if (open) {
        onOpen();
      } else {
        onClose();
      }
    },
    { immediate: true },
  );

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
    <div
      ref="body"
      vertical
      class="ksd-collapse__body"
      :class="commonClasses"
      :aria-hidden="!localOpen"
    >
      <div
        v-if="localOpen || !$props.destroySlot"
        :class="[$props.classNameBody, commonClasses]"
        class="ksd-collapse__body-box"
      >
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
      border-top: var(--ksd-line-width) var(--ksd-line-type) transparent;
      background: var(--ksd-collapse-body-bg);
      border-radius: 0 0 var(--ksd-border-radius-lg) var(--ksd-border-radius-lg);

      &.open {
        border-color: var(--ksd-border-color);
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
