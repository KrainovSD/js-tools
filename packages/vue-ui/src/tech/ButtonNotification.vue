<script setup lang="ts">
  import { useNotification } from "../hooks";
  import type { NotificationType } from "../ui";
  import Button from "../ui/Button.vue";

  type Props = {
    type?: NotificationType;
    process?: boolean;
    text?: string;
    title?: string;
    big?: boolean;
  };

  const props = defineProps<Props>();
  const createNotification = useNotification();
  const text = !props.big
    ? "Some interesting message"
    : Array.from({ length: 5 }, () => "Some interesting message").join(" ");
  const title = !props.big ? "Title" : Array.from({ length: 20 }, () => "Title").join(" ");

  function create() {
    if (props.process) {
      const id = createNotification(props.text ?? "Please wait loading", props.title ?? "Title", {
        type: "loading",
        duration: 0,
      });

      setTimeout(() => {
        createNotification(props.text ?? "The loading has been completed", props.title ?? "Title", {
          type: "success",
          id,
          duration: 3,
        });
      }, 2000);
    } else {
      createNotification(props.text ?? text, props.title ?? title, {
        type: props.type ?? "success",
        onClose: (id: number) => {
          // eslint-disable-next-line no-console
          console.log("close ", id);
        },
        // eslint-disable-next-line no-console
        okButtonHandler: () => console.log("ok"),
        // eslint-disable-next-line no-console
        cancelButtonHandler: () => console.log("cancel"),
      });
    }
  }
</script>

<template>
  <Button @click="create"><slot></slot></Button>
</template>

<style lang="scss"></style>
