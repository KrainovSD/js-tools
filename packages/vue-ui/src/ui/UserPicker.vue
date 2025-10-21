<script
  setup
  lang="ts"
  generic="ID extends string | number = string | number, Multiple extends true | false = false"
>
  import { arrayToMapByKey, isArray } from "@krainovsd/js-helpers";
  import { VCheckOutlined } from "@krainovsd/vue-icons";
  import { computed, nextTick, ref, useTemplateRef, watch } from "vue";
  import { AVATAR_COUNT_DEFAULT, AVATAR_SHIFT_DEFAULT } from "../constants/tech";
  import { createInteractiveChildrenController, waitParentAnimation } from "../lib";
  import Button from "./Button.vue";
  import Divider from "./Divider.vue";
  import Input from "./Input.vue";
  import Popover from "./Popover.vue";
  import Text from "./Text.vue";
  import Tooltip from "./Tooltip.vue";
  import UserAvatar from "./UserAvatar.vue";
  import UserInfo from "./UserInfo.vue";

  export type UserPickerUser<ID extends string | number> = {
    id: ID;
    name: string;
    username: string;
    initial?: string;
    avatar?: string;
  };

  export type UserPickerSize = "default" | "large" | "small";
  export type UserPickerPosition = "left" | "right" | "center";

  export type UserPickerProps<ID extends string | number, Multiple extends true | false> = {
    users: UserPickerUser<ID>[];
    size?: UserPickerSize;
    position?: UserPickerPosition;
    count?: number;
    shift?: number;
    header?: string;
    empty?: string;
    multiple?: Multiple;
    nested?: boolean;
    tooltip?: (users: UserPickerUser<ID>[]) => string;
    autofocus?: boolean;
  };

  const props = withDefaults(defineProps<UserPickerProps<ID, Multiple>>(), {
    count: AVATAR_COUNT_DEFAULT,
    size: "default",
    shift: AVATAR_SHIFT_DEFAULT,
    header: "Выберите пользователей",
    empty: "Выберите пользователей",
    position: "left",
    tooltip: undefined,
    autofocus: false,
  });
  const currentUsersModel = defineModel<Multiple extends true ? ID[] | undefined : ID | undefined>({
    default: undefined,
  });
  const currentUsers = computed<ID[]>(() =>
    isArray(currentUsersModel.value)
      ? (currentUsersModel.value as ID[])
      : currentUsersModel.value != undefined
        ? ([currentUsersModel.value] as ID[])
        : [],
  );
  const search = ref("");
  const popoverRef = useTemplateRef("popover");
  const inputRef = useTemplateRef("input");
  const positionerRef = computed(() => popoverRef.value?.popper?.positioner?.contentElement);
  const classes = computed(() => ({ [`size-${props.size}`]: true }));
  const openerRef = useTemplateRef("opener");
  const open = ref(false);

  const activeUsers = computed(() => {
    const usersMap = arrayToMapByKey(props.users, "id");

    return currentUsers.value.map((userId) => usersMap[userId.toString()]);
  });
  const filteredActiveUsers = computed(() =>
    search.value === ""
      ? activeUsers.value
      : activeUsers.value.filter(
          (user) =>
            user.name.toLowerCase().includes(search.value.toLowerCase()) ||
            user.username.toLowerCase().includes(search.value.toLowerCase()),
        ),
  );
  const shortActiveUsers = computed(() => activeUsers.value.toSpliced(props.count));
  const avatarTooltip = computed(() => {
    return (
      props.tooltip?.(shortActiveUsers.value) ??
      `${shortActiveUsers.value.map((user) => user.name).join(", ")}${currentUsers.value.length > (props.count ?? AVATAR_COUNT_DEFAULT) ? ` и еще ${activeUsers.value.length - (props.count ?? AVATAR_COUNT_DEFAULT)}` : ""}`
    );
  });
  const otherUsers = computed(() => {
    const active = new Set(activeUsers.value.map((user) => user.id));

    return props.users.filter((user) => !active.has(user.id));
  });
  const filteredOtherUsers = computed(() =>
    search.value === ""
      ? otherUsers.value
      : otherUsers.value.filter(
          (user) =>
            user.name.toLowerCase().includes(search.value.toLowerCase()) ||
            user.username.toLowerCase().includes(search.value.toLowerCase()),
        ),
  );

  function selectUser(id: ID) {
    if (props.multiple) {
      currentUsersModel.value = [...currentUsers.value, id] as Multiple extends true
        ? ID[] | undefined
        : ID | undefined;
    } else {
      currentUsersModel.value = id as Multiple extends true ? ID[] | undefined : ID | undefined;
    }
    const userElement = positionerRef.value?.querySelector?.<HTMLElement>(
      `.ksd-user-picker__item[data-id="${id}"]`,
    );
    const nextId = userElement?.nextElementSibling?.getAttribute?.("data-id");

    void nextTick(() => {
      if (nextId != undefined) {
        positionerRef.value
          ?.querySelector?.<HTMLElement>(`.ksd-user-picker__item[data-id="${nextId}"]`)
          ?.focus?.();
      } else {
        positionerRef.value?.querySelector?.<HTMLElement>(`.ksd-user-picker__item`)?.focus?.();
      }
    });
  }
  function unSelectUser(id: ID) {
    if (props.multiple) {
      currentUsersModel.value = currentUsers.value.filter(
        (userId) => userId !== id,
      ) as Multiple extends true ? ID[] | undefined : ID | undefined;
    } else {
      currentUsersModel.value = undefined as Multiple extends true
        ? ID[] | undefined
        : ID | undefined;
    }

    const userElement = positionerRef.value?.querySelector?.<HTMLElement>(
      `.ksd-user-picker__item[data-id="${id}"]`,
    );
    let sibling = userElement?.nextElementSibling;
    if (sibling?.classList?.contains?.("ksd-divider")) {
      sibling = sibling?.nextElementSibling;
    }
    const nextId = sibling?.getAttribute?.("data-id");

    void nextTick(() => {
      if (nextId != undefined) {
        positionerRef.value
          ?.querySelector?.<HTMLElement>(`.ksd-user-picker__item[data-id="${nextId}"]`)
          ?.focus?.();
      } else {
        positionerRef.value?.querySelector?.<HTMLElement>(`.ksd-user-picker__item`)?.focus?.();
      }
    });
  }
  function clearUsers() {
    if (props.multiple) {
      currentUsersModel.value = [] as unknown as Multiple extends true
        ? ID[] | undefined
        : ID | undefined;
    } else {
      currentUsersModel.value = undefined as Multiple extends true
        ? ID[] | undefined
        : ID | undefined;
    }
  }

  watch(
    () => [positionerRef.value, filteredActiveUsers.value, filteredOtherUsers.value] as const,
    ([positionerRef], _, clean) => {
      if (!positionerRef) return;

      const interactiveUserItemController = createInteractiveChildrenController(positionerRef, {
        selector: ".ksd-user-picker__item",
        autofocus: false,
      });
      const interactiveController = createInteractiveChildrenController(positionerRef, {
        autofocus: false,
      });

      function actionKeyboard(event: KeyboardEvent) {
        if (event.key === "Tab" && !event.shiftKey) {
          event.preventDefault();
          event.stopPropagation();
          interactiveController.focusNext();
        } else if (event.key === "Tab" && event.shiftKey) {
          event.preventDefault();
          event.stopPropagation();
          interactiveController.focusPrev();
        } else if (event.key === "Enter" || event.key === " ") {
          const focusedIndex = interactiveUserItemController.getFocusedIndex();
          if (focusedIndex === -1) return;
          interactiveUserItemController.interactiveElements[focusedIndex]?.click?.();
        } else if (event.key === "ArrowDown") {
          event.preventDefault();
          interactiveUserItemController.focusNext();
        } else if (event.key === "ArrowUp") {
          event.preventDefault();
          interactiveUserItemController.focusPrev();
        } else if (
          document.activeElement !== inputRef.value?.element &&
          /^[a-zA-ZА-Яа-я]$/.test(event.key)
        ) {
          event.preventDefault();
          event.stopPropagation();

          inputRef.value?.element?.focus?.();
          search.value = event.key;

          const keyboardEvent = new KeyboardEvent("keydown", { key: event.key });
          inputRef.value?.element?.dispatchEvent?.(keyboardEvent);
        } else if (
          document.activeElement !== inputRef.value?.element &&
          event.key === "Backspace"
        ) {
          event.preventDefault();
          event.stopPropagation();

          search.value = "";
        }
      }

      positionerRef.addEventListener("keydown", actionKeyboard, { capture: true });

      clean(() => {
        positionerRef.removeEventListener("keydown", actionKeyboard, { capture: true });
      });
    },
    { immediate: true, flush: "post" },
  );
  watch(
    currentUsers,
    (currentUsers, oldUsers) => {
      if (
        (currentUsers.length !== 0 && oldUsers?.length === 0) ||
        (currentUsers.length === 0 && oldUsers?.length !== 0)
      ) {
        popoverRef.value?.popper?.positioner?.updatePosition?.();
      }
    },
    { immediate: true, flush: "post" },
  );

  /** autofocus */
  watch(
    openerRef,
    (openerRef) => {
      if (props.autofocus && openerRef) {
        void waitParentAnimation(openerRef).then(() => {
          if (!openerRef) return;
          openerRef.focus();
          open.value = true;
        });
      }
    },
    { immediate: true, flush: "pre" },
  );
</script>

<template>
  <Popover
    ref="popover"
    v-model="open"
    :class-name-positioner-content="'ksd-user-picker__positioner'"
    :observe="true"
    :autofocus="false"
    :nested="$props.nested"
    :placement="
      $props.position === 'left'
        ? 'bottom-left'
        : $props.position === 'right'
          ? 'bottom-right'
          : 'bottom-center'
    "
  >
    <div ref="opener" v-bind="$attrs" class="ksd-user-picker" :tabindex="0" :role="'button'">
      <Tooltip v-if="currentUsers.length > 0" :placement="'top-center'" :text="avatarTooltip">
        <div
          class="ksd-user-picker__users"
          :style="{
            '--avatar-count':
              shortActiveUsers.length +
              (currentUsers.length > ($props.count ?? AVATAR_COUNT_DEFAULT) ? 1 : 0),
            '--avatar-size':
              $props.size === 'default'
                ? 'var(--ksd-control-height)'
                : $props.size === 'small'
                  ? 'var(--ksd-control-height-sm)'
                  : 'var(--ksd-control-height-lg)',
            '--avatar-shift': `${AVATAR_SHIFT_DEFAULT}px`,
          }"
        >
          <template v-for="(user, index) of shortActiveUsers" :key="user.id">
            <UserAvatar
              :name="user.name"
              :size="$props.size"
              :avatar="user.avatar"
              class="ksd-user-picker__avatar"
              :style="{
                left:
                  index > 0 ? `-${($props.shift ?? AVATAR_SHIFT_DEFAULT) * index}px` : undefined,
              }"
            />
          </template>
          <UserAvatar
            v-if="currentUsers.length > ($props.count ?? AVATAR_COUNT_DEFAULT)"
            :name="''"
            :initials="String(activeUsers.length - ($props.count ?? AVATAR_COUNT_DEFAULT))"
            class="ksd-user-picker__avatar"
            :style="{
              left: `-${($props.shift ?? AVATAR_SHIFT_DEFAULT) * ($props.count ?? AVATAR_COUNT_DEFAULT)}px`,
            }"
          />
        </div>
      </Tooltip>
      <Text v-if="currentUsers.length === 0" class="ksd-user-picker__empty" :class="classes">{{
        $props.empty
      }}</Text>
    </div>
    <template #content>
      <div class="ksd-user-picker__header">
        <Text>{{ $props.header }}</Text>
        <Button :type="'text'" :size="'small'" @click="clearUsers">Очистить</Button>
      </div>
      <Input ref="input" v-model="search" :autofocus="true" placeholder="Поиск..." />
      <div class="ksd-user-picker__list">
        <div
          v-for="user of filteredActiveUsers"
          :key="user.id"
          :tabindex="0"
          :role="'button'"
          :data-id="user.id"
          class="ksd-user-picker__item active"
          @click="unSelectUser(user.id)"
        >
          <UserInfo
            :name="user.name"
            :size="$props.size"
            :username="user.username"
            :avatar="user.avatar"
          />
          <VCheckOutlined class="ksd-user-picker__check" />
        </div>
        <Divider v-if="filteredOtherUsers.length > 0 && filteredActiveUsers.length > 0" />
        <template v-if="filteredOtherUsers.length > 0">
          <div
            v-for="user of filteredOtherUsers"
            :key="user.id"
            :tabindex="0"
            :role="'button'"
            :data-id="user.id"
            class="ksd-user-picker__item"
            @click="selectUser(user.id)"
          >
            <UserInfo
              :name="user.name"
              :size="$props.size"
              :username="user.username"
              :avatar="user.avatar"
            />
          </div>
        </template>
        <div
          v-if="filteredActiveUsers.length + filteredOtherUsers.length > 6"
          class="ksd-user-picker__blur-container"
        >
          <div class="ksd-user-picker__blur"></div>
        </div>
      </div>
    </template>
  </Popover>
</template>

<style lang="scss">
  .ksd-user-picker {
    width: fit-content;
    cursor: pointer;

    &:focus-visible {
      outline: var(--ksd-outline-width) var(--ksd-outline-type) var(--ksd-outline-color);
      outline-offset: 1px;
      transition:
        outline-offset 0s,
        outline 0s;
    }

    &__positioner {
      max-height: min(70dvh, 400px);
    }

    &__users {
      display: flex;
      align-items: center;
      width: calc(
        var(--avatar-count) * var(--avatar-size) - (var(--avatar-count) - 1) * var(--avatar-shift)
      );
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

    &__header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: var(--ksd-padding-xl);
    }

    &__list {
      overflow: auto;
      display: flex;
      flex-direction: column;
      gap: var(--ksd-padding-xxs);
    }

    &__item {
      display: flex;
      padding: var(--ksd-select-option-padding);
      color: var(--ksd-text-main-color);
      font-weight: normal;
      font-size: var(--ksd-select-option-font-size);
      line-height: var(--ksd-select-option-line-height);
      cursor: pointer;
      transition: background var(--ksd-transition-slow) ease;
      border-radius: var(--ksd-border-radius-sm);
      align-items: safe center;
      gap: var(--ksd-padding);

      &:focus-visible,
      &:hover {
        background-color: var(--ksd-select-option-active-bg);
        outline: none;
      }

      &.active {
        color: var(--ksd-select-option-selected-color);
        font-weight: var(--ksd-select-option-selected-font-weight);
        background-color: var(--ksd-select-option-selected-bg);

        &:focus-visible,
        &:hover {
          background-color: var(--ksd-accent-bg-hover-color);
          outline: none;
        }
      }
    }

    &__blur {
      height: 32px;
      position: relative;
      top: 0px;
      transform: translateY(-50%);
      border-radius: 0 0 0.375rem 0.375rem;
      background: linear-gradient(180deg, transparent 0%, #28272d);
    }

    &__blur-container {
      position: sticky;
      z-index: 1;
      display: block;
      overflow: visible;
      left: 1px;
      right: 1px;
      pointer-events: none;
      transition: opacity 0.1s;
      bottom: 0;
      height: 3.5px;
      opacity: 1;
    }

    &__check {
      margin-left: auto;
    }
  }
</style>
