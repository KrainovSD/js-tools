<script setup lang="ts" generic="V extends string | number">
  import { debounce as debounceFn, isString, speedTest } from "@krainovsd/js-helpers";
  import fuzzysort from "fuzzysort";
  import { type Component, computed, onMounted, ref, useTemplateRef, watch } from "vue";
  import {
    INPUT_POPPER_TRIGGERS,
    SELECT_SCROLL_SHIFT_BOTTOM,
    SELECT_SCROLL_SHIFT_TOP,
  } from "../constants/tech";
  import { type HighlightText, createHighlight, waitParentAnimation } from "../lib";
  import Empty from "./Empty.vue";
  import type { InputProps } from "./Input.vue";
  import Input from "./Input.vue";
  import type { PopperProps } from "./Popper.vue";
  import Popper from "./Popper.vue";
  import type { SelectGroupItem, SelectItem } from "./Select.vue";

  // eslint-disable-next-line @typescript-eslint/no-redundant-type-constituents
  export type SearchItemFlat<V extends string | number> = SelectItem<V> & {
    title?: string | Component;
  };

  export type SearchItem<V extends string | number> = {
    value: V;
    label: string;
    labels: HighlightText[];
    desc?: string | Component;
    title: string | Component;
  };
  export type SearchGroupeItem<V extends string | number> = {
    title: string | Component;
    options: SearchItem<V>[];
  };

  export type SearchProps<V extends string | number> = {
    // eslint-disable-next-line @typescript-eslint/no-redundant-type-constituents
    options: (SelectItem<V> | SelectGroupItem<V>)[];
    threshold?: number;
    limit?: number;
    debounce?: number;
    autofocus?: boolean;
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
      | "nested"
      | "closeByClickOutsideEvent"
    >;

  interface SearchHTMLElement extends HTMLElement {
    next: SearchHTMLElement;
    prev: SearchHTMLElement;
    addActiveMark: (this: SearchHTMLElement) => void;
    removeActiveMark: (this: SearchHTMLElement) => void;
  }

  type Emits = {
    click: [key: V];
  };

  const GROUP_ROOT = "__root__";

  const props = withDefaults(defineProps<SearchProps<V>>(), {
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
    debounce: 0,
    limit: 50,
    autofocus: false,
  });
  const emit = defineEmits<Emits>();
  const model = defineModel<string>();
  const search = ref(model.value);
  const popperRef = useTemplateRef("popper");
  const inputComponentRef = useTemplateRef("input");
  const inputRef = computed(() => inputComponentRef.value?.element);
  const positionerContentRef = computed(() => popperRef.value?.positioner?.contentElement);
  const open = ref(false);

  const activeItem = ref<SearchHTMLElement | null>(null);
  const filteredGroupedOptions = computed(() => {
    return speedTest(
      () => {
        const filteredGroupedOptions: SearchGroupeItem<V>[] = [{ title: "", options: [] }];
        const groupsPositionMap = new Map<string | Component, number>();
        groupsPositionMap.set(GROUP_ROOT, 0);
        const flatOptions: SearchItemFlat<V>[] = [];

        for (let i = 0; i < props.options.length; i++) {
          const option = props.options[i];
          if ("title" in option) {
            filteredGroupedOptions.push({ options: [], title: option.title });
            groupsPositionMap.set(option.title, filteredGroupedOptions.length - 1);

            for (let j = 0; j < option.options.length; j++) {
              const singleOption = option.options[j];
              flatOptions.push({
                label: singleOption.label,
                value: singleOption.value,
                desc: singleOption.desc,
                title: option.title,
              });
            }
          } else {
            flatOptions.push({
              label: option.label,
              value: option.value,
              desc: option.desc,
              title: GROUP_ROOT,
            });
          }
        }

        const filteredOptions = fuzzysort
          .go(model.value ?? "", flatOptions, {
            threshold: props.threshold,
            limit: props.limit,
            key: "label",
            all: true,
          })
          .map((option) => {
            return {
              value: option.obj.value,
              labels: createHighlight(option.obj.label, option.indexes),
              label: option.obj.label,
              desc: option.obj.desc,
              title: option.obj.title ?? GROUP_ROOT,
            };
          });

        for (let i = 0; i < filteredOptions.length; i++) {
          const option = filteredOptions[i];
          const index = groupsPositionMap.get(option.title);

          if (index != undefined) {
            filteredGroupedOptions[index]?.options?.push?.(option);
          }
        }

        return filteredGroupedOptions;
      },
      { iterations: 1, name: "Fuzzy Search" },
    );
  });
  const empty = computed(
    () => !filteredGroupedOptions.value.some((group) => group.options.length > 0),
  );
  const setModel = debounceFn((search: string | undefined) => {
    model.value = search;
  }, props.debounce);

  function actionInputKeyboard(event: KeyboardEvent) {
    if (!open.value) {
      onOpen();

      return;
    }

    if (event.key === "Enter") {
      if (activeItem.value) {
        activeItem.value.click();
      }

      return;
    }

    if (event.key === "ArrowDown" && activeItem.value) {
      event.preventDefault();
      event.stopPropagation();
      const nextActive = activeItem.value.next;
      activeItem.value = nextActive;
      scrollToActive(nextActive);
    }
    if (event.key === "ArrowUp" && activeItem.value) {
      event.preventDefault();
      event.stopPropagation();
      const prevActive = activeItem.value.prev;
      activeItem.value = prevActive;
      scrollToActive(prevActive);
    }
  }
  function onClose() {
    open.value = false;
  }
  function onOpen() {
    open.value = true;
  }
  function onClick(value: V) {
    emit("click", value);
    onClose();
  }

  function scrollToActive(activeItem: SearchHTMLElement) {
    if (!positionerContentRef.value) return;

    let headerTop;
    const sibling = activeItem.previousElementSibling;
    if (
      sibling instanceof HTMLElement &&
      sibling.classList.contains("ksd-search__popper-item-header")
    ) {
      headerTop = sibling.offsetTop;
    }

    const itemTop = headerTop ?? activeItem.offsetTop;
    const itemBottom = activeItem.offsetTop + activeItem.offsetHeight;
    const containerTop: number = positionerContentRef.value.scrollTop;
    const containerBottom: number =
      (containerTop as number) + (positionerContentRef.value.clientHeight as number);

    if (itemTop < containerTop) {
      positionerContentRef.value.scrollTop =
        containerTop - (containerTop - itemTop) - SELECT_SCROLL_SHIFT_TOP;
    } else if (itemBottom > containerBottom) {
      positionerContentRef.value.scrollTop =
        containerTop + (itemBottom - containerBottom) + SELECT_SCROLL_SHIFT_BOTTOM;
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
    () => [positionerContentRef.value, filteredGroupedOptions.value],
    (_, __, clean) => {
      if (!positionerContentRef.value) return;

      const eventController = new AbortController();
      positionerContentRef.value.setAttribute("tabindex", "-1");
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

  watch(
    positionerContentRef,
    (positionerContentRef) => {
      if (!positionerContentRef) {
        search.value = "";
        model.value = "";
      }
    },
    { immediate: true },
  );

  /** Switch classes after change active item */
  watch(
    activeItem,
    (activeItem, oldValue) => {
      if (activeItem) {
        activeItem.addActiveMark();
      }
      if (oldValue) {
        oldValue.removeActiveMark();
      }
    },
    { immediate: true },
  );

  onMounted(() => {
    if (props.autofocus && inputRef.value) {
      void waitParentAnimation(inputRef.value).then(() => {
        if (!inputRef.value) return;
        inputRef.value.focus();
        open.value = true;
      });
    }
  });

  defineExpose({ popper: popperRef });
</script>

<template>
  <Popper
    ref="popper"
    v-model="open"
    role="listbox"
    :animation-appear="$props.animationAppear"
    :animation-disappear="$props.animationDisappear"
    :arrow="$props.arrow"
    :close-by-scroll="$props.closeByScroll"
    :fit="$props.fit"
    :close-delay="$props.closeDelay"
    :ignore-elements="$props.ignoreElements"
    :modal-root="$props.modalRoot"
    :nested="$props.nested"
    :close-by-click-outside-event="$props.closeByClickOutsideEvent"
    :observe="$props.observe"
    :open-delay="$props.openDelay"
    :shift-x="$props.shiftX"
    :shift-y="$props.shiftY"
    :placement="$props.placement"
    :z-index="$props.zIndex"
    :triggers="INPUT_POPPER_TRIGGERS"
    :class-name-positioner-content="`ksd-search__positioner-content ${$props.classNamePositionerContent ?? ''}`"
    :class="`ksd-search__positioner`"
  >
    <Input
      ref="input"
      :model-value="search"
      v-bind="$attrs"
      :status="$props.status"
      :variant="$props.variant"
      :size="$props.size"
      :autofocus="$props.autofocus"
      :allow-clear="$props.allowClear"
      :disabled="$props.disabled"
      :area-expanded="open"
      @update:model-value="
        (value) => {
          search = value;
          setModel(value);
        }
      "
      @keydown="actionInputKeyboard"
      @blur="onClose"
      @focus="onOpen"
    />

    <template #content>
      <template
        v-for="(group, groupIndex) of filteredGroupedOptions"
        :key="isString(group) ? group : groupIndex"
      >
        <template v-if="group.options.length > 0">
          <component :is="group.title" v-if="!isString(group.title)" />
          <div
            v-if="isString(group.title) && group.title.length > 0"
            class="ksd-search__popper-item-header"
          >
            {{ group.title }}
          </div>
          <div
            v-for="item of group.options"
            :key="item.value"
            class="ksd-search__popper-item"
            :aria-label="item.label"
            role="option"
            @click="onClick(item.value)"
          >
            <span class="ksd-search__popper-item-content">
              <template v-for="(label, index) of item.labels" :key="index">
                <b v-if="label.highlight">{{ label.text }}</b>
                <template v-else>{{ label.text }}</template>
              </template>
            </span>
          </div>
        </template>
      </template>

      <Empty v-if="empty" class="ksd-search__empty" />
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

    &__popper-item-header {
      position: relative;
      display: flex;
      min-height: var(--ksd-select-option-height);
      padding: var(--ksd-select-option-padding);
      color: var(--ksd-text-tertiary-color);
      font-weight: normal;
      font-size: var(--ksd-font-size-sm);
      line-height: var(--ksd-select-option-line-height);
      box-sizing: border-box;
      cursor: pointer;
      transition: background var(--ksd-transition-slow) ease;
      border-radius: var(--ksd-border-radius-sm);
      align-items: safe center;
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

    &__empty {
      padding: var(--ksd-padding-xs);
    }
  }
</style>
