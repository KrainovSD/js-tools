<script setup lang="ts">
  import { VExclamationCircleFilled } from "@krainovsd/vue-icons";
  import { computed, ref, useTemplateRef, watch } from "vue";
  import { createInteractiveChildrenController } from "../lib";
  import Button from "./Button.vue";
  import type { PopperProps } from "./Popper.vue";
  import Popper from "./Popper.vue";

  export type PopConfirmProps = {
    active?: boolean;
    title: string;
    text: string;
    okButton?: string;
    cancelButton?: string;
  } & Pick<
    PopperProps,
    | "animationAppear"
    | "animationDisappear"
    | "arrow"
    | "classNamePositionerContent"
    | "closeByScroll"
    | "closeDelay"
    | "fit"
    | "ignoreElements"
    | "modalRoot"
    | "observe"
    | "openDelay"
    | "shiftX"
    | "shiftY"
    | "placement"
    | "zIndex"
    | "nested"
    | "closeByClickOutsideEvent"
  >;
  type Emits = {
    click: [];
  };

  const props = withDefaults(defineProps<PopConfirmProps>(), {
    allowClear: false,
    disabled: false,
    loading: false,
    arrow: true,
    size: "default",
    status: "default",
    variant: "outlined",
    animationAppear: "scale",
    animationDisappear: "scale",
    fit: true,
    placement: "top-center",
    active: true,
    cancelButton: "Нет",
    okButton: "Да",
  });
  const emit = defineEmits<Emits>();
  const open = ref(false);
  const popperRef = useTemplateRef("popper");
  const positionerContentRef = computed(() => popperRef.value?.positioner?.positionerContentRef);
  const lastActive = ref<HTMLElement | null>(null);

  watch(
    positionerContentRef,
    (positionerContent, _, clean) => {
      if (!positionerContent) return;

      lastActive.value = document.activeElement as HTMLElement | null;
      positionerContent.focus();

      const interactiveChildrenController = createInteractiveChildrenController(positionerContent, {
        autofocus: true,
      });

      function actionKeyboard(event: KeyboardEvent) {
        if (event.key === "Escape") {
          open.value = false;
        }
        if (event.key === "Tab" || event.key === "ArrowRight" || event.key === "ArrowLeft") {
          event.preventDefault();

          if ((event.key === "Tab" && event.shiftKey) || event.key === "ArrowLeft") {
            interactiveChildrenController.focusPrev();
          } else {
            interactiveChildrenController.focusNext();
          }
        }
      }

      positionerContent.addEventListener("keydown", actionKeyboard);

      clean(() => {
        positionerContent.removeEventListener("keydown", actionKeyboard);
      });
    },
    { immediate: true },
  );

  watch(
    open,
    (value) => {
      if (!value && lastActive.value) {
        lastActive.value.focus();
        lastActive.value = null;
      }
      if (value && !props.active) {
        emit("click");
        open.value = false;
      }
    },
    { immediate: true },
  );

  defineExpose({ popper: popperRef });
</script>

<template>
  <Popper
    ref="popper"
    v-bind="$attrs"
    v-model="open"
    role="dialog"
    aria-modal="true"
    :animation-appear="$props.animationAppear"
    :animation-disappear="$props.animationDisappear"
    :arrow="$props.arrow"
    :close-by-scroll="$props.closeByScroll"
    :fit="$props.fit"
    :close-delay="$props.closeDelay"
    :ignore-elements="$props.ignoreElements"
    :modal-root="$props.modalRoot"
    :observe="$props.observe"
    :close-by-click-outside-event="$props.closeByClickOutsideEvent"
    :open-delay="$props.openDelay"
    :shift-x="$props.shiftX"
    :shift-y="$props.shiftY"
    :placement="$props.placement"
    :z-index="$props.zIndex"
    :nested="$props.nested"
    :class-name-positioner-content="`ksd-popconfirm__positioner-content ${$props.classNamePositionerContent ?? ''}`"
    :class="`ksd-popconfirm__positioner ${$attrs.class ?? ''}`"
  >
    <slot></slot>

    <template #content>
      <div class="ksd-popconfirm__content">
        <div class="ksd-popconfirm__content-body">
          <div class="ksd-popconfirm__content-body-icon">
            <VExclamationCircleFilled :size="14" />
          </div>
          <div class="ksd-popconfirm__content-body-info">
            <div class="ksd-popconfirm__content-body-title">{{ props.title }}</div>
            <div class="ksd-popconfirm__content-body-text">{{ props.text }}</div>
          </div>
        </div>
        <div class="ksd-popconfirm__content-footer">
          <Button size="small" @click="open = false">{{ props.cancelButton }}</Button>
          <Button
            size="small"
            type="primary"
            @click="
              () => {
                open = false;
                emit('click');
              }
            "
            >{{ props.okButton }}</Button
          >
        </div>
      </div>
    </template>
  </Popper>
</template>

<style lang="scss">
  div.ksd-popconfirm__positioner {
    z-index: var(--ksd-pop-confirm-z-index);
  }

  .ksd-popconfirm {
    &__positioner-content {
      padding: var(--ksd-pop-confirm-inner-padding);
    }

    &__content {
      font-size: var(--ksd-font-size);
    }
    &__content-body {
      margin-bottom: var(--ksd-margin-xs);
      display: flex;
      flex-wrap: nowrap;
      align-items: start;
    }
    &__content-body-icon {
      color: var(--ksd-warning-color);
      margin-inline-end: var(--ksd-margin-xs);
      display: flex;
      margin-block-start: 0.125em;

      & svg {
        margin-block: auto;
      }
    }

    &__content-body-title {
      font-weight: var(--ksd-font-weight-strong);
      color: var(--ksd-text-main-color);
    }
    &__content-body-text {
      margin-top: var(--ksd-margin-xxs);
      color: var(--ksd-text-main-color);
    }
    &__content-footer {
      text-align: end;
      white-space: nowrap;

      & button {
        margin-inline-start: var(--ksd-margin-xs);
      }
    }
  }
</style>
