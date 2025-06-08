<script setup lang="ts">
  import {
    type PositionPlacements,
    type VisiblePosition,
    getVisiblePosition,
  } from "@krainovsd/js-helpers";
  import { computed, shallowRef, useTemplateRef, watchEffect } from "vue";
  import CaretUpOutlineIcon from "../icons/CaretUpOutlineIcon.vue";

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
    visibleArea?: HTMLElement;
    placement?: Exclude<PositionPlacements, "flex">;
    zIndex?: number;
    modalRoot?: string | HTMLElement | null;
    className?: string;
    shiftX?: number;
    shiftY?: number;
    target: HTMLElement | PositionerTargetNodePosition | undefined | null;
    arrow?: boolean;
    flexShift?: boolean;
  };

  const props = defineProps<PositionerProps>();
  const elementRef = useTemplateRef("positioner");
  const position = shallowRef<VisiblePosition>({
    bottom: 0,
    left: 0,
    placement: "bottom-center",
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
  const positionerStyles = computed(() => ({
    left: `${Math.round(position.value.left)}px`,
    top: `${Math.round(position.value.top)}px`,
    zIndex: props.zIndex,
  }));
  const arrowStyles = computed(() => ({
    left: arrowPosition.value.left,
    top: arrowPosition.value.top,
    bottom: arrowPosition.value.bottom,
    right: arrowPosition.value.right,
    translate: arrowPosition.value.translate,
    rotate: arrowPosition.value.rotate,
  }));

  function updatePosition() {
    if (!elementRef.value) return;

    position.value = getVisiblePosition({
      node: elementRef.value,
      initialPosition: {
        targetNode:
          props.target && "getBoundingClientRect" in props.target ? props.target : undefined,
        position: props.target && "width" in props.target ? props.target : undefined,
      },
      placement: props.placement ?? "bottom-center",
      flex: props.flexShift,
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
        top = "-11px";
        left = "15px";
        translate = "-50% 0 ";
      } else if (position.value.placement === "bottom-center") {
        top = "-11px";
        left = "50%";
        translate = "-50% 0 ";
      } else if (position.value.placement === "bottom-right") {
        top = "-11px";
        left = "calc(100% - 15px)";
        translate = "-50% 0 ";
      } else if (position.value.placement === "top-left") {
        bottom = "-11px";
        left = "15px";
        rotate = "180deg";
        translate = "-50% 0 ";
      } else if (position.value.placement === "top-center") {
        bottom = "-11px";
        left = "50%";
        rotate = "180deg";
        translate = "-50% 0 ";
      } else if (position.value.placement === "top-right") {
        bottom = "-11px";
        left = "calc(100% - 15px)";
        rotate = "180deg";
        translate = "-50% 0 ";
      } else if (position.value.placement === "left-top") {
        top = "5px";
        right = "-11px";
        rotate = "90deg";
      } else if (position.value.placement === "left-center") {
        top = "50%";
        right = "-11px";
        rotate = "90deg";
        translate = "0 -50%";
      } else if (position.value.placement === "left-bottom") {
        top = "calc(100% - 5px)";
        right = "-11px";
        rotate = "90deg";
        translate = "0 -100%";
      } else if (position.value.placement === "right-top") {
        top = "5px";
        left = "-11px";
        rotate = "-90deg";
      } else if (position.value.placement === "right-center") {
        top = "50%";
        left = "-11px";
        rotate = "-90deg";
        translate = "0 -50%";
      } else if (position.value.placement === "right-bottom") {
        top = "calc(100% - 5px)";
        left = "-11px";
        rotate = "-90deg";
        translate = "0 -100%";
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
  }

  watchEffect(() => {
    updatePosition();
  });

  defineExpose({ element: elementRef, updatePosition });
</script>

<template>
  <Teleport :to="$props.modalRoot ?? 'body'">
    <div ref="positioner" class="ksd-positioner" :class="$attrs.class" :style="positionerStyles">
      <CaretUpOutlineIcon
        v-if="$props.arrow"
        :size="16"
        class="ksd-positioner__arrow"
        :style="arrowStyles"
        color="black"
      />
      <div class="ksd-positioner__content" :class="[$props.className]"><slot></slot></div>
    </div>
  </Teleport>
</template>

<style lang="scss">
  .ksd-positioner {
    position: absolute;
    font-family: var(--ksd-font-family);
    font-size: 1rem;
    color: var(--ksd-text-reverse-color);
    line-height: var(--ksd-line-height);
    z-index: var(--ksd-popup-z-index);
    box-shadow: var(--ksd-shadow-secondary);

    &__arrow {
      position: absolute;
    }

    &__content {
      border-radius: var(--ksd-border-radius);
    }
  }
</style>
