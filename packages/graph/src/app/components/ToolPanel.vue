<script setup lang="ts">
  import type { GraphCanvas } from "@/module/GraphCanvas";
  import type { LinkData, NodeData } from "../types";

  type Props = {
    graphController: GraphCanvas<NodeData, LinkData> | undefined;
  };

  const props = defineProps<Props>();

  function onFitToView() {
    props.graphController?.fitToView();
  }

  function onExportToSvg() {
    props.graphController?.exportToSvg();
  }

  function onExportToSvgFit() {
    props.graphController?.exportToSvg("graph-fit.svg", true);
  }
</script>

<template>
  <div :class="$style.toolbar">
    <button
      :class="$style.button"
      title="Fit to view"
      @mousedown.stop
      @wheel.stop
      @click="onFitToView"
    >
      <svg
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M6 1v3h1V2.707l2.646 2.647.708-.708L8.707 2H10V1H6z" fill="currentColor" />
        <path d="M1 6h3v1H2.707l2.647 2.646-.708.708L2 7.707V10H1V6z" fill="currentColor" />
        <path d="M10 15v-3H9v1.293l-2.646-2.647-.708.708L8.293 14H7v1h3z" fill="currentColor" />
        <path d="M15 10h-3V9h1.293l-2.647-2.646.708-.708L14 8.293V7h1v3z" fill="currentColor" />
      </svg>
    </button>
    <button
      :class="$style.button"
      title="Export to SVG"
      @mousedown.stop
      @wheel.stop
      @click="onExportToSvg"
    >
      <svg
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M8 1v6m0 0l-2.5-2.5M8 7l2.5-2.5M2 11v2a1 1 0 001 1h10a1 1 0 001-1v-2M5 8v5h6V8"
          stroke="currentColor"
          stroke-width="1.2"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
    </button>
    <button
      :class="$style.button"
      title="Export to SVG (fit all)"
      @mousedown.stop
      @wheel.stop
      @click="onExportToSvgFit"
    >
      <svg
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M2 5V2h3M14 5V2h-3M2 11v3h3M14 11v3h-3"
          stroke="currentColor"
          stroke-width="1.2"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        <path
          d="M8 7v2m0 0l-2-2M8 7l2 2M2 11v2a1 1 0 001 1h10a1 1 0 001-1v-2"
          stroke="currentColor"
          stroke-width="1.2"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
    </button>
  </div>
</template>

<style lang="scss" module>
  .toolbar {
    position: absolute;
    left: 12px;
    top: 50%;
    transform: translateY(-50%);
    z-index: 2;
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  .button {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
    border: 1px solid var(--ksd-border-color);
    border-radius: 6px;
    background-color: #1f1f1f;
    color: #ccc;
    cursor: pointer;
    padding: 0;
    transition:
      background-color 0.15s,
      color 0.15s;

    &:hover {
      background-color: #2a2a2a;
      color: #fff;
    }

    &:active {
      background-color: #333;
    }
  }
</style>
