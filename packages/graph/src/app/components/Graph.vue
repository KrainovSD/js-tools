<script setup lang="ts">
  import { computed, useTemplateRef } from "vue";
  import type { ForceSettingsInterface } from "@/module/GraphCanvas";
  import type {
    HighlightSettingsInterface,
    LinkOptionsInterface,
    LinkSettingsInterface,
    NodeOptionsInterface,
    NodeSettingsInterface,
  } from "@/module/GraphCanvas";
  import type { Graph, GraphMode, LinkData, Node, NodeData } from "../types";
  import GraphCustom from "./GraphCustom.vue";
  import GraphPerformance from "./GraphPerformance.vue";
  import GraphStatic from "./GraphStatic.vue";

  type Props = {
    graph: Graph;
    mode: GraphMode;
    forceSettings: Partial<ForceSettingsInterface<NodeData, LinkData>>;
    highlightSettings: Partial<HighlightSettingsInterface>;
    nodeSettings: Partial<NodeSettingsInterface<NodeData, LinkData>>;
    linkSettings: Partial<LinkSettingsInterface<NodeData, LinkData>>;
    nodeOptions: Partial<NodeOptionsInterface<NodeData, LinkData>>;
    linkOptions: Partial<LinkOptionsInterface<NodeData, LinkData>>;
  };

  defineProps<Props>();
  const selectedNode = defineModel<Node | null>("selectedNode", { default: null });
  const customRef = useTemplateRef<InstanceType<typeof GraphCustom>>("custom");
  const performanceRef = useTemplateRef<InstanceType<typeof GraphPerformance>>("performance");
  const staticRef = useTemplateRef<InstanceType<typeof GraphStatic>>("static");
  const customGraph = computed(() => customRef.value?.graphController);
  const performanceGraph = computed(() => performanceRef.value?.graphController);
  const staticGraph = computed(() => staticRef.value?.graphController);
  const graphControllerRef = computed(
    () => customGraph.value ?? performanceGraph.value ?? staticGraph.value,
  );

  defineExpose({ graphController: graphControllerRef });
</script>

<template>
  <GraphCustom
    v-if="mode === 'custom'"
    ref="custom"
    v-model:selected-node="selectedNode"
    :graph="graph"
    :force-settings="forceSettings"
    :highlight-settings="highlightSettings"
    :link-options="linkOptions"
    :link-settings="linkSettings"
    :node-options="nodeOptions"
    :node-settings="nodeSettings"
  />
  <GraphPerformance
    v-else-if="mode === 'performance'"
    ref="performance"
    v-model:selected-node="selectedNode"
    :graph="graph"
  />
  <GraphStatic
    v-else-if="mode === 'static'"
    ref="static"
    v-model:selected-node="selectedNode"
    :graph="graph"
  />
</template>
