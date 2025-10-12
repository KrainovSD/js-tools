<script setup lang="ts">
  import type { ThemeName } from "@krainovsd/vue-ui";
  import { computed, toRaw, useTemplateRef, watch } from "vue";
  import {
    type ForceSettingsInterface,
    GraphCanvas,
    type HighlightSettingsInterface,
    type LinkOptionsInterface,
    type LinkSettingsInterface,
    type NodeOptionsInterface,
    type NodeSettingsInterface,
  } from "@/module/GraphCanvas";
  import { DEFAULT_SETTINGS } from "../constants";
  import { getLinkOptions, getNodeNeighbors, getNodeOptions } from "../lib";
  import type { Graph, Link, LinkData, Node, NodeData } from "../types";

  type Props = {
    graph: Graph;
    theme: ThemeName;
    forceSettings: Partial<ForceSettingsInterface<NodeData, LinkData>>;
    highlightSettings: Partial<HighlightSettingsInterface>;
    nodeSettings: Partial<NodeSettingsInterface<NodeData, LinkData>>;
    linkSettings: Partial<LinkSettingsInterface<NodeData, LinkData>>;
    nodeOptions: Partial<NodeOptionsInterface<NodeData, LinkData>>;
    linkOptions: Partial<LinkOptionsInterface<NodeData, LinkData>>;
  };

  const props = defineProps<Props>();
  const graphRef = useTemplateRef("graph");
  let graphController: GraphCanvas<NodeData, LinkData> | undefined;
  const selectedNodes = defineModel<(string | number)[]>("selectedNodes", { default: [] });
  const selectedLink = defineModel<string | null>("selectedLink", { default: null });
  const checkedGraph = computed(() =>
    getNodeNeighbors({ nodes: props.graph.nodes, links: props.graph.links }),
  );

  function onClick(event: MouseEvent | TouchEvent, node: Node | undefined, link: Link | undefined) {
    if (!graphController) return;

    if (!node && !link) {
      selectedNodes.value = [];
      selectedLink.value = null;
    }

    if (node) {
      selectedLink.value = null;
      if (event.ctrlKey) {
        const nodeIndex = selectedNodes.value.findIndex((nid) => nid === node.id);

        if (nodeIndex === -1) {
          selectedNodes.value = [...selectedNodes.value, node.id];
        } else {
          selectedNodes.value = selectedNodes.value.filter((nid) => nid !== node.id);
        }
      } else {
        selectedNodes.value = [node.id];
      }
    }

    if (link) {
      selectedNodes.value = [];
      selectedLink.value = link.data?.id ?? null;
    }
  }

  /** force settings */
  watch(
    () => props.forceSettings,
    (forceSettings) => {
      if (!graphController) return;

      graphController.changeSettings({ forceSettings });
    },
    { immediate: true },
  );
  /** highlight settings */
  watch(
    () => props.highlightSettings,
    (highlightSettings) => {
      if (!graphController) return;

      graphController.changeSettings({ highlightSettings });
    },
    { immediate: true },
  );
  /** node settings */
  watch(
    () => [props.nodeSettings, props.nodeOptions] as const,
    ([nodeSettings, nodeOptions]) => {
      if (!graphController) return;

      graphController.changeSettings({
        nodeSettings: { ...nodeSettings, options: getNodeOptions(nodeOptions) },
      });
    },
    { immediate: true },
  );
  /** link settings */
  watch(
    () => [props.linkSettings, props.linkOptions] as const,
    ([linkSettings, linkOptions]) => {
      if (!graphController) return;

      graphController.changeSettings({
        linkSettings: { ...linkSettings, options: getLinkOptions(linkOptions) },
      });
    },
    { immediate: true },
  );

  /** update data */
  watch(
    checkedGraph,
    (graph) => {
      if (!graphController) return;

      graphController.changeData({ links: toRaw(graph.links), nodes: toRaw(graph.nodes) }, 0.3);
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
        forceSettings: props.forceSettings,
        graphSettings: DEFAULT_SETTINGS.graphSettings,
        highlightSettings: props.highlightSettings,
        linkSettings: {
          ...props.linkSettings,
          options: getLinkOptions(props.linkOptions),
        },
        nodeSettings: {
          ...props.nodeSettings,
          options: getNodeOptions(props.nodeOptions),
        },
        listeners: {
          onClick,
        },
      });

      graphController = controller;
      clean(() => {
        controller.destroy();
        graphController = undefined;
      });
    },
    { immediate: true },
  );
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
