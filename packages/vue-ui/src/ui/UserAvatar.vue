<script setup lang="ts">
  import { computed } from "vue";
  import Text from "./Text.vue";

  export type UserAvatarSize = "large" | "small" | "default";

  export type UserAvatarProps = {
    name: string;
    initials?: string;
    avatar?: string;
    size?: UserAvatarSize;
  };

  const props = withDefaults(defineProps<UserAvatarProps>(), {
    size: "default",
    avatar: undefined,
    initials: undefined,
  });
  const initials = computed(() => {
    return (
      props.initials ??
      props.name
        .split(" ")
        .map((name) => name.charAt(0)?.toUpperCase?.())
        ?.toSpliced?.(2)
        .join("")
    );
  });
  const classes = computed(() => ({ [`size-${props.size}`]: true }));
</script>

<template>
  <div
    class="ksd-user-avatar"
    :class="classes"
    :style="{ backgroundImage: $props.avatar ? `url(${$props.avatar})` : undefined }"
  >
    <Text v-if="!$props.avatar" :size="$props.size"> {{ initials }} </Text>
  </div>
</template>

<style lang="scss">
  .ksd-user-avatar {
    min-width: var(--ksd-control-height);
    min-height: var(--ksd-control-height);
    width: var(--ksd-control-height);
    height: var(--ksd-control-height);
    border: var(--ksd-line-width) var(--ksd-line-type) var(--ksd-border-color);
    border-radius: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    background-repeat: no-repeat;
    background-position: center;
    background-size: cover;
    background-color: var(--ksd-bg-modal-color);

    &.size-small {
      width: var(--ksd-control-height-sm);
      height: var(--ksd-control-height-sm);
    }
    &.size-large {
      width: var(--ksd-control-height-lg);
      height: var(--ksd-control-height-lg);
    }
  }
</style>
