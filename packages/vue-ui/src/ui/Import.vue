<script setup lang="ts">
  import { computed, useTemplateRef, watch } from "vue";
  import { getWatchedNode } from "../lib";

  export type ImportProps = {
    multiple?: boolean;
  };
  type Emits = {
    upload: [files: File[], event: Event];
  };

  defineProps<ImportProps>();
  const emit = defineEmits<Emits>();
  const importGhostRef = useTemplateRef("import-ghost");
  const inputRef = useTemplateRef("input");
  const targetNode = computed(() => getWatchedNode(importGhostRef.value));

  function onImport(event: Event) {
    const target = event.target as HTMLInputElement;
    const files = target.files ? Array.from(target.files) : null;
    target.value = "";

    if (!files) return;

    emit("upload", files, event);
  }

  /** Target Node Observe */
  watch(
    targetNode,
    (targetNode, _, clean) => {
      if (!targetNode) return;

      function onClickImport() {
        inputRef.value?.click?.();
      }

      targetNode.addEventListener("click", onClickImport);

      clean(() => {
        targetNode.removeEventListener("click", onClickImport);
      });
    },
    { immediate: true },
  );
</script>

<template>
  <span
    ref="import-ghost"
    class="ksd-import__ghost"
    aria-hidden="true"
    tabindex="-1"
    ksd-watcher="true"
  ></span>
  <slot></slot>
  <input
    ref="input"
    type="file"
    class="ksd-import__ghost"
    :multiple="$props.multiple"
    @input="onImport"
  />
</template>

<style lang="scss">
  .ksd-import {
    &__ghost {
      width: 1px;
      height: 1px;
      clip-path: inset(50%);
      overflow: hidden;
      position: absolute;
      white-space: nowrap;
    }
  }
</style>
