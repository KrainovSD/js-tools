<script setup lang="ts">
  import { useMessage } from "../hooks/use-message";
  import Button from "../ui/Button.vue";
  import type { MessageType } from "../ui/Message.vue";

  type Props = {
    type?: MessageType;
    process?: boolean;
    text?: string;
  };

  const props = defineProps<Props>();
  const createMessage = useMessage();

  function create() {
    if (props.process) {
      const id = createMessage(props.text ?? "Please wait loading", {
        type: "loading",
        duration: 0,
      });

      setTimeout(() => {
        createMessage(props.text ?? "The loading has been completed", {
          type: "success",
          id,
        });
      }, 2000);
    } else {
      createMessage(props.text ?? "Some interesting message", { type: props.type ?? "success" });
    }
  }
</script>

<template>
  <Button icon-position="left" size="large" shape="default" :loading="true" @click="create">
    <slot></slot>
  </Button>
</template>

<style lang="scss"></style>
