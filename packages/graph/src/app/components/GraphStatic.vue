<script setup lang="ts">
  import { computed, onMounted, onUnmounted, shallowRef, toRaw, useTemplateRef, watch } from "vue";
  import { GRAPH_CACHE_TYPE, StaticGraphCanvas, prepareGraphData } from "@/module/GraphCanvas";
  import { PERFORMANCE_SETTINGS } from "../constants";
  import { getLinkOptions, getNodeNeighbors, getNodeOptions } from "../lib";
  import type { Graph, Link, LinkData, Node, NodeData } from "../types";

  type Props = {
    graph: Graph;
  };

  const props = defineProps<Props>();
  const graphRef = useTemplateRef("graph");
  const graphController = shallowRef<StaticGraphCanvas<NodeData, LinkData> | undefined>(undefined);
  const selectedNode = defineModel<Node | null>("selectedNode", { default: null });
  const selectedLink = defineModel<string | null>("selectedLink", { default: null });
  const checkedGraph = computed(() =>
    getNodeNeighbors({ nodes: props.graph.nodes, links: props.graph.links }),
  );

  function onClick(_: MouseEvent | TouchEvent, node: Node | undefined, link: Link | undefined) {
    if (!graphController.value) return;

    if (!node && !link) {
      selectedNode.value = null;
      selectedLink.value = null;
    }

    if (node) {
      selectedLink.value = null;
      selectedNode.value = node;
    }

    if (link) {
      selectedNode.value = null;
      selectedLink.value = link.data?.id ?? null;
    }
  }

  function onDoubleClick(_: MouseEvent | TouchEvent, node: Node | undefined) {
    if (node) {
      graphController.value?.focusOnNode(node.id);
    }
  }

  const controller = new AbortController();
  onMounted(() => {
    window.addEventListener(
      "keydown",
      (event) => {
        if (event.key === "Escape") {
          selectedNode.value = null;
        }
      },
      { signal: controller.signal },
    );
  });
  onUnmounted(() => {
    controller.abort();
  });
  /** node settings */
  watch(
    selectedNode,
    (selectedNode) => {
      if (!graphController.value) return;

      graphController.value.changeSettings(
        {
          nodeSettings: {
            ...PERFORMANCE_SETTINGS.nodeSettings,
            options: getNodeOptions(PERFORMANCE_SETTINGS.nodeOptions, selectedNode, []),
          },
        },
        [GRAPH_CACHE_TYPE.NodeOptions],
      );
    },
    { immediate: true },
  );
  /** update data */
  watch(
    checkedGraph,
    (graph) => {
      if (!graphController.value) return;
      prepareGraphData({
        links: toRaw(graph.links),
        nodes: toRaw(graph.nodes),
        idGetter: (node) => node.id,
      });
      graphController.value.changeData(
        { links: toRaw(graph.links), nodes: toRaw(graph.nodes) },
        0.3,
      );
    },
    { immediate: true },
  );
  /** init graph */
  watch(
    graphRef,
    (graphRef, _, clean) => {
      if (!graphRef) return;
      prepareGraphData({
        links: toRaw(checkedGraph.value.links),
        nodes: toRaw(checkedGraph.value.nodes),
        idGetter: (node) => node.id,
      });
      const controller = new StaticGraphCanvas<NodeData, LinkData>({
        root: graphRef,
        links: toRaw(checkedGraph.value.links),
        nodes: toRaw(checkedGraph.value.nodes),
        graphSettings: PERFORMANCE_SETTINGS.graphSettings,
        highlightSettings: PERFORMANCE_SETTINGS.highlightSettings,
        linkSettings: {
          ...PERFORMANCE_SETTINGS.linkSettings,
          options: getLinkOptions(PERFORMANCE_SETTINGS.linkOptions),
        },
        nodeSettings: {
          ...PERFORMANCE_SETTINGS.nodeSettings,
          options: getNodeOptions(PERFORMANCE_SETTINGS.nodeOptions, selectedNode.value, []),
        },
        listeners: {
          onClick,
          onDoubleClick,
          onSelectionIn() {},
          onSelectionOut() {},
        },
      });
      controller.create();
      graphController.value = controller;
      clean(() => {
        controller.destroy();
        graphController.value = undefined;
      });
    },
    { immediate: true },
  );

  defineExpose({ graphController });
</script>

<template>
  <div ref="graph" :class="$style.graph"></div>
</template>

<style lang="scss" module>
  .graph {
    width: 100%;
    height: 100%;
    position: relative;
    flex: 1;
  }
</style>
