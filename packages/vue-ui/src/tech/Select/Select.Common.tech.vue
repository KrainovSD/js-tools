<script setup lang="ts">
  import { ref } from "vue";
  import { type SelectProps, VSelect } from "../../ui";
  import { SELECT_MOCK } from "./select.mock";

  defineProps<SelectProps<number, false>>();
  const value = ref<number | undefined>(undefined);
</script>

<template>
  <VSelect v-bind="$props" v-model="value" :options="SELECT_MOCK" />
</template>

<style lang="scss" module></style>
