<script setup lang="ts">
  import { speedTest } from "@krainovsd/js-helpers";
  import fuzzysort from "fuzzysort";
  import { computed, ref, useTemplateRef, watch } from "vue";
  import type { InputProps } from "./Input.vue";
  import Input from "./Input.vue";
  import type { PopperProps } from "./Popper.vue";
  import Popper from "./Popper.vue";

  interface SearchHTMLElement extends HTMLElement {
    next: SearchHTMLElement;
    prev: SearchHTMLElement;
    addActiveMark: (this: SearchHTMLElement) => void;
    removeActiveMark: (this: SearchHTMLElement) => void;
  }

  export type SearchOption = {
    label: string;
    key: number | string;
  };

  export type SearchProps = {
    options: SearchOption[];
    threshold?: number;
    limit?: number;
  } & Pick<InputProps, "allowClear" | "autofocus" | "disabled" | "size" | "status" | "variant"> &
    Pick<
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
    >;

  type Emits = {
    click: [key: string | number];
  };

  const props = withDefaults(defineProps<SearchProps>(), {
    allowClear: false,
    disabled: false,
    loading: false,
    size: "default",
    status: "default",
    variant: "outlined",
    animationAppear: "scaleY",
    animationDisappear: "scaleY",
    fit: false,
    placement: "bottom-left",
    openDelay: 0,
    threshold: 0.3,
    limit: 50,
  });
  const emit = defineEmits<Emits>();
  const model = defineModel<string>();
  const popperRef = useTemplateRef("popper");
  const positionerContentRef = computed(() => popperRef.value?.positioner?.positionerContentRef);
  const open = ref(false);
  const focusable = ref(false);

  const activeItem = ref<SearchHTMLElement | null>(null);
  const filteredOptions = computed(() => {
    return speedTest(
      () => {
        const filteredOptions = fuzzysort.go(model.value ?? "", props.options, {
          threshold: props.threshold,
          limit: props.limit,
          key: "label",
          all: true,
        });

        type HighlightText = {
          text: string;
          highlight: boolean;
        };

        function createHighlight(text: string, highlights: readonly number[]): HighlightText[] {
          if (highlights.length === 0) return [{ text, highlight: false }];

          const highlightedText: HighlightText[] = [];
          let lastProcessedIndex = 0;

          for (let i = 0; i < highlights.length; i++) {
            const currentIndex = highlights[i];

            if (currentIndex > lastProcessedIndex) {
              highlightedText.push({
                text: text.slice(lastProcessedIndex, currentIndex),
                highlight: false,
              });
            }

            let endIndex = currentIndex;
            while (i + 1 < highlights.length && highlights[i + 1] === endIndex + 1) {
              endIndex++;
              i++;
            }

            highlightedText.push({
              text: text.slice(currentIndex, endIndex + 1),
              highlight: true,
            });

            lastProcessedIndex = endIndex + 1;
          }

          if (lastProcessedIndex < text.length) {
            highlightedText.push({
              text: text.slice(lastProcessedIndex),
              highlight: false,
            });
          }

          return highlightedText;
        }

        return filteredOptions.map((option) => {
          return {
            key: option.obj.key,
            labels: createHighlight(option.obj.label, option.indexes),
            label: option.obj.label,
          };
        });
      },
      { name: "fuzzy-search", iterations: 1 },
    );
  });

  function actionInputKeyboard(event: KeyboardEvent) {
    if (event.key === "Enter") {
      if (!open.value) {
        open.value = true;

        return;
      }

      if (activeItem.value) {
        activeItem.value.click();
      }

      return;
    }

    if (event.key === "ArrowDown" && activeItem.value) {
      event.preventDefault();
      event.stopPropagation();
      activeItem.value = activeItem.value.next;
    }
    if (event.key === "ArrowUp" && activeItem.value) {
      event.preventDefault();
      event.stopPropagation();
      activeItem.value = activeItem.value.prev;
    }
  }

  /** Clear search after close positioner content */
  watch(
    positionerContentRef,
    (value) => {
      if (!value) {
        model.value = "";
      }
    },
    { immediate: true },
  );

  /** Collect interactive items */
  watch(
    () => [positionerContentRef.value, filteredOptions.value],
    (_, __, clean) => {
      if (!positionerContentRef.value || !open.value) return;

      const eventController = new AbortController();
      const contentItems = Array.from(
        positionerContentRef.value.querySelectorAll<SearchHTMLElement>(".ksd-search__popper-item"),
      );
      contentItems.forEach((element, index) => {
        let prevIndex = index - 1;
        let nextIndex = index + 1;
        if (prevIndex < 0) {
          prevIndex = contentItems.length - 1;
        }
        if (nextIndex >= contentItems.length) {
          nextIndex = 0;
        }

        element.prev = contentItems[prevIndex];
        element.next = contentItems[nextIndex];
        element.addActiveMark = addActiveMark.bind(element);
        element.removeActiveMark = removeActiveMark.bind(element);

        element.addEventListener("mousemove", actionMouseMove, { signal: eventController.signal });
      });
      activeItem.value = contentItems[0];

      function addActiveMark(this: SearchHTMLElement) {
        this.classList.add("active");
      }
      function removeActiveMark(this: SearchHTMLElement) {
        this.classList.remove("active");
      }

      function actionMouseMove(event: MouseEvent) {
        const currentTarget = event.currentTarget as SearchHTMLElement;
        activeItem.value = currentTarget;
      }

      clean(() => {
        eventController.abort();
      });
    },
    { immediate: true, flush: "post" },
  );

  /** Switch classes after change active item */
  watch(
    activeItem,
    (value, oldValue) => {
      if (value) {
        value.addActiveMark();
        value.scrollIntoView({ block: "nearest" });
      }
      if (oldValue) {
        oldValue.removeActiveMark();
      }
    },
    { immediate: true },
  );

  /** Close expand if not focusable */
  watch(
    open,
    (value) => {
      if (value && !focusable.value) {
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
    v-model="open"
    v-bind="$attrs"
    role="listbox"
    :animation-appear="$props.animationAppear"
    :animation-disappear="$props.animationDisappear"
    :arrow="$props.arrow"
    :close-by-scroll="$props.closeByScroll"
    :fit="$props.fit"
    :close-delay="$props.closeDelay"
    :ignore-elements="$props.ignoreElements"
    :modal-root="$props.modalRoot"
    :observe="$props.observe"
    :open-delay="$props.openDelay"
    :shift-x="$props.shiftX"
    :shift-y="$props.shiftY"
    :placement="$props.placement"
    :z-index="$props.zIndex"
    :class-name-positioner-content="`ksd-search__positioner-content ${$props.classNamePositionerContent ?? ''}`"
    :class="`ksd-search__positioner ${$attrs.class ?? ''}`"
  >
    <Input
      v-model="model"
      v-bind="$attrs"
      :status="$props.status"
      :variant="$props.variant"
      :size="$props.size"
      :autofocus="$props.autofocus"
      :allow-clear="$props.allowClear"
      :disabled="$props.disabled"
      :area-expanded="open"
      @keydown="actionInputKeyboard"
      @blur="
        () => {
          open = false;
          focusable = false;
        }
      "
      @focus="
        () => {
          focusable = true;
        }
      "
    />

    <template #content>
      <div
        v-for="item of filteredOptions"
        :key="item.key"
        class="ksd-search__popper-item"
        :aria-label="item.label"
        role="option"
        @click="
          () => {
            emit('click', item.key);
            open = false;
          }
        "
      >
        <span class="ksd-search__popper-item-content">
          <template v-for="(label, index) of item.labels" :key="index">
            <b v-if="label.highlight">{{ label.text }}</b>
            <template v-else>{{ label.text }}</template>
          </template>
        </span>
      </div>
    </template>
  </Popper>
</template>

<style lang="scss">
  div.ksd-search__positioner {
    z-index: var(--ksd-select-z-index);
    max-width: none;
  }

  .ksd-search {
    &__popper-item {
      position: relative;
      display: flex;
      min-height: var(--ksd-select-option-height);
      padding: var(--ksd-select-option-padding);
      color: var(--ksd-text-main-color);
      font-weight: normal;
      font-size: var(--ksd-select-option-font-size);
      line-height: var(--ksd-select-option-line-height);
      box-sizing: border-box;
      cursor: pointer;
      transition: background var(--ksd-transition-slow) ease;
      border-radius: var(--ksd-border-radius-sm);
      align-items: safe center;

      &.active {
        background-color: var(--ksd-select-option-active-bg);
      }
    }

    &__popper-item-content {
      flex: auto;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;

      & b {
        font-weight: 700;
      }
    }

    &__positioner-content {
      padding: var(--ksd-padding-xxs);
      max-width: none;
    }
  }
</style>
