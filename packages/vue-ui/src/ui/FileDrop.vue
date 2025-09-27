<script setup lang="ts">
  import { ref } from "vue";

  type Emits = {
    upload: [files: File[], event: DragEvent];
    enter: [event: DragEvent];
    leave: [event: DragEvent];
  };

  const emit = defineEmits<Emits>();
  const over = ref(false);

  function onDrop(event: DragEvent) {
    event.preventDefault();

    over.value = false;
    const files = event.dataTransfer?.files;
    if (!files) return;

    emit("upload", Array.from(files), event);
  }

  function onDragEnter(event: DragEvent) {
    event.preventDefault();
    emit("enter", event);

    if (event.dataTransfer?.types?.some?.((t) => t === "Files")) {
      over.value = true;
    }
  }
  function onDragLeave(event: DragEvent) {
    event.preventDefault();
    emit("leave", event);

    over.value = false;
  }
</script>

<template>
  <div
    class="ksd-file-drop"
    @drop="onDrop"
    @dragenter="onDragEnter"
    @dragleave="onDragLeave"
    @dragover.prevent=""
  >
    <slot v-if="over" name="over"></slot>
    <slot v-else></slot>
  </div>
</template>

<style lang="scss">
  .ksd-file-drop {
    display: flex;
    width: 100%;
    height: 100%;
  }
</style>
