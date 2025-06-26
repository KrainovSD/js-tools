<script setup lang="ts">
  import { createGlobalId, execAnimation } from "@krainovsd/js-helpers";
  import {
    VCheckCircleFilled,
    VCloseCircleFilled,
    VInfoCircleFilled,
    VLoadingOutlined,
  } from "@krainovsd/vue-icons";
  import { computed, provide, ref, shallowReactive, useTemplateRef } from "vue";
  import { SET_MESSAGE_INJECT_TOKEN } from "../hooks/useMessage";

  export type MessageType = "success" | "warning" | "error" | "info" | "loading";
  export type Message = {
    id: number;
    text: string;
    type?: MessageType;
    duration?: number;
  };
  export type MessageProps = {
    top?: string;
    left?: string;
    maxCount?: number;
    defaultDuration?: number;
    defaultType?: MessageType;
  };

  const props = withDefaults(defineProps<MessageProps>(), {
    left: "0",
    top: "20px",
    maxCount: 0,
    defaultDuration: 2,
    defaultType: "info",
  });
  const messageRef = useTemplateRef("message");
  const autoClosing = ref(0);
  const messages = shallowReactive<Message[]>([]);
  const styles = computed(() => ({ left: props.left, top: props.top }));

  async function closeMessage(messageId?: number) {
    if (messageId == undefined) return;

    const node = messageRef.value?.querySelector?.<HTMLElement>(
      `.ksd-message__item-wrap[data-id='${messageId}']`,
    );
    if (!node) {
      const index = messages.findIndex((message) => message.id === messageId);
      if (~index != 0) {
        messages.splice(index, 1);
      }

      return;
    }

    await execAnimation(node, "ksd-message__item-wrap-out");
    const index = messages.findIndex((message) => message.id === messageId);
    if (~index != 0) {
      messages.splice(index, 1);
    }
  }

  function createMessage(
    text: string,
    opts: Pick<Message, "duration" | "type"> & { id?: number } = {},
  ) {
    const messageId = opts.id ?? createGlobalId();
    const duration = opts.duration ?? props.defaultDuration;
    const type = opts.type ?? props.defaultType;

    if (opts.id == undefined) {
      messages.push({
        id: messageId,
        text,
        duration,
        type,
      });

      if (props.maxCount > 0 && messages.length > props.maxCount + autoClosing.value) {
        const closingId = autoClosing.value;
        autoClosing.value += 1;
        void closeMessage(messages[closingId]?.id).then(() => {
          autoClosing.value -= 1;
        });
      }
    } else {
      const index = messages.findIndex((message) => message.id === opts.id);
      if (~index != 0) {
        messages[index] = { id: opts.id, text, duration, type };
      }
    }

    if (opts.duration == undefined || opts.duration > 0) {
      setTimeout(
        () => {
          void closeMessage(messageId);
        },
        (opts.duration ?? props.defaultDuration) * 1000,
      );
    }

    return messageId;
  }

  provide(SET_MESSAGE_INJECT_TOKEN, createMessage);
  defineExpose({ createMessage });
</script>

<template>
  <div ref="message" v-bind="$attrs" class="ksd-message" :style="styles">
    <div
      v-for="message of messages"
      :key="message.id"
      :data-id="message.id"
      class="ksd-message__item-wrap"
    >
      <div class="ksd-message__item">
        <VCheckCircleFilled
          v-if="message.type === 'success'"
          :size="16"
          class="ksd-message__icon"
          :class="message.type"
        />
        <VCloseCircleFilled
          v-if="message.type === 'error'"
          :size="16"
          class="ksd-message__icon"
          :class="message.type"
        />
        <VInfoCircleFilled
          v-if="message.type === 'warning' || message.type === 'info'"
          :size="16"
          class="ksd-message__icon"
          :class="message.type"
        />
        <VLoadingOutlined
          v-if="message.type === 'loading'"
          :size="16"
          class="ksd-message__icon"
          :class="message.type"
        />
        <span class="ksd-message__text">{{ message.text }}</span>
      </div>
    </div>
  </div>
  <slot></slot>
</template>

<style lang="scss">
  .ksd-message {
    margin: 0;
    color: var(--ksd-text-main-color);
    font-size: var(--ksd-font-size);
    line-height: var(--ksd-line-height);
    list-style: none;
    font-family: var(--ksd-font-family);
    pointer-events: none;
    position: fixed;
    width: 100%;
    top: 8px;
    z-index: var(--ksd-message-z-index-popup);
    text-align: center;

    &__item-wrap {
      padding: var(--ksd-padding-xs);
      animation-name: ksd-message-in;
      animation-duration: var(--ksd-transition-slow);
      animation-timing-function: cubic-bezier(0.7, 0, 0.3, 1);
      overflow: visible;

      &-out {
        animation-name: ksd-message-out;
        animation-duration: var(--ksd-transition-slow);
        animation-timing-function: cubic-bezier(0.7, 0, 0.3, 1);
      }
    }

    &__item {
      display: inline-flex;
      padding: var(--ksd-message-content-padding);
      background: var(--ksd-message-content-bg);
      border-radius: var(--ksd-border-radius-lg);
      box-shadow: var(--ksd-shadow);
      pointer-events: all;
      gap: var(--ksd-margin-xs);
      align-items: center;
      max-width: 70%;
    }

    &__icon {
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
  }

  @keyframes ksd-message-in {
    from {
      opacity: 0;
      padding-top: 0px;
      padding-bottom: 0px;
      translate: 0% -80%;
    }
    to {
      opacity: 1;
      padding-top: var(--ksd-padding-xs);
      padding-bottom: var(--ksd-padding-xs);
      translate: 0% 0%;
    }
  }

  @keyframes ksd-message-out {
    from {
      opacity: 1;
      padding-top: var(--ksd-padding-xs);
      padding-bottom: var(--ksd-padding-xs);
      max-height: 150px;
    }
    to {
      opacity: 0;
      padding-top: 0px;
      padding-bottom: 0px;
      max-height: 0;
    }
  }
</style>
