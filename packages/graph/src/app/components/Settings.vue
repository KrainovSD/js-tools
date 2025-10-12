<script setup lang="ts">
  import { jsonParse } from "@krainovsd/js-helpers";
  import { VSettingOutlined } from "@krainovsd/vue-icons";
  import { VButton, VDrawer } from "@krainovsd/vue-ui";
  import { computed, reactive } from "vue";
  import type {
    ForceSettingsInterface,
    HighlightSettingsInterface,
    LinkOptionsInterface,
    LinkSettingsInterface,
    NodeOptionsInterface,
    NodeSettingsInterface,
  } from "@/module/GraphCanvas";
  import { DEFAULT_SETTINGS, OPENED_SETTINGS_COLLAPSE_STORAGE_KEY, TEMPLATES } from "../constants";
  import { getRootDiff } from "../lib/get-root-diff";
  import type { GraphSettings, LinkData, NodeData } from "../types";
  import SettingsCollapse from "./SettingsCollapse.vue";

  type Props = {
    root: HTMLElement | null;
  };
  type Emits = {
    cancel: [];
  };
  defineProps<Props>();
  defineEmits<Emits>();

  const openedCollapse = reactive<Record<string, boolean | undefined>>(
    jsonParse(localStorage.getItem(OPENED_SETTINGS_COLLAPSE_STORAGE_KEY)) ?? {},
  );

  const forceSettings = defineModel<Partial<ForceSettingsInterface<NodeData, LinkData>>>(
    "forceSettings",
    {
      default: {},
    },
  );
  const highlightSettings = defineModel<Partial<HighlightSettingsInterface>>("highlightSettings", {
    default: {},
  });
  const nodeSettings = defineModel<Partial<NodeSettingsInterface<NodeData, LinkData>>>(
    "nodeSettings",
    {
      default: {},
    },
  );
  const linkSettings = defineModel<Partial<LinkSettingsInterface<NodeData, LinkData>>>(
    "linkSettings",
    {
      default: {},
    },
  );
  const nodeOptions = defineModel<Partial<NodeOptionsInterface<NodeData, LinkData>>>(
    "nodeOptions",
    {
      default: {},
    },
  );
  const linkOptions = defineModel<Partial<LinkOptionsInterface<NodeData, LinkData>>>(
    "linkOptions",
    {
      default: {},
    },
  );

  const forceSettingsDiff = computed(() =>
    getRootDiff(forceSettings.value, DEFAULT_SETTINGS.forceSettings),
  );
  const highlightSettingsDiff = computed(() =>
    getRootDiff(highlightSettings.value, DEFAULT_SETTINGS.highlightSettings),
  );
  const nodeSettingsDiff = computed(() =>
    getRootDiff(nodeSettings.value, DEFAULT_SETTINGS.nodeSettings),
  );
  const nodeOptionsDiff = computed(() =>
    getRootDiff(nodeOptions.value, DEFAULT_SETTINGS.nodeOptions),
  );
  const linkSettingsDiff = computed(() =>
    getRootDiff(linkSettings.value, DEFAULT_SETTINGS.linkSettings),
  );
  const linkOptionsDiff = computed(() =>
    getRootDiff(linkOptions.value, DEFAULT_SETTINGS.linkOptions),
  );

  function updateSettings(name: keyof GraphSettings, key: string, value: unknown) {
    switch (name) {
      case "forceSettings": {
        forceSettings.value = { ...forceSettings.value, [key]: value };
        break;
      }
      case "highlightSettings": {
        highlightSettings.value = { ...highlightSettings.value, [key]: value };
        break;
      }
      case "nodeSettings": {
        nodeSettings.value = { ...nodeSettings.value, [key]: value };
        break;
      }
      case "linkSettings": {
        linkSettings.value = { ...linkSettings.value, [key]: value };
        break;
      }
      case "nodeOptions": {
        nodeOptions.value = { ...nodeOptions.value, [key]: value };
        break;
      }
      case "linkOptions": {
        linkOptions.value = { ...linkOptions.value, [key]: value };
        break;
      }
      default: {
      }
    }
  }

  function openCollapse(id: string, open: boolean) {
    openedCollapse[id] = open;
    localStorage.setItem(OPENED_SETTINGS_COLLAPSE_STORAGE_KEY, JSON.stringify(openedCollapse));
  }
</script>

<template>
  <VDrawer
    v-if="$props.root"
    :target="$props.root"
    :header="'Настройки'"
    :class="$style.root"
    :class-name-body="$style.body"
    :close-by-click-outside="false"
    :block="true"
    :mask="false"
    :width="535"
  >
    <template #default>
      <VButton :class="$style.button">
        <template #icon>
          <VSettingOutlined />
        </template>
      </VButton>
    </template>
    <template #content>
      <div :class="$style.content">
        <SettingsCollapse
          v-memo="[forceSettings, forceSettingsDiff]"
          :templates="[TEMPLATES[0]]"
          :settings="{
            forceSettings: forceSettings,
          }"
          :diff-settings="{
            forceSettings: forceSettingsDiff,
          }"
          :opened-collapse="openedCollapse"
          @change="updateSettings"
          @open="openCollapse"
        />

        <SettingsCollapse
          v-memo="[nodeOptions, nodeSettings, nodeOptionsDiff, nodeSettingsDiff]"
          :templates="[TEMPLATES[1]]"
          :settings="{
            nodeOptions: nodeOptions,
            nodeSettings: nodeSettings,
          }"
          :diff-settings="{
            nodeOptions: nodeOptionsDiff,
            nodeSettings: nodeSettingsDiff,
          }"
          :opened-collapse="openedCollapse"
          @change="updateSettings"
          @open="openCollapse"
        />
        <SettingsCollapse
          v-memo="[linkOptions, linkSettings, linkOptionsDiff, linkSettingsDiff]"
          :templates="[TEMPLATES[2]]"
          :settings="{
            linkOptions: linkOptions,
            linkSettings: linkSettings,
          }"
          :diff-settings="{
            linkOptions: linkOptionsDiff,
            linkSettings: linkSettingsDiff,
          }"
          :opened-collapse="openedCollapse"
          @change="updateSettings"
          @open="openCollapse"
        />
        <SettingsCollapse
          v-memo="[highlightSettings, highlightSettingsDiff]"
          :templates="[TEMPLATES[3]]"
          :settings="{
            highlightSettings: highlightSettings,
          }"
          :diff-settings="{
            highlightSettings: highlightSettingsDiff,
          }"
          :opened-collapse="openedCollapse"
          @change="updateSettings"
          @open="openCollapse"
        />
      </div>
      <VButton type="primary" @click="$emit('cancel')">Сбросить</VButton>
    </template>
  </VDrawer>
</template>

<style lang="scss" module>
  .root {
    height: 100%;
    overflow: hidden;

    & > div {
      overflow: hidden;
      height: 100%;
    }
  }
  .body {
    display: flex;
    flex-direction: column;
    gap: var(--ksd-padding);
    overflow: hidden;
    height: 100%;
  }

  .content {
    display: flex;
    flex-direction: column;
    gap: var(--ksd-padding);
    overflow: auto;
    height: 100%;
    flex: 1;
  }

  .button {
    position: absolute;
    top: 20px;
    left: 20px;
  }
</style>
