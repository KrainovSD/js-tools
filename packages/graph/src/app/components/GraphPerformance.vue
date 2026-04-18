<script setup lang="ts">
  import { computed, shallowRef, toRaw, useTemplateRef, watch } from "vue";
  import { GraphCanvas } from "@/module/GraphCanvas";
  import { PERFORMANCE_SETTINGS } from "../constants";
  import { getNodeNeighbors } from "../lib";
  import type { Graph, Link, LinkData, Node, NodeData } from "../types";

  type Props = {
    graph: Graph;
  };

  const props = defineProps<Props>();
  const graphRef = useTemplateRef("graph");
  const graphController = shallowRef<GraphCanvas<NodeData, LinkData> | undefined>(undefined);
  const selectedNode = defineModel<Node | null>("selectedNode", { default: null });
  const selectedLink = defineModel<string | null>("selectedLink", { default: null });
  const checkedGraph = computed(() =>
    getNodeNeighbors({ nodes: props.graph.nodes, links: props.graph.links }),
  );

  function onClick(
    _event: MouseEvent | TouchEvent,
    node: Node | undefined,
    link: Link | undefined,
  ) {
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

  /** update data */
  watch(
    checkedGraph,
    (graph) => {
      if (!graphController.value) return;

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

      const controller = new GraphCanvas<NodeData, LinkData>({
        root: graphRef,
        links: toRaw(checkedGraph.value.links),
        nodes: toRaw(checkedGraph.value.nodes),
        forceSettings: PERFORMANCE_SETTINGS.forceSettings,
        graphSettings: PERFORMANCE_SETTINGS.graphSettings,
        highlightSettings: PERFORMANCE_SETTINGS.highlightSettings,
        linkSettings: {
          ...PERFORMANCE_SETTINGS.linkSettings,
          options: PERFORMANCE_SETTINGS.linkOptions,
        },
        nodeSettings: {
          ...PERFORMANCE_SETTINGS.nodeSettings,
          options: PERFORMANCE_SETTINGS.nodeOptions,
        },
        listeners: {
          onClick,
        },
      });

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
