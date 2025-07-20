<script setup lang="ts">
  import { VEyeInvisibleOutlined, VEyeOutlined } from "@krainovsd/vue-icons";
  import { computed, ref } from "vue";
  import IconWrapper from "./IconWrapper.vue";
  import type { InputProps } from "./Input.vue";
  import Input from "./Input.vue";

  export type PasswordProps = {} & Pick<
    InputProps,
    "allowClear" | "autofocus" | "disabled" | "size" | "status" | "variant" | "classNameRoot"
  >;
  const visible = ref(false);
  const model = defineModel<string>();
  const type = computed(() => (visible.value ? "text" : "password"));

  defineProps<PasswordProps>();
</script>

<template>
  <Input
    v-bind="$attrs"
    v-model="model"
    :class-name-root="$props.classNameRoot"
    :allow-clear="$props.allowClear"
    :autofocus="$props.autofocus"
    :disabled="$props.disabled"
    :size="$props.size"
    :status="$props.status"
    :variant="$props.variant"
    :type="type"
    class="ksd-password"
  >
    <template v-if="$slots.default" #default>
      <slot name="default"></slot>
    </template>
    <template v-if="$slots.prefix" #prefix>
      <slot name="prefix"></slot>
    </template>
    <template #suffix>
      <slot v-if="$slots.suffix" name="suffix"></slot>
      <template v-if="!$slots.suffix">
        <IconWrapper v-if="!visible" @click="visible = true">
          <VEyeInvisibleOutlined class="ksd-password__icon" />
        </IconWrapper>
        <IconWrapper v-if="visible" @click="visible = false">
          <VEyeOutlined v-if="visible" class="ksd-password__icon" />
        </IconWrapper>
      </template>
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
