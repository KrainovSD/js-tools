<script setup lang="ts">
  import { computed, ref } from "vue";
  import EyeHideIcon from "../icons/EyeHideIcon.vue";
  import EyeIcon from "../icons/EyeIcon.vue";
  import IconWrapper from "./IconWrapper.vue";
  import type { InputProps } from "./Input.vue";
  import Input from "./Input.vue";

  // eslint-disable-next-line @typescript-eslint/no-redundant-type-constituents
  export type PasswordProps = {} & InputProps;
  const visible = ref(false);
  const model = defineModel<string>();
  const type = computed(() => (visible.value ? "text" : "password"));

  defineProps<PasswordProps>();
</script>

<template>
  <Input v-bind="{ ...$props, ...$attrs }" v-model="model" :type="type" class="ksd-password">
    <template v-for="(_, name) in $slots" #[name]="slotData">
      <slot :name="name" v-bind="slotData"></slot>
    </template>

    <template v-if="!$slots.suffix" #suffix>
      <IconWrapper v-if="!visible" @click="visible = true">
        <EyeHideIcon class="ksd-password__icon" />
      </IconWrapper>
      <IconWrapper v-if="visible" @click="visible = false">
        <EyeIcon v-if="visible" class="ksd-password__icon" />
      </IconWrapper>
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
