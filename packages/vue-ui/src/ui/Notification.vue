<script setup lang="ts">
  import { createGlobalId, execAnimation } from "@krainovsd/js-helpers";
  import {
    VCheckCircleFilled,
    VCloseCircleFilled,
    VCloseOutlined,
    VInfoCircleFilled,
    VLoadingOutlined,
  } from "@krainovsd/vue-icons";
  import { computed, nextTick, provide, ref, shallowReactive, useTemplateRef, watch } from "vue";
  import { SET_NOTIFICATION_INJECT_TOKEN } from "../hooks";
  import Button from "./Button.vue";
  import IconWrapper from "./IconWrapper.vue";

  export type NotificationType =
    | "success"
    | "warning"
    | "error"
    | "info"
    | "loading"
    | "confirm"
    | "default";
  export type NotificationPosition =
    | "top-left"
    | "top-right"
    | "bottom-left"
    | "bottom-right"
    | "top"
    | "bottom";
  export type Notification = {
    id: number;
    text: string;
    title: string;
    type?: NotificationType;
    duration?: number;
    cancelButton?: string;
    okButton?: string;
    okButtonHandler?: (id: number) => void;
    cancelButtonHandler?: (id: number) => void;
    onClose?: (id: number) => void;
  };
  export type NotificationProps = {
    position?: NotificationPosition;
    maxCount?: number;
    defaultDuration?: number;
    defaultType?: NotificationType;
    defaultCancelButton?: string;
    defaultOkButton?: string;
  };

  const props = withDefaults(defineProps<NotificationProps>(), {
    defaultDuration: 4,
    defaultType: "error",
    maxCount: 3,
    position: "top-right",
    defaultCancelButton: "Нет",
    defaultOkButton: "Да",
  });
  const notificationRef = useTemplateRef("notification");
  const notifications = shallowReactive<Notification[]>([]);
  const hovered = ref(false);
  const squash = computed(
    () => props.maxCount > 0 && notifications.length >= props.maxCount && !hovered.value,
  );

  const componentClasses = computed(() => ({
    [props.position]: true,
    squash: squash.value,
  }));

  function updateTranslates() {
    const nodes = notificationRef.value?.querySelectorAll?.<HTMLElement>(
      `.ksd-notification__item-wrap`,
    );
    if (!nodes) return;

    let sumTranslate = 0;

    Array.from(nodes)
      .reverse()
      .forEach((node, index) => {
        if (index === 0) {
          node.style.transform = `translate3d(${props.position === "bottom" || props.position === "top" ? "-50%" : "0px"}, ${sumTranslate}px, 0px) scaleX(1)`;
        } else if (squash.value) {
          node.style.transform = `translate3d(${props.position === "bottom" || props.position === "top" ? "-50%" : "0px"}, ${sumTranslate}px, 0px) scaleX(${index === 1 ? 0.9583 : 0.9166})`;
        } else {
          node.style.transform = `translate3d(${props.position === "bottom" || props.position === "top" ? "-50%" : "0px"}, ${sumTranslate}px, 0px) scaleX(1)`;
        }

        if (!node.classList.contains("ksd-notification__item-wrap-out")) {
          if (squash.value) {
            if (index < 2) {
              if (
                props.position === "top" ||
                props.position === "top-left" ||
                props.position === "top-right"
              ) {
                sumTranslate += 8;
              } else {
                sumTranslate -= 8;
              }
            }
          } else if (
            props.position === "top" ||
            props.position === "top-left" ||
            props.position === "top-right"
          ) {
            sumTranslate += node.scrollHeight as number;
          } else {
            sumTranslate -= node.scrollHeight as number;
          }
        }
      });
  }

  function closeNotification(notificationId?: number) {
    if (notificationId == undefined) return;

    const node = notificationRef.value?.querySelector?.<HTMLElement>(
      `.ksd-notification__item-wrap[data-id='${notificationId}']`,
    );

    const index = notifications.findIndex((message) => message.id === notificationId);
    const notification = notifications[index];
    if (index === -1 || notification == undefined) return;

    if (!node || (squash.value && index < notifications.length - props.maxCount)) {
      if (notification.onClose) {
        notification.onClose(notification.id);
      }

      notifications.splice(index, 1);

      void nextTick(() => {
        updateTranslates();
      });
    } else {
      void execAnimation(node, "ksd-notification__item-wrap-out").then(() => {
        const index = notifications.findIndex((message) => message.id === notificationId);
        const notification = notifications[index];
        if (index === -1 || notification == undefined) return;

        if (notification.onClose) {
          notification.onClose(notification.id);
        }

        notifications.splice(index, 1);

        void nextTick(() => {
          updateTranslates();
        });
      });
    }
  }

  function createNotification(
    text: string,
    title: string,
    opts: Pick<
      Notification,
      | "duration"
      | "type"
      | "cancelButton"
      | "okButton"
      | "cancelButtonHandler"
      | "okButtonHandler"
      | "onClose"
    > & {
      id?: number;
    } = {},
  ) {
    const messageId = opts.id ?? createGlobalId();
    const duration = opts.duration ?? props.defaultDuration;
    const type = opts.type ?? props.defaultType;
    const okButton = opts.okButton ?? props.defaultOkButton;
    const cancelButton = opts.cancelButton ?? props.defaultCancelButton;

    if (opts.id == undefined) {
      notifications.push({
        id: messageId,
        text,
        title,
        duration,
        type,
        cancelButton,
        okButton,
        cancelButtonHandler: opts.cancelButtonHandler,
        okButtonHandler: opts.okButtonHandler,
        onClose: opts.onClose,
      });
    } else {
      const index = notifications.findIndex((message) => message.id === opts.id);
      if (~index != 0) {
        notifications[index] = {
          id: opts.id,
          text,
          duration,
          type,
          title,
          cancelButton,
          okButton,
          cancelButtonHandler: opts.cancelButtonHandler,
          okButtonHandler: opts.okButtonHandler,
          onClose: opts.onClose,
        };
      }
    }

    void nextTick(() => {
      updateTranslates();
    });

    if (opts.duration == undefined || opts.duration > 0) {
      setTimeout(
        () => {
          void closeNotification(messageId);
        },
        (opts.duration ?? props.defaultDuration) * 1000,
      );
    }

    return messageId;
  }

  /** Update translate by change squash state */
  watch(
    squash,
    () => {
      updateTranslates();
    },
    { immediate: true },
  );
  /** Clear hovered state when empty notifications */
  watch(
    notifications,
    (value) => {
      if (value.length === 0) {
        hovered.value = false;
      }
    },
    { immediate: true },
  );

  provide(SET_NOTIFICATION_INJECT_TOKEN, createNotification);
  defineExpose({ createNotification });
</script>

<template>
  <div
    ref="notification"
    class="ksd-notification"
    :class="componentClasses"
    @mouseenter="
      () => {
        hovered = true;
      }
    "
    @mouseleave="
      () => {
        hovered = false;
      }
    "
  >
    <div
      v-for="notification of notifications"
      :key="notification.id"
      class="ksd-notification__item-wrap"
      :class="componentClasses"
      :data-id="notification.id"
      role="alert"
    >
      <div class="ksd-notification__item">
        <VCheckCircleFilled
          v-if="notification.type === 'success'"
          class="ksd-notification__icon"
          :class="notification.type"
        />
        <VCloseCircleFilled
          v-if="notification.type === 'error'"
          class="ksd-notification__icon"
          :class="notification.type"
        />
        <VInfoCircleFilled
          v-if="notification.type === 'warning' || notification.type === 'info'"
          class="ksd-notification__icon"
          :class="notification.type"
        />
        <VLoadingOutlined
          v-if="notification.type === 'loading'"
          class="ksd-notification__icon"
          :class="notification.type"
        />
        <div class="ksd-notification__item-content">
          <div class="ksd-notification__item-header">
            <span class="ksd-notification__item-title">{{ notification.title }}</span>
            <IconWrapper
              class="ksd-notification__item-close"
              @click="closeNotification(notification.id)"
              ><VCloseOutlined
            /></IconWrapper>
          </div>
          <span class="ksd-notification__item-text">{{ notification.text }}</span>
          <div v-if="notification.type === 'confirm'" class="ksd-notification__item-footer">
            <Button
              type="text"
              size="small"
              @click="
                () => {
                  notification.cancelButtonHandler?.(notification.id);
                  closeNotification(notification.id);
                }
              "
              >{{ notification.cancelButton }}</Button
            >
            <Button
              type="primary"
              size="small"
              @click="
                () => {
                  notification.okButtonHandler?.(notification.id);
                  closeNotification(notification.id);
                }
              "
              >{{ notification.okButton }}</Button
            >
          </div>
        </div>
      </div>
    </div>
  </div>
  <slot></slot>
</template>

<style lang="scss">
  .ksd-notification {
    color: var(--ksd-text-main-color);
    font-size: var(--ksd-font-size);
    line-height: var(--ksd-line-height);
    list-style: none;
    font-family: var(--ksd-font-family);
    position: fixed;
    z-index: var(--ksd-notification-z-index);
    margin-right: var(--ksd-margin-lg);

    &:where(.top-right) {
      inset: var(--ksd-notification-block-margin) var(--ksd-notification-inline-margin) auto auto;
    }
    &.top-left {
      inset: var(--ksd-notification-block-margin) auto auto var(--ksd-notification-inline-margin);
    }
    &.top {
      inset: var(--ksd-notification-block-margin) auto auto 50%;
      translate: -50% 0;
    }
    &.bottom-right {
      inset: auto var(--ksd-notification-inline-margin) var(--ksd-notification-block-margin) auto;
    }
    &.bottom-left {
      inset: auto auto var(--ksd-notification-block-margin) var(--ksd-notification-inline-margin);
    }
    &.bottom {
      inset: auto auto var(--ksd-notification-block-margin) 50%;
      translate: -50% 0;
    }

    &__item-wrap {
      margin-inline-start: auto;
      background: var(--ksd-bg-notice-color);
      border-radius: var(--ksd-border-radius-lg);
      box-shadow: var(--ksd-shadow);
      overflow: unset;
      position: absolute;
      margin-bottom: var(--ksd-margin);
      transition:
        transform var(--ksd-transition-mid),
        backdrop-filter 0s;
      will-change: translate, scale, opacity;

      &::after {
        content: "";
        position: absolute;
        height: var(--ksd-margin);
        width: 100%;
        inset-inline: 0;
        bottom: calc(var(--ksd-margin) * -1);
        background: transparent;
        pointer-events: auto;
      }

      &:where(.top-right) {
        inset: 0 0 auto auto;
        animation: ksd-notification-in-right var(--ksd-transition-mid) cubic-bezier(0.7, 0, 0.3, 1);
      }
      &:where(.top-left) {
        inset: 0 auto auto 0;
        animation: ksd-notification-in-left var(--ksd-transition-mid) cubic-bezier(0.7, 0, 0.3, 1);
      }
      &:where(.top) {
        inset: 0 auto auto 0;
        animation: ksd-notification-in-top var(--ksd-transition-mid) cubic-bezier(0.7, 0, 0.3, 1);
      }
      &:where(.bottom-right) {
        inset: auto 0 0 auto;
        animation: ksd-notification-in-right var(--ksd-transition-mid) cubic-bezier(0.7, 0, 0.3, 1);
      }
      &:where(.bottom-left) {
        inset: auto auto 0 0;
        animation: ksd-notification-in-left var(--ksd-transition-mid) cubic-bezier(0.7, 0, 0.3, 1);
      }
      &:where(.bottom) {
        inset: auto auto 0 0;
        animation: ksd-notification-in-bottom var(--ksd-transition-mid) cubic-bezier(0.7, 0, 0.3, 1);
      }

      &:not(:last-child):where(.squash) {
        background: var(--ksd-notification-blur-bg-color);
        backdrop-filter: blur(10px);
        -webkit-backdrop-filter: blur(10px);
      }

      &:where(.squash):not(:nth-last-child(-n + 3)) {
        opacity: 0;
        overflow: hidden;
        color: transparent;
        pointer-events: none;
      }

      &-out {
        animation: ksd-notification-out var(--ksd-transition-mid) cubic-bezier(0.7, 0, 0.3, 1);
      }
    }

    &__item {
      padding: var(--ksd-padding-md) var(--ksd-padding-lg);
      width: var(--ksd-notification-width);
      max-width: calc(100vw - calc(var(--ksd-margin-lg) * 2));
      overflow: hidden;
      line-height: var(--ksd-line-height);
      word-wrap: break-word;
      display: flex;
      align-items: flex-start;
      gap: var(--ksd-margin-sm);
    }

    &__item-content {
      display: flex;
      flex-direction: column;
      width: 100%;
      gap: var(--ksd-margin-xs);
    }

    &__item-header {
      display: flex;
      align-items: flex-start;
    }

    &__item-title {
      font-size: var(--ksd-font-size-lg);
      padding-inline-end: var(--ksd-padding-lg);
    }

    &__item-close {
      margin-inline-start: auto;
      font-size: var(--ksd-font-size);
      color: var(--ksd-icon-color);
      translate: 0%
        calc((var(--ksd-font-size-lg) * var(--ksd-line-height) - var(--ksd-font-size)) / 2);
    }

    &__item-text {
      font-size: var(--ksd-font-size);
    }

    &__icon {
      font-size: calc(var(--ksd-font-size-lg) * var(--ksd-line-height));

      &.success {
        color: var(--ksd-success-color);
      }
      &.info {
        color: var(--ksd-info-color);
      }
      &.error {
        color: var(--ksd-error-color);
      }
      &.loading {
        color: var(--ksd-info-color);
      }
      &.warning {
        color: var(--ksd-warning-color);
      }
    }

    &__item-footer {
      display: flex;
      gap: var(--ksd-padding-xs);
      margin-top: var(--ksd-margin-xxs);
      align-self: flex-end;
    }
  }

  @keyframes ksd-notification-in-right {
    from {
      opacity: 0;
      transform: translate3d(100%, 0px, 0px);
    }
    to {
      opacity: 1;
      transform: translate3d(0%, 0px, 0px);
    }
  }

  @keyframes ksd-notification-in-left {
    from {
      opacity: 0;
      transform: translate3d(-100%, 0px, 0px);
    }
    to {
      opacity: 1;
      transform: translate3d(0%, 0px, 0px);
    }
  }

  @keyframes ksd-notification-in-top {
    from {
      opacity: 0;
      transform: translate3d(-50%, -100%, 0px);
    }
    to {
      opacity: 1;
      transform: translate3d(-50%, 0px, 0px);
    }
  }

  @keyframes ksd-notification-in-bottom {
    from {
      opacity: 0;
      transform: translate3d(-50%, 100%, 0px);
    }
    to {
      opacity: 1;
      transform: translate3d(-50%, 0px, 0px);
    }
  }

  @keyframes ksd-notification-out {
    from {
      opacity: 1;
      max-height: 150px;
      margin-bottom: var(--ksd-margin);
    }
    to {
      opacity: 0;
      max-height: 0;
      margin-bottom: 0;
    }
  }
</style>
