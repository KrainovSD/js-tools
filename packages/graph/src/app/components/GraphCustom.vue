<script setup lang="ts">
  import { computed, onMounted, onUnmounted, shallowRef, toRaw, useTemplateRef, watch } from "vue";
  import {
    type ForceSettingsInterface,
    GRAPH_CACHE_TYPE,
    GraphCanvas,
    type HighlightSettingsInterface,
    type LinkOptionsInterface,
    type LinkSettingsInterface,
    type NodeOptionsInterface,
    type NodeSettingsInterface,
    extractLinkPointIds,
  } from "@/module/GraphCanvas";
  import { DEFAULT_SETTINGS } from "../constants";
  import { getLinkOptions, getNodeOptions, prepareData } from "../lib";
  import type { Graph, Link, LinkData, Node, NodeData } from "../types";

  type Props = {
    graph: Graph;
    forceSettings: Partial<ForceSettingsInterface<NodeData, LinkData>>;
    highlightSettings: Partial<HighlightSettingsInterface>;
    nodeSettings: Partial<NodeSettingsInterface<NodeData, LinkData>>;
    linkSettings: Partial<LinkSettingsInterface<NodeData, LinkData>>;
    nodeOptions: Partial<NodeOptionsInterface<NodeData, LinkData>>;
    linkOptions: Partial<LinkOptionsInterface<NodeData, LinkData>>;
  };

  const props = defineProps<Props>();
  const graphRef = useTemplateRef("graph");
  const graphController = shallowRef<GraphCanvas<NodeData, LinkData> | undefined>(undefined);
  const selectedNode = defineModel<Node | null>("selectedNode", { default: null });
  const selectedNodes = defineModel<Node[]>("selectedNodes", { default: [] });
  const selectedLink = defineModel<string | null>("selectedLink", { default: null });
  const checkedGraph = computed(() =>
    prepareData({ nodes: props.graph.nodes, links: props.graph.links }),
  );

  function onClick(event: MouseEvent | TouchEvent, node: Node | undefined, link: Link | undefined) {
    if (!graphController.value) return;
    selectedNodes.value = [];
    graphController.value.changeSettings({
      nodeSettings: {
        options: getNodeOptions(props.nodeOptions, selectedNode.value, selectedNodes.value),
      },
    });

    // collapsible mode
    if (event.ctrlKey && node?.id != undefined) {
      const relationsMap: Record<string, string[]> = {};
      for (const link of graphController.value.getData().links) {
        const { sourceId, targetId } = extractLinkPointIds(link);
        relationsMap[sourceId] ??= [];
        relationsMap[sourceId].push(String(targetId));
      }
      const collapsedNodes = new Set<string>();
      for (const node of graphController.value.getData().nodes) {
        if (node.data?.collapsed) {
          collapsedNodes.add(String(node.id));
        }
      }
      const opening = !!node.data?.collapsed;
      function getAllChildren(graph: Record<string, string[]>, start: string) {
        const visited = new Set();
        const result: string[] = [];
        function dfs(node: string) {
          if (visited.has(node)) return;
          visited.add(node);
          result.push(node);

          if (node !== start && collapsedNodes.has(node)) return;
          for (const child of graph[node] || []) {
            dfs(child);
          }
        }
        dfs(start);

        return result.slice(1);
      }
      const childrenNodes = new Set(getAllChildren(relationsMap, String(node.id)));
      for (const node of graphController.value.getData().nodes) {
        if (childrenNodes.has(String(node.id))) {
          node.visible = opening;
        }
      }
      node.data ??= {};
      node.data.collapsed = !opening;
      if (opening) {
        node.label = "";
      } else {
        node.label = String(childrenNodes.size);
      }
      graphController.value.clearCache(true);

      return;
    }

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
          selectedNodes.value = [];
          graphController.value?.changeSettings({
            nodeSettings: {
              options: getNodeOptions(props.nodeOptions, selectedNode.value, selectedNodes.value),
            },
          });
        }
      },
      { signal: controller.signal },
    );
  });
  onUnmounted(() => {
    controller.abort();
  });

  /** force settings */
  watch(
    () => props.forceSettings,
    (forceSettings) => {
      if (!graphController.value) return;

      graphController.value.changeSettings({ forceSettings });
    },
    { immediate: true },
  );
  /** highlight settings */
  watch(
    () => props.highlightSettings,
    (highlightSettings) => {
      if (!graphController.value) return;

      graphController.value.changeSettings({ highlightSettings });
    },
    { immediate: true },
  );
  /** node settings */
  watch(
    () => [props.nodeSettings, props.nodeOptions, selectedNode.value] as const,
    ([nodeSettings, nodeOptions, selectedNode]) => {
      if (!graphController.value) return;

      graphController.value.changeSettings(
        {
          nodeSettings: {
            ...nodeSettings,
            options: getNodeOptions(nodeOptions, selectedNode, selectedNodes.value),
          },
        },
        [GRAPH_CACHE_TYPE.NodeOptions],
      );
    },
    { immediate: true },
  );
  /** link settings */
  watch(
    () => [props.linkSettings, props.linkOptions] as const,
    ([linkSettings, linkOptions]) => {
      if (!graphController.value) return;

      graphController.value.changeSettings({
        linkSettings: { ...linkSettings, options: getLinkOptions(linkOptions) },
      });
    },
    { immediate: true },
  );

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
        forceSettings: props.forceSettings,
        graphSettings: DEFAULT_SETTINGS.graphSettings,
        highlightSettings: props.highlightSettings,
        linkSettings: {
          ...props.linkSettings,
          options: getLinkOptions(props.linkOptions),
        },
        nodeSettings: {
          ...props.nodeSettings,
          options: getNodeOptions(props.nodeOptions, selectedNode.value, selectedNodes.value),
        },
        listeners: {
          onClick,
          onDoubleClick,
          onSelectionIn() {},
          onSelectionOut() {},
          onSelectionEnd(nodes) {
            selectedNodes.value = nodes;
            controller.changeSettings({
              nodeSettings: {
                options: getNodeOptions(props.nodeOptions, selectedNode.value, selectedNodes.value),
              },
            });
          },
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
