<script setup lang="ts">
  import { computed } from "vue";
  import { AVATAR_COUNT_DEFAULT, AVATAR_SHIFT_DEFAULT } from "../constants/tech";
  import Tooltip from "./Tooltip.vue";
  import type { UserAvatarProps, UserAvatarSize } from "./UserAvatar.vue";
  import UserAvatar from "./UserAvatar.vue";

  type IUserAvatar = Pick<UserAvatarProps, "avatar" | "initials" | "name">;

  export type UserAvatarsProps = {
    avatars: IUserAvatar[];
    count?: number;
    size?: UserAvatarSize;
    shift?: number;
    tooltip?: (avatars: IUserAvatar[]) => string;
  };
  const props = withDefaults(defineProps<UserAvatarsProps>(), {
    count: AVATAR_COUNT_DEFAULT,
    shift: AVATAR_SHIFT_DEFAULT,
    size: "default",
    tooltip: undefined,
  });
  const visibleAvatars = computed(() => props.avatars.toSpliced(props.count));
  const avatarTooltip = computed(() => {
    return (
      props.tooltip?.(visibleAvatars.value) ??
      `${visibleAvatars.value.map((user) => user.name).join(", ")}${props.avatars.length > (props.count ?? AVATAR_COUNT_DEFAULT) ? ` и еще ${props.avatars.length - (props.count ?? AVATAR_COUNT_DEFAULT)}` : ""}`
    );
  });
</script>

<template>
  <Tooltip v-if="$props.avatars.length > 0" :placement="'top-center'" :text="avatarTooltip">
    <div
      class="ksd-user-avatars"
      :style="{
        '--avatar-count':
          visibleAvatars.length +
          ($props.avatars.length > ($props.count ?? AVATAR_COUNT_DEFAULT) ? 1 : 0),
        '--avatar-size':
          $props.size === 'default'
            ? 'var(--ksd-control-height)'
            : $props.size === 'small'
              ? 'var(--ksd-control-height-sm)'
              : 'var(--ksd-control-height-lg)',
        '--avatar-shift': `${AVATAR_SHIFT_DEFAULT}px`,
      }"
    >
      <template v-for="(user, index) of visibleAvatars" :key="index">
        <UserAvatar
          :name="user.name"
          :size="$props.size"
          :avatar="user.avatar"
          class="ksd-user-avatars__avatar"
          :style="{
            left: index > 0 ? `-${($props.shift ?? AVATAR_SHIFT_DEFAULT) * index}px` : undefined,
          }"
        />
      </template>
      <UserAvatar
        v-if="$props.avatars.length > ($props.count ?? AVATAR_COUNT_DEFAULT)"
        :name="''"
        :size="$props.size"
        :initials="String($props.avatars.length - ($props.count ?? AVATAR_COUNT_DEFAULT))"
        class="ksd-user-avatars__avatar"
        :style="{
          left: `-${($props.shift ?? AVATAR_SHIFT_DEFAULT) * ($props.count ?? AVATAR_COUNT_DEFAULT)}px`,
        }"
      />
    </div>
  </Tooltip>
</template>

<style lang="scss">
  .ksd-user-avatars {
    display: flex;
    align-items: center;
    width: calc(
      var(--avatar-count) * var(--avatar-size) - (var(--avatar-count) - 1) * var(--avatar-shift)
    );

    &:focus-visible {
      outline: var(--ksd-outline-width) var(--ksd-outline-type) var(--ksd-outline-color);
      outline-offset: 1px;
      transition:
        outline-offset 0s,
        outline 0s;
    }

    &__avatar {
      position: relative;
    }

    &__empty {
      line-height: var(--ksd-control-height);

      &.size-small {
        line-height: var(--ksd-control-height-sm);
      }
      &.size-large {
        line-height: var(--ksd-control-height-lg);
      }
    }
  }
</style>
