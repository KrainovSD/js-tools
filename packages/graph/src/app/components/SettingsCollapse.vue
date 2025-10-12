<script setup lang="ts">
  import { VCollapse, VFlex } from "@krainovsd/vue-ui";
  import { computed } from "vue";
  import type {
    GraphSettings,
    SettingsTemplateDiffInfo,
    SettingsTemplateInterface,
  } from "../types";
  import SettingsFields from "./SettingsFields.vue";

  type Props = {
    templates: SettingsTemplateInterface[];
    openedCollapse: Record<string, boolean | undefined>;
    settings: Partial<GraphSettings>;
    diffSettings: Partial<Record<keyof GraphSettings, Set<string>>>;
    parentId?: string;
  };

  type Emits = {
    change: [name: keyof GraphSettings, key: string, value: unknown];
    open: [id: string, open: boolean];
  };

  defineEmits<Emits>();
  const props = defineProps<Props>();
  const correctParentId = computed(() => (props.parentId ? `${props.parentId}_` : ""));

  function hasDiff(diffsInfo: SettingsTemplateDiffInfo[]) {
    if (Object.values(props.diffSettings).every((diff) => diff.size === 0)) return false;

    return diffsInfo.some((diffInfo) => {
      return diffInfo.keys.some((key) => props.diffSettings[diffInfo.name]?.has?.(key));
    });
  }
</script>

<template>
  <VCollapse
    v-for="template in $props.templates"
    :key="`${correctParentId}${template.id}`"
    :header="template.label"
    :initial-open="Boolean(props.openedCollapse[`${correctParentId}${template.id}`])"
    :class-name-body="$style.body"
    :class-name-header="$style.header"
    @toggle="(open) => $emit('open', `${correctParentId}${template.id}`, open)"
  >
    <template v-if="hasDiff(template.diffInfo)" #header
      ><VFlex justify="end" w-full><div :class="$style.extra"></div> </VFlex
    ></template>

    <SettingsFields
      v-if="'name' in template && $props.settings[template.name] != undefined"
      :inputs="template.inputs"
      :settings="$props.settings[template.name]!"
      :diff-setting="$props.diffSettings[template.name]!"
      @change="
        (key, value) => {
          $emit('change', template.name, key, value);
        }
      "
    />
    <template v-if="'children' in template && template.children.length > 0">
      <SettingsCollapse
        :parent-id="`${correctParentId}${template.id}`"
        :templates="template.children"
        :settings="$props.settings"
        :diff-settings="$props.diffSettings"
        :opened-collapse="$props.openedCollapse"
        @change="(name, key, value) => $emit('change', name, key, value)"
        @open="(id, open) => $emit('open', id, open)"
    /></template>
  </VCollapse>
</template>

<style lang="scss" module>
  .body {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  .header {
    white-space: nowrap;
  }

  .extra {
    background-color: var(--ksd-accent-color);
    width: 12px;
    height: 12px;
    border-radius: 100%;
  }
</style>
