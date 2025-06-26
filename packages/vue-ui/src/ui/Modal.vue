<script setup lang="ts">
  import { execAnimation } from "@krainovsd/js-helpers";
  import { VCloseOutlined } from "@krainovsd/vue-icons";
  import { computed, ref, useTemplateRef, watch } from "vue";
  import Button from "./Button.vue";

  export type ModalProps = {
    header: string;
    ignoreCloseByClick?: HTMLElement[];
    target?: HTMLElement;
    zIndex?: number;
    className?: string;
    okButton?: string;
    cancelButton?: string;
  };
  export type Emit = {
    close: [];
    cancel: [];
    confirm: [];
  };

  const props = withDefaults(defineProps<ModalProps>(), {
    cancelButton: "Отменить",
    okButton: "Применить",
    ignoreCloseByClick: undefined,
    className: undefined,
    target: undefined,
    zIndex: undefined,
  });
  const emit = defineEmits<Emit>();
  const open = defineModel<boolean>();
  const maskStyles = computed(() => ({ zIndex: props.zIndex }));
  const modalRef = useTemplateRef("modal");
  const modalMaskRef = useTemplateRef("mask");
  const prevActiveElement = ref<HTMLElement | null>(null);

  function onClose() {
    if (prevActiveElement.value) {
      prevActiveElement.value.focus();
    }

    void Promise.all([
      execAnimation(modalRef.value, "ksd-modal_out"),
      execAnimation(modalMaskRef.value, "ksd-modal__mask_out"),
    ]).then(() => {
      open.value = false;
      emit("close");
    });
  }
  function onConfirm() {
    emit("confirm");
    onClose();
  }
  function onCancel() {
    emit("cancel");
    onClose();
  }

  watch(
    open,
    (value) => {
      if (!value) return;

      document.addEventListener(
        "mouseover",
        (event) => {
          if (modalRef.value) {
            modalRef.value.style.transformOrigin = `${event.clientX - modalRef.value.offsetLeft}px ${event.clientY - modalRef.value.offsetTop}px`;
          }
        },
        { once: true },
      );
    },
    { immediate: true, flush: "pre" },
  );

  watch(
    modalRef,
    (modalRef, _, clean) => {
      if (!modalRef) return;

      const eventController = new AbortController();
      prevActiveElement.value = document.activeElement as HTMLElement | null;
      const focusableElements = modalRef.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
      );
      const firstFocusable = focusableElements.item(0) as HTMLElement | null;
      if (firstFocusable) {
        firstFocusable.focus();
      }

      function actionClick(event: MouseEvent | TouchEvent) {
        const node = event.target as HTMLElement;
        if (node.closest("[ksd-popper]")) {
          return;
        }

        if (
          modalRef?.contains?.(node) ||
          props.ignoreCloseByClick?.some?.((element) => element?.contains?.(node))
        ) {
          return;
        }

        onClose();
      }

      let focusableIndex = 0;
      function actionKeyBoard(event: KeyboardEvent) {
        if (event.key === "Escape") {
          event.stopPropagation();
          onClose();
        }
        if (focusableElements.length > 0 && event.key === "Tab") {
          event.preventDefault();
          if (event.shiftKey) {
            focusableIndex--;
          } else {
            focusableIndex++;
          }

          if (focusableIndex < 0) {
            focusableIndex = focusableElements.length - 1;
          } else if (focusableIndex >= focusableElements.length) {
            focusableIndex = 0;
          }

          const element = focusableElements.item(focusableIndex) as HTMLElement;
          element.focus();
        }
      }

      document.addEventListener("mousedown", actionClick, { signal: eventController.signal });
      document.addEventListener("touchstart", actionClick, { signal: eventController.signal });
      document.addEventListener("pointerdown", actionClick, { signal: eventController.signal });
      modalRef.addEventListener("keydown", actionKeyBoard, { signal: eventController.signal });

      clean(() => {
        eventController.abort();
      });
    },
    { immediate: true },
  );

  defineExpose({ modalRef });
</script>

<template>
  <Teleport v-if="open" :to="$props.target ?? '#storybook-root'">
    <div ref="mask" class="ksd-modal__mask" :class="$props.className" :style="maskStyles">
      <div
        ref="modal"
        v-bind="$attrs"
        role="dialog"
        aria-modal="true"
        class="ksd-modal"
        :class="[$attrs.class, $props.className]"
      >
        <div class="ksd-modal__header">
          <slot v-if="$slots.header" name="header"></slot>
          <span v-else class="ksd-modal__title">{{ $props.header }}</span>
          <Button type="text" class="ksd-modal__close" @click="onClose">
            <template #icon>
              <VCloseOutlined />
            </template>
          </Button>
        </div>
        <div class="ksd-modal__body">
          <slot></slot>
        </div>
        <div class="ksd-modal__footer">
          <slot v-if="$slots.footer" name="footer"></slot>
          <template v-else>
            <Button @click="onConfirm">{{ $props.cancelButton }}</Button>
            <Button type="primary" @click="onCancel">{{ $props.okButton }}</Button></template
          >
        </div>
      </div>
    </div>
  </Teleport>
</template>

<style lang="scss">
  .ksd-modal {
    margin: 0 auto;
    color: var(--ksd-text-main-color);
    font-size: var(--ksd-font-size);
    line-height: var(--ksd-line-height);
    list-style: none;
    font-family: var(--ksd-font-family);
    position: relative;
    top: var(--ksd-modal-margin-block);
    max-width: calc(100vw - calc(var(--ksd-margin) * 2));
    margin-bottom: var(--ksd-margin-lg);
    width: fit-content;
    max-width: 70%;
    background-color: var(--ksd-modal-content-bg);
    background-clip: padding-box;
    border: 0;
    border-radius: var(--ksd-border-radius-lg);
    box-shadow: var(--ksd-shadow);
    padding: var(--ksd-modal-content-padding);
    max-height: calc(100% - var(--ksd-modal-margin-block) * 2);
    overflow: hidden;
    display: flex;
    flex-direction: column;
    animation: ksd-modal-in var(--ksd-transition-slow) cubic-bezier(0.22, 1, 0.28, 0.8);

    &_out {
      animation: ksd-modal-out var(--ksd-transition-mid) cubic-bezier(0.22, 1, 0.28, 0.8);
    }

    &__mask {
      z-index: var(--ksd-modal-z-index);
      position: fixed;
      inset: 0;
      height: 100%;
      background-color: var(--ksd-bg-mask-color);
      font-family: var(--ksd-font-family);
      font-size: var(--ksd-font-size);
      overflow: auto;
      animation: ksd-modal-mask-in var(--ksd-transition-mid) linear;
      &_out {
        animation: ksd-modal-mask-out var(--ksd-transition-mid) linear;
      }
    }
    &__header {
      color: var(--ksd-text-main-color);
      background: var(--ksd-modal-header-bg);
      border-radius: var(--ksd-border-radius-lg) var(--ksd-border-radius-lg) 0 0;
      margin-bottom: var(--ksd-modal-header-margin-bottom);
      padding: var(--ksd-modal-header-padding);
      border-bottom: var(--ksd-modal-header-border-bottom);
      display: flex;
    }
    &__title {
      margin: 0;
      color: var(--ksd-modal-title-color);
      font-weight: var(--ksd-font-weight-strong);
      font-size: var(--ksd-modal-title-font-size);
      line-height: var(--ksd-modal-title-line-height);
      word-wrap: break-word;
      flex: 1;
    }
    &__close {
      margin-inline-start: auto;
      position: relative;
      top: calc(
        ((32px - (var(--ksd-modal-title-font-size) * var(--ksd-modal-title-line-height))) / 2) * -1
      );
    }
    &__body {
      font-size: var(--ksd-font-size);
      line-height: var(--ksd-line-height);
      word-wrap: break-word;
      padding: var(--ksd-modal-body-padding);
      overflow: auto;
      display: flex;
    }
    &__footer {
      text-align: end;
      background: var(--ksd-modal-footer-bg);
      margin-top: var(--ksd-modal-footer-margin-top);
      padding: var(--ksd-modal-footer-padding);
      border-top: var(--ksd-modal-footer-border-top);
      border-radius: var(--ksd-modal-footer-border-radius);
      display: flex;
      gap: var(--ksd-margin-xs);
      align-items: center;
      justify-content: flex-end;
    }
  }

  @keyframes ksd-modal-mask-in {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }

  @keyframes ksd-modal-mask-out {
    from {
      opacity: 1;
    }
    to {
      opacity: 0;
    }
  }

  @keyframes ksd-modal-in {
    from {
      transform: scale(0.2);
      opacity: 0;
    }
    to {
      transform: scale(1);
      opacity: 1;
    }
  }

  @keyframes ksd-modal-out {
    from {
      transform: scale(1);
      opacity: 1;
    }
    to {
      transform: scale(0.2);
      opacity: 0;
    }
  }
</style>
