<script setup lang="ts">
  import { VDrawer, VText } from "@krainovsd/vue-ui";
  import { computed, ref, watch } from "vue";
  import type { Node } from "../types";

  type Props = {
    selectedNode: Node | null;
    mountRoot: HTMLElement | null;
  };
  type Emits = {
    close: [];
  };

  const props = defineProps<Props>();
  defineEmits<Emits>();
  const open = ref(false);
  const title = computed(() => {
    return props.selectedNode?.name;
  });
  const content = computed(() => {
    return props.selectedNode?.data?.text;
  });

  watch(
    () => props.selectedNode,
    (node) => {
      if (node != undefined) {
        open.value = true;
      } else {
        open.value = false;
      }
    },
    { immediate: true },
  );
</script>

<template>
  <VDrawer
    v-if="$props.mountRoot"
    v-model="open"
    :target="$props.mountRoot"
    :header="title"
    :class="$style.root"
    :class-name-body="$style.body"
    :close-by-click-outside="false"
    :block="true"
    :mask="false"
    :width="535"
  >
    <template #content>
      <VText v-for="(text, index) in content" :key="index"> {{ text }}</VText>
    </template>
  </VDrawer>
</template>

<style lang="scss" module>
  .root {
    height: 100%;
    overflow: hidden;

    & > div {
      overflow: hidden;
    }
  }

  .body {
    display: flex;
    flex-direction: column;
    gap: var(--ksd-padding);
    overflow: auto;
  }
</style>
