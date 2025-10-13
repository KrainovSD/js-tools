<script setup lang="ts">
  import { THEME_CONFIG, VRadio, VThemeProvider } from "@krainovsd/vue-ui";
  import "@krainovsd/vue-ui/styles";
  import { computed, ref, useTemplateRef } from "vue";
  import type {
    ForceSettingsInterface,
    GraphCanvasInterface,
    HighlightSettingsInterface,
    LinkOptionsInterface,
    LinkSettingsInterface,
    NodeOptionsInterface,
    NodeSettingsInterface,
  } from "../module/GraphCanvas";
  import Graph from "./components/Graph.vue";
  import Info from "./components/Info.vue";
  import Settings from "./components/Settings.vue";
  import { DEFAULT_SETTINGS } from "./constants";
  import "./global.scss";
  import { createNewDynamicMock, customMock, d3Mock, realMock, stressMock } from "./mock";
  import type { LinkData, Node, NodeData } from "./types";

  const dataArray: {
    id: number;
    label: string;
    data: Pick<GraphCanvasInterface<NodeData, LinkData>, "nodes" | "links">;
  }[] = [
    { data: d3Mock, id: 1, label: "D3 example" },
    { data: stressMock, id: 2, label: "Стресс" },
    { data: realMock, id: 3, label: "Реальный" },
    { data: customMock, id: 4, label: "Кастомный" },
    { data: createNewDynamicMock({ links: [], nodes: [] }), id: 5, label: "Динамически" },
  ];
  const dataRef = ref(1);
  const graph = computed(() => dataArray.find((d) => d.id === dataRef.value)?.data);
  const selectedNode = ref<Node | null>(null);

  const forceSettings = ref<Partial<ForceSettingsInterface<NodeData, LinkData>>>(
    DEFAULT_SETTINGS.forceSettings,
  );
  const highlightSettings = ref<Partial<HighlightSettingsInterface>>(
    DEFAULT_SETTINGS.highlightSettings,
  );
  const nodeSettings = ref<Partial<NodeSettingsInterface<NodeData, LinkData>>>(
    DEFAULT_SETTINGS.nodeSettings,
  );
  const linkSettings = ref<Partial<LinkSettingsInterface<NodeData, LinkData>>>(
    DEFAULT_SETTINGS.linkSettings,
  );
  const nodeOptions = ref<Partial<NodeOptionsInterface<NodeData, LinkData>>>(
    DEFAULT_SETTINGS.nodeOptions,
  );
  const linkOptions = ref<Partial<LinkOptionsInterface<NodeData, LinkData>>>(
    DEFAULT_SETTINGS.linkOptions,
  );

  const rootRef = useTemplateRef("root");

  function clearSettings() {
    forceSettings.value = DEFAULT_SETTINGS.forceSettings;
    highlightSettings.value = DEFAULT_SETTINGS.highlightSettings;
    nodeSettings.value = DEFAULT_SETTINGS.nodeSettings;
    linkSettings.value = DEFAULT_SETTINGS.linkSettings;
    nodeOptions.value = DEFAULT_SETTINGS.nodeOptions;
    linkOptions.value = DEFAULT_SETTINGS.linkOptions;
  }
</script>

<template>
  <VThemeProvider :theme-config="THEME_CONFIG" :theme="'dark'" :font-size="14">
    <div ref="root" :class="$style.base">
      <div :class="$style.data">
        <VRadio
          v-for="data in dataArray"
          :key="data.id"
          v-model="dataRef"
          :name="'data'"
          :value="data.id"
        >
          {{ data.label }}
        </VRadio>
      </div>
      <Graph
        v-if="graph"
        v-model:selected-node="selectedNode"
        :graph="graph"
        :theme="'dark'"
        :force-settings="forceSettings"
        :highlight-settings="highlightSettings"
        :link-options="linkOptions"
        :link-settings="linkSettings"
        :node-options="nodeOptions"
        :node-settings="nodeSettings"
      />
      <Settings
        v-model:force-settings="forceSettings"
        v-model:highlight-settings="highlightSettings"
        v-model:link-options="linkOptions"
        v-model:link-settings="linkSettings"
        v-model:node-options="nodeOptions"
        v-model:node-settings="nodeSettings"
        :root="rootRef"
        @cancel="clearSettings"
      />
      <Info :mount-root="rootRef" :selected-node="selectedNode" />
    </div>
  </VThemeProvider>
</template>

<style lang="scss" module>
  .base {
    display: flex;
    gap: var(--ksd-padding);
    width: 100%;
    height: 100%;
  }

  .data {
    position: absolute;
    padding: var(--ksd-padding);
    bottom: 20px;
    left: 20px;
    display: flex;
    flex-direction: column;
    gap: var(--ksd-padding-xxs);
    background-color: #1f1f1f;
    border: 1px solid var(--ksd-border-color);
    z-index: 1;
  }
</style>
