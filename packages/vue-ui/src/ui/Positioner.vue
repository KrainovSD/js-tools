<script setup lang="ts">
  import {
    type PositionPlacements,
    type VisiblePosition,
    getVisiblePosition,
    isObject,
  } from "@krainovsd/js-helpers";
  import { VCaretUpFilled } from "@krainovsd/vue-icons";
  import {
    type CSSProperties,
    computed,
    ref,
    shallowRef,
    useAttrs,
    useTemplateRef,
    watch,
  } from "vue";
  import { execAnimation } from "../lib";

  export type PositionerAnimations = "translate" | "scale" | "scaleY";

  export type PositionerTargetNodePosition = {
    x: number;
    y: number;
    width: number;
    height: number;
  };

  type ArrowVisiblePosition = {
    top: string | undefined;
    left: string | undefined;
    bottom: string | undefined;
    right: string | undefined;
    translate: string | undefined;
    rotate: string | undefined;
  };

  export type PositionerProps = {
    open?: boolean;
    visibleArea?: HTMLElement;
    placement?: Exclude<PositionPlacements, "flex">;
    zIndex?: number;
    modalRoot?: string | HTMLElement | null;
    classNameContent?: string;
    shiftX?: number;
    shiftY?: number;
    target: HTMLElement | PositionerTargetNodePosition | undefined | null;
    arrow?: boolean;
    animationAppear?: PositionerAnimations;
    animationDisappear?: PositionerAnimations;
    nested?: boolean;
  };

  const ARROW_SHIFT_FROM_CENTER = 11;
  const ARROW_SHIFT_FROM_CORNER = 10;
  const ARROW_SHIFT_FROM_CORNER_MINI = 5;

  const props = defineProps<PositionerProps>();
  const attrs = useAttrs();
  const localOpen = ref(false);
  const positionerRef = useTemplateRef("positioner");
  const positionerContentRef = computed(() => {
    const children = positionerRef.value?.children;

    return children
      ? children.length === 1
        ? (children[0] as HTMLElement)
        : (children[1] as HTMLElement)
      : undefined;
  });
  const position = shallowRef<VisiblePosition>({
    bottom: 0,
    left: 0,
    placement: "flex",
    right: 0,
    top: 0,
  });
  const arrowPosition = shallowRef<ArrowVisiblePosition>({
    bottom: undefined,
    left: undefined,
    right: undefined,
    top: undefined,
    rotate: undefined,
    translate: undefined,
  });
  const positionerStyles = computed(() => {
    const placement = position.value.placement;
    if (
      placement === "bottom-center" ||
      placement === "bottom-left" ||
      placement === "bottom-right" ||
      placement === "right-top" ||
      placement === "right-center" ||
      placement === "left-top" ||
      placement === "left-center"
    ) {
      return {
        left: `${Math.round(position.value.left)}px`,
        top: `${Math.round(position.value.top)}px`,
        zIndex: props.zIndex,
      };
    }

    return {
      left: `${Math.round(position.value.left)}px`,
      bottom: `${Math.round(position.value.bottom)}px`,
      top: "auto",
      zIndex: props.zIndex,
    };
  });
  const arrowStyles = computed(() => ({
    left: arrowPosition.value.left,
    top: arrowPosition.value.top,
    bottom: arrowPosition.value.bottom,
    right: arrowPosition.value.right,
    translate: arrowPosition.value.translate,
    rotate: arrowPosition.value.rotate,
  }));
  const contentStyles = computed<CSSProperties>(() => ({
    width: isObject(attrs.style) ? (attrs.style.width as string) : undefined,
  }));
  const role = computed(() => attrs.role as string | undefined);
  const componentClasses = computed(() => ({ arrow: props.arrow }));

  function updatePosition() {
    if (!positionerRef.value) return;

    const isFirstRender = position.value.placement === "flex";

    position.value = getVisiblePosition({
      node: positionerRef.value,
      initialPosition: {
        targetNode:
          props.target && "getBoundingClientRect" in props.target ? props.target : undefined,
        position: props.target && "width" in props.target ? props.target : undefined,
      },
      nested: props.nested,
      placement: props.placement ?? "bottom-center",
      stepX: props.shiftX,
      stepY: props.shiftY,
      visibleArea: props.visibleArea,
    });

    if (props.arrow) {
      let bottom: string | undefined;
      let top: string | undefined;
      let right: string | undefined;
      let left: string | undefined;
      let translate: string | undefined;
      let rotate: string | undefined;

      if (position.value.placement === "bottom-left") {
        top = `-${ARROW_SHIFT_FROM_CENTER}px`;
        left = `${ARROW_SHIFT_FROM_CORNER}px`;
      } else if (position.value.placement === "bottom-center") {
        top = `-${ARROW_SHIFT_FROM_CENTER}px`;
        left = "50%";
        translate = "-50% 0 ";
      } else if (position.value.placement === "bottom-right") {
        top = `-${ARROW_SHIFT_FROM_CENTER}px`;
        left = "auto";
        right = `${ARROW_SHIFT_FROM_CORNER}px`;
      } else if (position.value.placement === "top-left") {
        bottom = `-${ARROW_SHIFT_FROM_CENTER}px`;
        left = `${ARROW_SHIFT_FROM_CORNER}px`;
        rotate = "180deg";
      } else if (position.value.placement === "top-center") {
        bottom = `-${ARROW_SHIFT_FROM_CENTER}px`;
        left = "50%";
        rotate = "180deg";
        translate = "-50% 0 ";
      } else if (position.value.placement === "top-right") {
        bottom = `-${ARROW_SHIFT_FROM_CENTER}px`;
        left = "auto";
        right = `${ARROW_SHIFT_FROM_CORNER}px`;
        rotate = "180deg";
      } else if (position.value.placement === "left-top") {
        top = `${ARROW_SHIFT_FROM_CORNER_MINI}px`;
        right = `-${ARROW_SHIFT_FROM_CENTER}px`;
        rotate = "90deg";
      } else if (position.value.placement === "left-center") {
        top = "50%";
        right = `-${ARROW_SHIFT_FROM_CENTER}px`;
        rotate = "90deg";
        translate = "0 -50%";
      } else if (position.value.placement === "left-bottom") {
        top = "auto";
        bottom = `${ARROW_SHIFT_FROM_CORNER_MINI}px`;
        right = `-${ARROW_SHIFT_FROM_CENTER}px`;
        rotate = "90deg";
      } else if (position.value.placement === "right-top") {
        top = `${ARROW_SHIFT_FROM_CORNER_MINI}px`;
        left = `-${ARROW_SHIFT_FROM_CENTER}px`;
        rotate = "-90deg";
      } else if (position.value.placement === "right-center") {
        top = "50%";
        left = `-${ARROW_SHIFT_FROM_CENTER}px`;
        rotate = "-90deg";
        translate = "0 -50%";
      } else if (position.value.placement === "right-bottom") {
        top = "auto";
        bottom = `${ARROW_SHIFT_FROM_CORNER_MINI}px`;
        left = `-${ARROW_SHIFT_FROM_CENTER}px`;
        rotate = "-90deg";
      }

      arrowPosition.value = {
        bottom,
        left,
        right,
        rotate,
        top,
        translate,
      };
    }

    positionerRef.value.setAttribute("placement", position.value.placement);
    if (isFirstRender && props.animationAppear != undefined) {
      void execAnimation(positionerRef.value, `ksd-positioner_${props.animationAppear}-in`);
    }
  }

  /** Animation by close */
  watch(
    () => props.open,
    (value) => {
      if (value) {
        position.value = { ...position.value, placement: "flex" };
        localOpen.value = true;
      } else if (props.animationDisappear != undefined) {
        void execAnimation(
          positionerRef.value,
          `ksd-positioner_${props.animationDisappear}-out`,
        ).then(() => {
          if (!props.open) {
            localOpen.value = false;
          }
        });
      } else {
        localOpen.value = false;
      }
    },
    { immediate: true },
  );

  /** Check position */
  watch(
    () => [positionerRef.value],
    () => {
      if (!positionerRef.value) return;

      updatePosition();
    },
    { immediate: true },
  );

  defineExpose({ positionerRef, positionerContentRef, updatePosition });
</script>

<template>
  <Teleport v-if="localOpen" :to="$props.modalRoot ?? 'body'">
    <div
      ref="positioner"
      class="ksd-positioner"
      v-bind="$attrs"
      :role="undefined"
      :style="{ ...positionerStyles, ...($attrs.style ?? {}) }"
      :class="[$attrs.class, componentClasses]"
    >
      <VCaretUpFilled
        v-if="$props.arrow"
        :size="16"
        class="ksd-positioner__arrow"
        :style="arrowStyles"
      />
      <div
        :style="contentStyles"
        :role="role"
        class="ksd-positioner__content"
        :class="[$props.classNameContent]"
      >
        <slot></slot>
      </div>
    </div>
  </Teleport>
</template>

<style lang="scss">
  .ksd-positioner {
    position: absolute;
    font-family: var(--ksd-font-family);
    font-size: var(--ksd-font-size);
    line-height: var(--ksd-line-height);
    z-index: var(--ksd-popup-z-index);
    box-shadow: var(--ksd-shadow-secondary);

    &[placement="bottom-left"] {
      transform-origin: left top;
    }
    &[placement="bottom-center"] {
      transform-origin: center top;
    }
    &[placement="bottom-right"] {
      transform-origin: right top;
    }

    &[placement="top-left"] {
      transform-origin: left bottom;
    }
    &[placement="top-center"] {
      transform-origin: center bottom;
    }
    &[placement="top-right"] {
      transform-origin: right bottom;
    }

    &[placement="left-top"] {
      transform-origin: right top;
    }
    &[placement="left-center"] {
      transform-origin: right center;
    }
    &[placement="left-bottom"] {
      transform-origin: right bottom;
    }

    &[placement="right-top"] {
      transform-origin: left top;
    }
    &[placement="right-center"] {
      transform-origin: left center;
    }
    &[placement="right-bottom"] {
      transform-origin: left bottom;
    }

    &_translate-in {
      animation-duration: var(--ksd-transition-mid);
      animation-timing-function: cubic-bezier(0.22, 1, 0.28, 0.8);

      &[placement="top-left"],
      &[placement="top-center"],
      &[placement="top-right"] {
        animation-name: ksd-positioner-translate-top-in;
      }
      &[placement="bottom-left"],
      &[placement="bottom-center"],
      &[placement="bottom-right"] {
        animation-name: ksd-positioner-translate-bottom-in;
      }
      &[placement="left-top"],
      &[placement="left-center"],
      &[placement="left-bottom"] {
        animation-name: ksd-positioner-translate-left-in;
      }
      &[placement="right-top"],
      &[placement="right-center"],
      &[placement="right-bottom"] {
        animation-name: ksd-positioner-translate-right-in;
      }
    }
    &_translate-out {
      animation-duration: var(--ksd-transition-mid);
      animation-timing-function: cubic-bezier(0.72, 0.2, 0.77, 0);
      &[placement="top-left"],
      &[placement="top-center"],
      &[placement="top-right"] {
        animation-name: ksd-positioner-translate-top-out;
      }
      &[placement="bottom-left"],
      &[placement="bottom-center"],
      &[placement="bottom-right"] {
        animation-name: ksd-positioner-translate-bottom-out;
      }
      &[placement="left-top"],
      &[placement="left-center"],
      &[placement="left-bottom"] {
        animation-name: ksd-positioner-translate-left-out;
      }
      &[placement="right-top"],
      &[placement="right-center"],
      &[placement="right-bottom"] {
        animation-name: ksd-positioner-translate-right-out;
      }
    }

    &_scale-in {
      animation-name: ksd-positioner-scale-in;
      animation-duration: var(--ksd-transition-mid);
      animation-timing-function: cubic-bezier(0.22, 1, 0.28, 0.8);
    }

    &_scale-out {
      animation-name: ksd-positioner-scale-out;
      animation-duration: var(--ksd-transition-mid);
      animation-timing-function: cubic-bezier(0.72, 0.2, 0.77, 0);
    }

    &_scaleY-in {
      animation-name: ksd-positioner-scaleY-in;
      animation-duration: var(--ksd-transition-mid);
      animation-timing-function: cubic-bezier(0.22, 1, 0.28, 0.8);
    }

    &_scaleY-out {
      animation-name: ksd-positioner-scaleY-out;
      animation-duration: var(--ksd-transition-mid);
      animation-timing-function: cubic-bezier(0.72, 0.2, 0.77, 0);
    }

    &__arrow {
      position: absolute;
    }
  }

  @keyframes ksd-positioner-translate-top-in {
    from {
      opacity: 0;
      translate: 0px -5px;
    }
    to {
      opacity: 1;
      translate: 0px 0px;
    }
  }
  @keyframes ksd-positioner-translate-top-out {
    from {
      opacity: 1;
      translate: 0px 0px;
    }
    to {
      opacity: 0;
      translate: 0px -5px;
    }
  }

  @keyframes ksd-positioner-translate-bottom-in {
    from {
      opacity: 0;
      translate: 0px 5px;
    }
    to {
      opacity: 1;
      translate: 0px 0px;
    }
  }
  @keyframes ksd-positioner-translate-bottom-out {
    from {
      opacity: 1;
      translate: 0px 0px;
    }
    to {
      opacity: 0;
      translate: 0px 5px;
    }
  }

  @keyframes ksd-positioner-translate-left-in {
    from {
      opacity: 0;
      translate: -5px 0px;
    }
    to {
      opacity: 1;
      translate: 0px 0px;
    }
  }
  @keyframes ksd-positioner-translate-left-out {
    from {
      opacity: 1;
      translate: 0px 0px;
    }
    to {
      opacity: 0;
      translate: -5px 0px;
    }
  }

  @keyframes ksd-positioner-translate-right-in {
    from {
      opacity: 0;
      translate: 5px 0px;
    }
    to {
      opacity: 1;
      translate: 0px 0px;
    }
  }
  @keyframes ksd-positioner-translate-right-out {
    from {
      opacity: 1;
      translate: 0px 0px;
    }
    to {
      opacity: 0;
      translate: 5px 0px;
    }
  }

  @keyframes ksd-positioner-scale-in {
    from {
      opacity: 0;
      scale: 0.89;
    }
    to {
      opacity: 1;
      scale: 1;
    }
  }
  @keyframes ksd-positioner-scale-out {
    from {
      opacity: 1;
      scale: 1 1;
    }
    to {
      opacity: 0;
      scale: 0.89;
    }
  }

  @keyframes ksd-positioner-scaleY-in {
    from {
      opacity: 0;
      scale: 1 0.8;
    }
    to {
      opacity: 1;
      scale: 1 1;
    }
  }
  @keyframes ksd-positioner-scaleY-out {
    from {
      opacity: 1;
      scale: 1 1;
    }
    to {
      opacity: 0;
      scale: 1 0.8;
    }
  }
</style>
