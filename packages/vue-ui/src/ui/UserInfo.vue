<script setup lang="ts">
  import Text from "./Text.vue";
  import UserAvatar from "./UserAvatar.vue";

  export type UserInfoSize = "lg" | "sm" | "default";

  export type UserInfoProps = {
    name: string;
    username: string;
    avatar?: string;
    size?: UserInfoSize;
  };

  defineProps<UserInfoProps>();
</script>

<template>
  <div class="ksd-user-info">
    <UserAvatar
      :name="$props.name"
      :size="$props.size === 'sm' ? 'default' : $props.size"
      :url="$props.avatar"
    />
    <div class="ksd-user-info__info">
      <Text :ellipsis="true" class="ksd-user-info__text" :size="$props.size" :weight="800">{{
        $props.name
      }}</Text>
      <Text :ellipsis="true" class="ksd-user-info__text" :size="$props.size" :type="'secondary'">{{
        `@${$props.username}`
      }}</Text>
    </div>
  </div>
</template>

<style lang="scss">
  .ksd-user-info {
    display: flex;
    align-items: center;
    gap: var(--ksd-padding-xs);

    &__info {
      display: flex;
      flex-direction: column;
      align-items: start;
      justify-content: start;
      gap: var(--ksd-padding-xxs);
    }

    &__text {
      line-height: 1;
    }
  }
</style>
