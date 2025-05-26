<script setup lang="ts">
  import { computed, ref } from "vue";
  import EyeHideIcon from "../icons/EyeHideIcon.vue";
  import EyeIcon from "../icons/EyeIcon.vue";
  import type { InputProps } from "./Input.vue";
  import Input from "./Input.vue";

  // eslint-disable-next-line @typescript-eslint/no-redundant-type-constituents
  export type PasswordProps = {} & InputProps;
  const visible = ref(false);
  const type = computed(() => (visible.value ? "text" : "password"));

  defineProps<PasswordProps>();
</script>

<template>
  <Input v-bind="{ ...$props, ...$attrs }" :type="type" class="ksd-password">
    <template #suffix>
      <EyeHideIcon v-if="!visible" class="ksd-password__icon" @click="visible = true" />
      <EyeIcon v-if="visible" class="ksd-password__icon" @click="visible = false" />
    </template>
  </Input>
</template>

<style lang="scss">
  .ksd-password {
    &__icon {
      color: var(--ksd-icon-color);
      cursor: pointer;

      &:hover {
        color: var(--ksd-icon-hover-color);
      }
    }
  }
</style>
