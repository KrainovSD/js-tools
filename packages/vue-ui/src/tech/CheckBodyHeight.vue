<script setup lang="ts">
  import { onMounted, onUnmounted, ref } from "vue";
  import { VText } from "../ui";

  const warning = ref(false);
  const scrollHeight = ref(0);
  const clientHeight = ref(0);

  const observer = new ResizeObserver((entries) => {
    const body = entries[0].target;
    if (body == undefined) {
      warning.value = false;

      return;
    }

    if (body.clientHeight !== body.scrollHeight) {
      scrollHeight.value = body.scrollHeight;
      clientHeight.value = body.clientHeight;
      warning.value = true;
    } else {
      warning.value = false;
    }
  });

  onMounted(() => {
    observer.observe(document.body);
  });

  onUnmounted(() => {
    observer.disconnect();
  });
</script>

<template>
  <div :class="$style.warning">
    <VText v-if="warning" type="error" :strong="true"> Warning body height</VText>
    <VText v-if="warning" type="error" :strong="true"> Client Height is: {{ clientHeight }}</VText>
    <VText v-if="warning" type="error" :strong="true"> Scroll Height is: {{ scrollHeight }}</VText>
  </div>
  <slot></slot>
</template>

<style lang="scss" module>
  .warning {
    position: absolute;
    inset: auto auto 20px 20px;
    display: flex;
    flex-direction: column;
    gap: var(--ksd-padding-xxs);
  }
</style>
