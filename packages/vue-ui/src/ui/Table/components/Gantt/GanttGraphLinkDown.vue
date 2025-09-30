<script setup lang="ts">
  import { VCaretRightFilled } from "@krainovsd/vue-icons";
  import { type CSSProperties, computed } from "vue";
  import type { GanttLinkDrawInstruction } from "../../types";

  type Props = {
    link: GanttLinkDrawInstruction;
    selectedLink: string | null;
  };

  const props = defineProps<Props>();

  const linkStyles = computed<CSSProperties>(() => ({
    "--color":
      props.selectedLink === props.link.id
        ? "var(--ksd-table-gantt-link-active-color)"
        : props.link.color,
    "--size": props.link.size,
    "--arrow-size": props.link.arrowSize,
    "--corner-size": props.link.cornerSize,
    zIndex: props.selectedLink === props.link.id ? 4 : 3,
  }));

  const leftToRightFirstStyles = computed<CSSProperties>(() => ({
    width: `${props.link.leftToRightFirst}px`,
    left: 0,
    top: 0,
  }));
  const cornerFirstStyles = computed<CSSProperties>(() => ({
    left: `${props.link.leftToRightFirst}px`,
    top: "0px",
  }));
  const topToBottomExtraStyles = computed<CSSProperties>(() => ({
    height: `${props.link.topToBottomExtra}px`,
    left: `${props.link.leftToRightFirst + props.link.cornerSize}px`,
    top: `${props.link.cornerSize}px`,
  }));
  const cornerExtraFirstStyles = computed<CSSProperties>(() => ({
    left: `${props.link.leftToRightFirst}px`,
    top: `${props.link.topToBottomExtra + props.link.cornerSize}px`,
  }));
  const rightToLeftStyles = computed<CSSProperties>(() => ({
    width: `${props.link.rightToLeft}px`,
    left: `${props.link.leftToRightFirst - props.link.rightToLeft}px`,
    top: `${props.link.topToBottomExtra + props.link.cornerSize * 2}px`,
  }));
  const cornerExtraSecondStyles = computed<CSSProperties>(() => ({
    left: `${props.link.leftToRightFirst - props.link.rightToLeft - props.link.cornerSize}px`,
    top: `${props.link.topToBottomExtra + props.link.cornerSize * 2}px`,
  }));
  const topToBottomStyles = computed<CSSProperties>(() => ({
    height: `${props.link.topToBottom}px`,
    left: props.link.extraCorner
      ? `${props.link.leftToRightFirst - props.link.rightToLeft - props.link.cornerSize}px`
      : `${props.link.leftToRightFirst + props.link.cornerSize}px`,
    top: props.link.extraCorner
      ? `${props.link.topToBottomExtra + props.link.cornerSize * 3}px`
      : `${props.link.cornerSize}px`,
  }));
  const cornerSecondStyles = computed<CSSProperties>(() => ({
    left: props.link.extraCorner
      ? `${props.link.leftToRightFirst - props.link.rightToLeft - props.link.cornerSize}px`
      : `${props.link.leftToRightFirst + props.link.cornerSize}px`,
    top: props.link.extraCorner
      ? `${props.link.topToBottomExtra + props.link.topToBottom + props.link.cornerSize * 3}px`
      : `${props.link.topToBottom + props.link.cornerSize}px`,
  }));
  const leftToRightSecondStyles = computed<CSSProperties>(() => ({
    width: `${props.link.leftToRightSecond}px`,
    left: props.link.extraCorner
      ? `${props.link.leftToRightFirst - props.link.rightToLeft}px`
      : `${props.link.leftToRightFirst + props.link.cornerSize * 2}px`,
    top: props.link.extraCorner
      ? `${props.link.topToBottomExtra + props.link.topToBottom + props.link.cornerSize * 4}px`
      : `${props.link.topToBottom + props.link.cornerSize * 2}px`,
  }));

  const arrowStyles = computed<CSSProperties>(() => ({
    left: props.link.extraCorner
      ? `${props.link.leftToRightFirst - props.link.rightToLeft + props.link.leftToRightSecond - props.link.arrowSize / 2}px`
      : `${props.link.leftToRightFirst + props.link.cornerSize * 2 + props.link.leftToRightSecond - props.link.arrowSize / 2}px`,
    top: props.link.extraCorner
      ? `${props.link.topToBottomExtra + props.link.topToBottom + props.link.cornerSize * 4 - props.link.arrowSize / 2 + props.link.topArrowShift}px`
      : `${props.link.topToBottom + props.link.cornerSize * 2 - props.link.arrowSize / 2 + props.link.topArrowShift}px`,
  }));
</script>

<template>
  <div
    :data-id="$props.link.id"
    class="ksd-gantt-graph__link ksd-gantt-graph__link-down"
    :style="linkStyles"
  >
    <div
      class="ksd-gantt-graph__link-part link left-to-right-first"
      :style="leftToRightFirstStyles"
    ></div>
    <div class="ksd-gantt-graph__link-part corner corner-first" :style="cornerFirstStyles"></div>
    <div
      v-if="$props.link.extraCorner"
      class="ksd-gantt-graph__link-part link top-to-bottom-extra"
      :style="topToBottomExtraStyles"
    ></div>
    <div
      v-if="$props.link.extraCorner"
      class="ksd-gantt-graph__link-part corner corner-extra-first"
      :style="cornerExtraFirstStyles"
    ></div>
    <div
      v-if="$props.link.extraCorner"
      class="ksd-gantt-graph__link-part link right-to-left"
      :style="rightToLeftStyles"
    ></div>
    <div
      v-if="$props.link.extraCorner"
      class="ksd-gantt-graph__link-part corner corner-extra-second"
      :style="cornerExtraSecondStyles"
    ></div>
    <div class="ksd-gantt-graph__link-part link top-to-bottom" :style="topToBottomStyles"></div>
    <div class="ksd-gantt-graph__link-part corner corner-second" :style="cornerSecondStyles"></div>
    <div
      class="ksd-gantt-graph__link-part link left-to-right-second"
      :style="leftToRightSecondStyles"
    ></div>
    <VCaretRightFilled class="ksd-gantt-graph__link-part arrow" :style="arrowStyles" />
  </div>
</template>

<style lang="scss">
  .ksd-gantt-graph__link-down {
    position: relative;

    .ksd-gantt-graph__link-part {
      &.link {
        background-color: var(--color, var(--ksd-table-gantt-link-color));
        position: absolute;
      }
      &.arrow {
        position: absolute;
        color: var(--color, var(--ksd-table-gantt-link-color));
        font-size: calc(var(--arrow-size) * 1px);
      }

      &.corner {
        border-color: var(--color, var(--ksd-table-gantt-link-color));
        box-sizing: content-box !important;
        position: absolute;
        width: calc(var(--corner-size) * 1px);
        height: calc(var(--corner-size) * 1px);
      }

      &.left-to-right-first {
        height: calc(var(--size) * 1px);
      }
      &.corner-first {
        border-top-width: calc(var(--size) * 1px);
        border-right-width: calc(var(--size) * 1px);
        border-right-style: solid;
        border-top-style: solid;
        border-top-right-radius: calc(var(--corner-size) * 1px);
      }
      &.top-to-bottom-extra {
        width: calc(var(--size) * 1px);
      }
      &.corner-extra-first {
        border-bottom-width: calc(var(--size) * 1px);
        border-right-width: calc(var(--size) * 1px);
        border-right-style: solid;
        border-bottom-style: solid;
        border-bottom-right-radius: calc(var(--corner-size) * 1px);
      }
      &.right-to-left {
        height: calc(var(--size) * 1px);
      }
      &.corner-extra-second {
        border-top-width: calc(var(--size) * 1px);
        border-left-width: calc(var(--size) * 1px);
        border-left-style: solid;
        border-top-style: solid;
        border-top-left-radius: calc(var(--corner-size) * 1px);
      }
      &.top-to-bottom {
        width: calc(var(--size) * 1px);
      }
      &.corner-second {
        border-bottom-width: calc(var(--size) * 1px);
        border-left-width: calc(var(--size) * 1px);
        border-left-style: solid;
        border-bottom-style: solid;
        border-bottom-left-radius: calc(var(--corner-size) * 1px);
      }
      &.left-to-right-second {
        height: calc(var(--size) * 1px);
      }
    }
  }
</style>
