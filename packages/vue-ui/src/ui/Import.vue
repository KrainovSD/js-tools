<script setup lang="ts">
  import { type HTMLAttributes, useTemplateRef, watch } from "vue";
  import { useWatcher } from "../hooks/use-watcher";

  export type ImportProps = {
    multiple?: boolean;
    disabled?: boolean;
  } & /*@vue-ignore*/ HTMLAttributes;
  type Emits = {
    import: [files: File[], event: Event];
  };

  const props = defineProps<ImportProps>();
  const emit = defineEmits<Emits>();
  const inputRef = useTemplateRef("input");
  const { targetNode, updateTargetNode, watcherRef } = useWatcher();

  function onImport(event: Event) {
    const target = event.target as HTMLInputElement;
    const files = target.files ? Array.from(target.files) : null;
    target.value = "";

    if (!files) return;

    emit("import", files, event);
  }

  /** Target Node Observe */
  watch(
    targetNode,
    (targetNode, _, clean) => {
      if (!targetNode) return;

      function onClickImport() {
        if (props.disabled) return;

        inputRef.value?.click?.();
      }

      targetNode.addEventListener("click", onClickImport);

      clean(() => {
        targetNode.removeEventListener("click", onClickImport);
      });
    },
    { immediate: true },
  );

  defineExpose({ updateTargetNode });
</script>

<template>
  <span
    :ref="watcherRef"
    class="ksd-import__ghost"
    aria-hidden="true"
    tabindex="-1"
    ksd-watcher
  ></span>
  <slot></slot>
  <input
    ref="input"
    v-bind="$attrs"
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
