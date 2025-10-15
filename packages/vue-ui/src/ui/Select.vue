<script setup lang="ts" generic="Multiple extends true | false = false">
  import { createGlobalId, isArray, isString } from "@krainovsd/js-helpers";
  import {
    VCheckOutlined,
    VCloseCircleFilled,
    VCloseOutlined,
    VDownOutlined,
    VLoadingOutlined,
    VSearchOutlined,
  } from "@krainovsd/vue-icons";
  import {
    type Component,
    type HTMLAttributes,
    computed,
    onMounted,
    ref,
    useTemplateRef,
    watch,
  } from "vue";
  import { SELECT_SCROLL_SHIFT_BOTTOM, SELECT_SCROLL_SHIFT_TOP } from "../constants/tech";
  import Empty from "./Empty.vue";
  import IconWrapper from "./IconWrapper.vue";
  import Popper, { type PopperProps, type PopperTrigger } from "./Popper.vue";

  export type SelectValue = string | number;

  export type SelectItem = {
    label: string;
    value: SelectValue;
    desc?: string | Component;
  };
  export type SelectGroupItem = {
    title: string | Component;
    options: SelectItem[];
  };

  export interface SelectHTMLElement extends HTMLElement {
    next: SelectHTMLElement;
    prev: SelectHTMLElement;
    valueKey: string | undefined | null;
    addActiveMark: (this: SelectHTMLElement) => void;
    removeActiveMark: (this: SelectHTMLElement) => void;
  }

  export type SelectVariant = "filled" | "borderless" | "underline" | "outlined";
  export type SelectSize = "default" | "large" | "small";
  export type SelectStatus = "error" | "warning" | "success" | "default";

  export type SelectProps<Multiple extends true | false> = {
    variant?: SelectVariant;
    size?: SelectSize;
    status?: SelectStatus;
    search?: boolean;
    clear?: boolean;
    disabled?: boolean;
    loading?: boolean;
    autofocus?: boolean;
    multiple?: Multiple;
    placeholder?: string;
    options: (SelectItem | SelectGroupItem)[];
    labelOptions?: (SelectItem | SelectGroupItem)[];
    searchFn?: (item: SelectItem, search: string) => boolean;
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
    | "closeByClickOutsideEvent"
    | "nested"
  > &
    /*@vue-ignore*/ HTMLAttributes;

  type Value = Multiple extends false
    ? SelectValue | null | undefined
    : SelectValue[] | null | undefined;

  const TRIGGERS: PopperTrigger[] = [];

  const props = withDefaults(defineProps<SelectProps<Multiple>>(), {
    clear: true,
    search: true,
    disabled: false,
    loading: false,
    placeholder: undefined,
    size: "default",
    status: "default",
    variant: "outlined",
    animationAppear: "scaleY",
    animationDisappear: "scaleY",
    fit: false,
    autofocus: false,
    placement: "bottom-left",
    openDelay: 0,
    searchFn: undefined,
    labelOptions: undefined,
  });
  const model = defineModel<Value>({ default: undefined });
  const popperRef = useTemplateRef("popper");
  const positionerContentRef = computed(() => popperRef.value?.positioner?.contentElement);

  const open = ref(false);
  const focusable = ref(false);
  const searchValue = ref("");
  const emptySearch = computed(() => searchValue.value.length === 0);
  const componentId = createGlobalId();
  const filledModel = computed(() =>
    isArray(model.value) ? model.value.length > 0 : model.value != undefined,
  );

  const commonClasses = computed(() => ({
    [`variant-${props.variant}`]: true,
    [`size-${props.size}`]: true,
    [`status-${props.status}`]: true,
    search: props.search,
    multiple: props.multiple,
    disabled: props.disabled,
    loading: props.loading,
    opened: open.value,
    filled: filledModel.value,
  }));
  const searchWidth = ref(4);

  const searchIcon = computed(() => focusable.value && props.search);
  const cancelIcon = computed(() => props.clear && filledModel.value && !props.disabled);
  const loadingIcon = computed(() => props.loading);
  const inputRef = useTemplateRef("input");
  const filteredGroupedOptions = computed<SelectGroupItem[]>(() => {
    const filteredGroupedOptions: SelectGroupItem[] = [{ title: "", options: [] }];

    for (let i = 0; i < props.options.length; i++) {
      const option = props.options[i];
      if ("title" in option) {
        filteredGroupedOptions.push({
          title: option.title,
          options: option.options.filter((option) => {
            if (props.searchFn) {
              return props.searchFn(option, searchValue.value);
            }

            return option.label.toLowerCase().includes(searchValue.value.toLowerCase());
          }),
        });
      } else {
        const isMatched = props.searchFn
          ? props.searchFn(option, searchValue.value)
          : option.label.toLowerCase().includes(searchValue.value.toLowerCase());
        if (isMatched) {
          filteredGroupedOptions[0].options.push(option);
        }
      }
    }

    return filteredGroupedOptions;
  });
  const activeItem = ref<SelectHTMLElement | null>(null);
  const optionsMap = computed(() => {
    const optionsMap: Record<string, SelectItem> = {};

    function extractValueRecursively(options: (SelectItem | SelectGroupItem)[]) {
      for (let i = 0; i < options.length; i++) {
        const option = options[i];
        if ("title" in option) {
          extractValueRecursively(option.options);
        } else {
          optionsMap[option.value] = option;
        }
      }
    }

    extractValueRecursively(props.labelOptions ?? props.options);

    return optionsMap;
  });
  const selectedItems = computed<SelectItem[]>(() => {
    if (model.value == undefined) {
      return [];
    }
    if (isArray(model.value)) {
      return model.value.map((value) => {
        const label = optionsMap.value[value.toString()]?.label;

        return { label: label ?? value, value };
      });
    }

    const label = optionsMap.value[model.value.toString()]?.label;

    return [{ label: label ?? model.value, value: model.value }];
  });
  const empty = computed(
    () => !filteredGroupedOptions.value.some((options) => options.options.length > 0),
  );

  function isComponent(component: string | undefined | Component) {
    if (component != undefined && typeof component !== "string") return true;

    return false;
  }

  function selectValue(selectedValue: SelectValue | undefined | null) {
    if (!props.multiple && selectedValue != undefined) {
      model.value = selectedValue as Value;
      open.value = false;
    } else if (selectedValue != undefined) {
      const nextValue: SelectValue[] = isArray(model.value)
        ? ([...model.value] as SelectValue[])
        : [];
      const indexValue = nextValue.findIndex((val) => val === selectedValue);
      if (~indexValue != 0) {
        nextValue.splice(indexValue, 1);
      } else {
        nextValue.push(selectedValue);
      }

      model.value = nextValue as Value;
    }
  }

  function actionInputKeyboard(event: KeyboardEvent) {
    if (event.key === "ArrowDown") {
      open.value = true;
    }
    if (event.key === "Enter") {
      if (!open.value) {
        open.value = true;

        return;
      }

      if (activeItem?.value?.valueKey != undefined) {
        selectValue(optionsMap.value[activeItem.value.valueKey]?.value);
      }

      return;
    }
    if (event.key === "Tab" && open.value) {
      event.preventDefault();
      event.stopPropagation();
      if (activeItem?.value?.valueKey != undefined) {
        selectValue(optionsMap.value[activeItem.value.valueKey]?.value);
      }
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
  function onClearValue() {
    model.value = undefined as Value;
    inputRef.value?.focus?.();
  }

  function scrollToActive(activeItem: SelectHTMLElement) {
    if (!positionerContentRef.value) return;

    let headerTop;
    const sibling = activeItem.previousElementSibling;
    if (
      sibling instanceof HTMLElement &&
      sibling.classList.contains("ksd-select__popper-item-header")
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

  /** Collect interactive items */
  watch(
    () => [positionerContentRef.value, filteredGroupedOptions.value],
    (_, __, clean) => {
      if (!positionerContentRef.value || !open.value) return;

      const eventController = new AbortController();
      const contentItems = Array.from(
        positionerContentRef.value.querySelectorAll<SelectHTMLElement>(".ksd-select__popper-item"),
      );
      let findActive = false;
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
        const value = element.getAttribute("data-value");
        element.valueKey = value;

        if (isArray(model.value) && model.value[model.value.length - 1] == value) {
          activeItem.value = element;
          findActive = true;
        }
        if (model.value == value) {
          activeItem.value = element;
          findActive = true;
        }

        element.addEventListener("mousemove", actionMouseMove, { signal: eventController.signal });
        // element.addEventListener("click", actionClick, { signal: eventController.signal });
        element.addEventListener("mousedown", actionClick, { signal: eventController.signal });
      });
      if (!findActive) {
        activeItem.value = contentItems[0];
      }

      function addActiveMark(this: SelectHTMLElement) {
        this.classList.add("active");
      }
      function removeActiveMark(this: SelectHTMLElement) {
        this.classList.remove("active");
      }

      function actionMouseMove(event: MouseEvent) {
        const currentTarget = event.currentTarget as SelectHTMLElement;
        activeItem.value = currentTarget;
      }

      function actionClick(event: MouseEvent) {
        if (props.multiple) {
          event.preventDefault();
        }

        const currentTarget = event.currentTarget as SelectHTMLElement;
        if (currentTarget.valueKey) {
          selectValue(optionsMap.value[currentTarget.valueKey]?.value);
        }
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

  /** Clear search after close positioner content */
  watch(
    positionerContentRef,
    (positionerContentRef) => {
      if (!positionerContentRef) {
        searchValue.value = "";
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

  /** Resize input in multiple mode */
  watch(
    searchValue,
    (search) => {
      if (!props.multiple || !inputRef.value) return;

      inputRef.value.style.width = `0px`;
      searchWidth.value = search.length > 0 ? inputRef.value.scrollWidth : 4;
      inputRef.value.style.width = `100%`;
    },
    { immediate: true },
  );

  onMounted(() => {
    if (props.autofocus && inputRef.value) {
      inputRef.value.focus();
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
    :triggers="TRIGGERS"
    :fit="$props.fit"
    :close-delay="$props.closeDelay"
    :close-by-click-outside-event="$props.closeByClickOutsideEvent"
    :nested="$props.nested"
    :ignore-elements="$props.ignoreElements"
    :modal-root="$props.modalRoot"
    :observe="$props.observe || $props.multiple"
    :open-delay="$props.openDelay"
    :shift-x="$props.shiftX"
    :shift-y="$props.shiftY"
    :placement="$props.placement"
    :z-index="$props.zIndex"
    :class-name-positioner-content="`ksd-select__popper ${$props.classNamePositionerContent ?? ''}`"
    :class="`ksd-select__positioner`"
  >
    <div
      class="ksd-select"
      :class="commonClasses"
      v-bind="$attrs"
      @click="
        () => {
          if (!props.disabled) {
            inputRef?.focus?.();
            open = true;
          }
        }
      "
      @mousedown.prevent.stop=""
    >
      <div class="ksd-select__selector" :class="commonClasses">
        <span class="ksd-select__wrap" :class="commonClasses">
          <template v-if="!$props.multiple">
            <span class="ksd-select__selection-search" :class="commonClasses">
              <input
                :id="`ksd-select-${componentId}`"
                ref="input"
                v-model="searchValue"
                autocomplete="off"
                class="ksd-select__selection-search-input"
                role="combobox"
                aria-haspopup="listbox"
                aria-autocomplete="list"
                type="search"
                :class="commonClasses"
                :readonly="!props.search || $props.disabled"
                :disabled="props.disabled"
                :aria-expanded="open"
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
            </span>
            <span
              v-if="filledModel && emptySearch"
              class="ksd-select__selection-item"
              :class="commonClasses"
              >{{ selectedItems[0]?.label }}</span
            >
            <span
              v-if="!filledModel && emptySearch"
              class="ksd-select__selection-placeholder"
              :class="commonClasses"
              >{{ $props.placeholder }}</span
            >
          </template>
          <template v-if="$props.multiple">
            <span
              class="ksd-select__overflow-search"
              :class="commonClasses"
              :style="{ width: `${searchWidth}px`, order: selectedItems.length }"
            >
              <input
                :id="`ksd-select-${componentId}`"
                ref="input"
                v-model="searchValue"
                autocomplete="off"
                class="ksd-select__selection-search-input"
                role="combobox"
                aria-haspopup="listbox"
                aria-autocomplete="list"
                type="search"
                :class="commonClasses"
                :readonly="!props.search || $props.disabled"
                :aria-expanded="open"
                :disabled="props.disabled"
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
            </span>
            <div v-for="item of selectedItems" :key="item.value" class="ksd-select__overflow-item">
              <span class="ksd-select__overflow-item-wrap" :class="commonClasses">
                <span class="ksd-select__overflow-item-content">{{ item.label }}</span>
                <IconWrapper
                  :disabled="$props.disabled"
                  class="ksd-select__overflow-item-remove"
                  @click="
                    (event) => {
                      event.preventDefault();
                      event.stopPropagation();
                      selectValue(optionsMap[item.value.toString()]?.value);
                      inputRef?.focus?.();
                    }
                  "
                >
                  <VCloseOutlined :size="10" />
                </IconWrapper>
              </span>
            </div>
            <span
              v-if="!filledModel && emptySearch"
              class="ksd-select__selection-placeholder"
              :class="commonClasses"
              >{{ $props.placeholder }}</span
            >
          </template>
        </span>
      </div>
      <span class="ksd-select__selection-suffix">
        <VDownOutlined
          v-if="!searchIcon && !cancelIcon && !loadingIcon"
          :size="12"
          aria-hidden="true"
        />
        <VSearchOutlined
          v-if="searchIcon && !cancelIcon && !loadingIcon"
          :size="12"
          aria-hidden="true"
        />
        <IconWrapper
          v-if="cancelIcon && !loadingIcon"
          class="ksd-select__selection-clear"
          aria-label="clear"
          @click.prevent.stop="onClearValue"
        >
          <VCloseCircleFilled :size="12" />
        </IconWrapper>
        <VLoadingOutlined v-if="loadingIcon" :size="12" aria-hidden="true" />
      </span>
    </div>

    <template #content>
      <template v-for="group of filteredGroupedOptions" :key="group">
        <template v-if="group.options.length > 0">
          <component :is="group.title" v-if="!isString(group.title)" />
          <div
            v-if="isString(group.title) && group.title.length > 0"
            class="ksd-select__popper-item-header"
          >
            {{ group.title }}
          </div>
          <div
            v-for="(item, index) of group.options"
            :key="item.value.toString()"
            class="ksd-select__popper-item"
            :class="{
              selected: isArray(model) ? model.includes(item.value) : model === item.value,
            }"
            :area-selected="isArray(model) ? model.includes(item.value) : model === item.value"
            :aria-label="item.label"
            role="option"
            :data-index="index"
            :data-value="item.value"
          >
            <component :is="item.desc" v-if="isComponent(item.desc)" />
            <span v-else class="ksd-select__popper-item-content">{{
              item.desc ?? item.label
            }}</span>
            <VCheckOutlined
              v-if="
                (isArray(model) ? model.includes(item.value) : model === item.value) &&
                !isComponent(item.desc) &&
                props.multiple
              "
              :size="14"
              class="ksd-select__popper-item-check"
            /></div
        ></template>
      </template>

      <Empty v-if="empty" class="ksd-select__empty" />
    </template>
  </Popper>
</template>

<style lang="scss">
  div.ksd-select__positioner {
    z-index: var(--ksd-select-z-index);
  }

  .ksd-select {
    margin: 0;
    padding: 0;
    color: var(--ksd-text-main-color);
    font-size: var(--ksd-font-size);
    line-height: var(--ksd-line-height);
    list-style: none;
    font-family: var(--ksd-font-family);
    height: var(--ksd-control-height);
    position: relative;
    border-radius: var(--ksd-border-radius);
    transition: all var(--ksd-transition-mid) ease-in-out;
    min-width: 50px;

    display: inline-flex;
    cursor: pointer;

    &.size-small {
      font-size: var(--ksd-font-size);
      height: var(--ksd-control-height-sm);
    }

    &.size-large {
      font-size: var(--ksd-font-size-lg);
      height: var(--ksd-select-single-item-height-lg);
    }

    &.multiple {
      height: auto;
    }

    &.variant-outlined {
      background: var(--ksd-bg-container-color);
      border-width: 1px;
      border-style: solid;
      border-color: var(--ksd-border-color);

      &.status-error {
        border-color: var(--ksd-error-color);
      }
      &.status-warning {
        border-color: var(--ksd-warning-color);
      }
      &.status-success {
        border-color: var(--ksd-success-color);
      }

      &:not(.disabled):hover {
        border-color: var(--ksd-accent-hover-color);

        &.status-error {
          border-color: var(--ksd-error-hover-color);
        }
        &.status-warning {
          border-color: var(--ksd-warning-hover-color);
        }
        &.status-success {
          border-color: var(--ksd-success-hover-color);
        }
      }
      &:focus,
      &:focus-within {
        border-color: var(--ksd-accent-color);
        box-shadow: var(--ksd-input-active-shadow);

        &.status-error {
          border-color: var(--ksd-error-color);
          box-shadow: 0 0 0 2px rgba(255, 38, 5, 0.06);
        }
        &.status-warning {
          border-color: var(--ksd-warning-color);
          box-shadow: 0 0 0 2px rgba(255, 215, 5, 0.1);
        }
        &.status-success {
          border-color: var(--ksd-success-color);
          box-shadow: 0 0 0 2px rgba(68, 255, 5, 0.06);
        }
      }
    }
    &.variant-borderless {
      background: transparent;
      border: none;

      &.status-error {
        color: var(--ksd-error-color);
      }
      &.status-warning {
        color: var(--ksd-warning-color);
      }
      &.status-success {
        color: var(--ksd-success-color);
      }
    }
    &.variant-filled {
      background: var(--ksd-bg-fill-color);
      border-width: 1px;
      border-style: solid;
      border-color: transparent;

      &.status-error {
        background: var(--ksd-error-bg-color);
        color: var(--ksd-error-color);
      }
      &.status-warning {
        background: var(--ksd-warning-bg-color);
        color: var(--ksd-warning-color);
      }
      &.status-success {
        background: var(--ksd-success-bg-color);
        color: var(--ksd-success-color);
      }

      &:not(.disabled):hover {
        background: var(--ksd-bg-fill-hover-color);

        &.status-error {
          background: var(--ksd-error-bg-hover-color);
        }
        &.status-warning {
          background: var(--ksd-warning-bg-hover-color);
        }
        &.status-success {
          background: var(--ksd-success-bg-hover-color);
        }
      }

      &:not(.disabled):focus,
      &:not(.disabled):focus-within {
        border-color: var(--ksd-accent-color);
        background: var(--ksd-bg-container-color);

        &.status-error {
          border-color: var(--ksd-error-color);
          background: var(--ksd-bg-container-color);
        }
        &.status-warning {
          border-color: var(--ksd-warning-color);
          background: var(--ksd-bg-container-color);
        }
        &.status-success {
          border-color: var(--ksd-success-color);
          background: var(--ksd-bg-container-color);
        }
      }
    }
    &.variant-underline {
      background: var(--ksd-bg-container-color);
      border-width: 1px 0;
      border-style: solid none;
      border-radius: 0;
      border-color: transparent transparent var(--ksd-border-color) transparent;

      &.status-error {
        border-color: transparent transparent var(--ksd-error-color) transparent;
      }
      &.status-warning {
        border-color: transparent transparent var(--ksd-warning-color) transparent;
      }
      &.status-success {
        border-color: transparent transparent var(--ksd-success-color) transparent;
      }

      &:not(.disabled):hover {
        border-color: transparent transparent var(--ksd-accent-hover-color) transparent;

        &.status-error {
          border-color: transparent transparent var(--ksd-error-hover-color) transparent;
        }
        &.status-warning {
          border-color: transparent transparent var(--ksd-warning-hover-color) transparent;
        }
        &.status-success {
          border-color: transparent transparent var(--ksd-success-hover-color) transparent;
        }
      }
      &:not(.disabled):focus,
      &:not(.disabled):focus-within {
        border-color: transparent transparent var(--ksd-accent-color) transparent;

        &.status-error {
          border-color: transparent transparent var(--ksd-error-color) transparent;
        }
        &.status-warning {
          border-color: transparent transparent var(--ksd-warning-color) transparent;
        }
        &.status-success {
          border-color: transparent transparent var(--ksd-success-color) transparent;
        }
      }
    }
    &.disabled {
      cursor: not-allowed;
      color: var(--ksd-text-main-disabled-color);

      &.variant-outlined,
      &.variant-filled {
        background-color: var(--ksd-bg-disabled-color);
        border-color: var(--ksd-border-color);
        box-shadow: none;
      }
    }

    &__selector {
      &:not(.multiple) {
        box-sizing: border-box;
        margin: 0;
        color: var(--ksd-text-main-color);
        font-size: var(--ksd-font-size);
        line-height: var(--ksd-line-height);
        list-style: none;
        font-family: inherit;
        display: flex;
        flex: 1 1 auto;
        position: relative;
        transition: all var(--ksd-transition-mid) ease-in-out;
        width: 100%;
        height: 100%;
        align-items: center;
        padding: 0 calc(var(--ksd-padding-sm) - 1px);

        &.size-small {
          padding: 0 calc(var(--ksd-select-selector-padding-sm) - var(--ksd-line-width));
        }
      }

      &.multiple {
        display: flex;
        position: relative;
        width: 100%;
        height: 100%;
        transition: all var(--ksd-transition-mid) ease-in-out;
        padding-inline: max(calc(var(--ksd-padding-xxs) - var(--ksd-line-width)), 0px);
        padding-block: max(
          calc(
            max(calc(var(--ksd-padding-xxs) - var(--ksd-line-width)), 0px) - var(
                --ksd-select-internal_fixed_item_margin
              )
          ),
          0px
        );
        padding-inline-end: calc(12px + var(--ksd-select-show-arrow-padding-inline-end));

        &.size-small {
          padding-inline: max(calc(var(--ksd-padding-xxs) - var(--ksd-line-width)), 0px);
          padding-block: max(
            calc(
              max(calc(var(--ksd-padding-xxs) - var(--ksd-line-width)), 0px) - var(
                  --ksd-select-internal_fixed_item_margin
                )
            ),
            0px
          );
          padding-inline-end: calc(12px + var(--ksd-select-show-arrow-padding-inline-end));
        }

        &.size-large {
          padding-inline: max(calc(var(--ksd-padding-xxs) - var(--ksd-line-width)), 0px);
          padding-block: max(
            calc(
              max(calc(var(--ksd-padding-xxs) - var(--ksd-line-width)), 0px) - var(
                  --ksd-select-internal_fixed_item_margin
                )
            ),
            0px
          );
          padding-inline-end: calc(12px + var(--ksd-select-show-arrow-padding-inline-end));
        }
      }
    }

    &__wrap {
      display: flex;
      width: 100%;
      position: relative;
      min-width: 0;
      height: 100%;

      &.multiple {
        align-self: flex-start;
        flex: auto;
        flex-wrap: wrap;
        max-width: 100%;

        &:not(.disabled).search {
          cursor: text;
        }
      }
    }

    &__selection-search {
      position: absolute;
      inset: 0;
      width: 100%;
      z-index: 1;
      padding-inline-end: var(--ksd-select-show-arrow-padding-inline-end);
      height: calc(var(--ksd-control-height) - var(--ksd-line-width) * 2);

      &.size-small {
        padding-inline-end: calc(var(--ksd-font-size) * 1.5);
        height: calc(var(--ksd-control-height-sm) - var(--ksd-line-width) * 2);
      }

      &.size-large {
        height: calc(var(--ksd-select-single-item-height-lg) - var(--ksd-line-width) * 2);
      }
    }

    &__selection-search-input {
      margin: 0;
      padding: 0;
      width: 100%;
      background: transparent;
      border: none;
      outline: none;
      appearance: none;
      font-family: inherit;
      cursor: inherit;
      color: inherit;
      height: 100%;
      font-size: var(--ksd-font-size);

      &.size-small {
        font-size: var(--ksd-font-size);
      }

      &.size-large {
        font-size: var(--ksd-font-size-lg);
      }

      &::-webkit-search-cancel-button {
        display: none;
      }

      &:not(.disabled).search {
        cursor: auto;
      }
    }

    &__selection-item {
      flex: 1;
      font-weight: normal;
      position: relative;
      user-select: none;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      display: block;
      padding: 0;
      line-height: calc(var(--ksd-control-height) - var(--ksd-line-width) * 2);
      transition:
        all var(--ksd-transition-slow),
        visibility 0s;
      align-self: center;
      padding-inline-end: var(--ksd-select-show-arrow-padding-inline-end);

      &.size-small {
        line-height: calc(var(--ksd-control-height-sm) - var(--ksd-line-width) * 2);
        padding-inline-end: calc(var(--ksd-font-size) * 1.5);
      }

      &.size-large {
        line-height: calc(var(--ksd-select-single-item-height-lg) - var(--ksd-line-width) * 2);
      }

      &:not(.disabled) {
        &.opened {
          color: var(--ksd-text-placeholder-color);
        }
      }

      &.disabled {
        color: var(--ksd-text-main-disabled-color);
      }
    }

    &__selection-placeholder {
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      flex: 1;
      color: var(--ksd-text-placeholder-color);
      display: block;
      padding: 0;
      line-height: calc(var(--ksd-control-height) - var(--ksd-line-width) * 2);
      transition:
        all var(--ksd-transition-slow),
        visibility 0s;
      align-self: center;
      padding-inline-end: var(--ksd-select-show-arrow-padding-inline-end);

      &.size-small {
        line-height: calc(var(--ksd-control-height-sm) - var(--ksd-line-width) * 2);
        padding-inline-end: calc(var(--ksd-font-size) * 1.5);
      }

      &.size-large {
        line-height: calc(var(--ksd-select-single-item-height-lg) - var(--ksd-line-width) * 2);
      }

      &.multiple {
        position: absolute;
        top: 50%;
        inset-inline-start: calc(
          calc(var(--ksd-padding-sm) - 1px) - max(
              calc(var(--ksd-padding-xxs) - var(--ksd-line-width)),
              0px
            )
        );
        inset-inline-end: calc(var(--ksd-padding-sm) - 1px);
        transform: translateY(-50%);
        padding-inline-end: 0;

        &.size-small {
          inset-inline: calc(var(--ksd-select-selector-padding-sm) - var(--ksd-line-width));
        }
      }
    }

    &__selection-suffix {
      display: flex;
      align-items: center;
      color: var(--ksd-text-quaternary-color);
      font-style: normal;
      line-height: 1;
      text-align: center;
      text-transform: none;
      vertical-align: -0.125em;
      text-rendering: optimizeLegibility;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
      position: absolute;
      top: 50%;
      inset-inline-start: auto;
      inset-inline-end: calc(var(--ksd-padding-sm) - 1px);
      height: 12px;
      margin-top: calc(12px * -1 / 2);
      font-size: 12px;
      pointer-events: none;
      transition: opacity var(--ksd-transition-slow) ease;
      z-index: 2;
    }

    &__selection-clear {
      color: var(--ksd-text-quaternary-color);
      pointer-events: all;

      & svg {
        transition: color var(--ksd-transition-slow) ease;
      }

      &:hover {
        color: var(--ksd-text-tertiary-color);
      }
    }

    &__overflow-search {
      display: inline-flex;
      position: relative;
      max-width: 100%;
      min-height: var(--ksd-select-multiple-item-height);
      margin-block: var(--ksd-select-internal_fixed_item_margin);
      margin-inline-start: calc(
        calc(var(--ksd-padding-sm) - 1px) - calc(
            (var(--ksd-control-height) - var(--ksd-select-multiple-item-height)) /
              2 - var(--ksd-line-width)
          )
      );

      &.size-small {
        min-height: var(--ksd-select-multiple-item-height-sm);
      }
      &.size-large {
        min-height: var(--ksd-select-multiple-item-height-lg);
      }

      &.filled {
        margin-inline-start: 0;
      }
    }

    &__overflow-item {
      flex: none;
      align-self: center;
      max-width: 100%;
      display: inline-flex;
    }

    &__overflow-item-wrap {
      max-width: 100%;
      display: inline-flex;
      flex: none;
      box-sizing: border-box;
      max-width: 100%;
      margin-block: var(--ksd-select-internal_fixed_item_margin);
      border-radius: var(--ksd-border-radius-sm);
      cursor: default;
      transition:
        font-size var(--ksd-transition-slow),
        line-height var(--ksd-transition-slow),
        height var(--ksd-transition-slow);
      margin-inline-end: calc(var(--ksd-select-internal_fixed_item_margin) * 2);
      padding-inline-start: var(--ksd-padding-xs);
      padding-inline-end: calc(var(--ksd-padding-xs) / 2);

      background: var(--ksd-select-multiple-item-bg);
      border: var(--ksd-line-width) var(--ksd-line-type)
        var(--ksd-select-multiple-item-border-color);
      height: var(--ksd-select-multiple-item-height);
      line-height: calc(var(--ksd-select-multiple-item-height) - var(--ksd-line-width) * 2);
      font-weight: normal;
      position: relative;
      user-select: none;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      align-items: center;

      &.size-small {
        border-radius: var(--ksd-border-radius-xs);
        height: var(--ksd-select-multiple-item-height-sm);
        line-height: calc(var(--ksd-select-multiple-item-height-sm) - var(--ksd-line-width) * 2);
      }

      &.size-large {
        border-radius: var(--ksd-border-radius);
        height: var(--ksd-select-multiple-item-height-lg);
        line-height: calc(var(--ksd-select-multiple-item-height-lg) - var(--ksd-line-width) * 2);
      }

      &.disabled {
        cursor: not-allowed;
      }
    }

    &__overflow-item-content {
      display: inline-block;
      margin-inline-end: calc(var(--ksd-padding-xs) / 2);
      overflow: hidden;
      white-space: pre;
      text-overflow: ellipsis;
    }

    &__overflow-item-remove {
      display: inline-flex;
      align-items: center;
      color: var(--ksd-icon-color);
      font-style: normal;
      line-height: inherit;
      text-align: center;
      text-transform: none;
      vertical-align: -0.125em;
      text-rendering: optimizeLegibility;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
      font-weight: bold;
      font-size: 10px;
      transition: color var(--ksd-transition-slow) ease;
      background: transparent;

      &:not([disabled]):hover {
        color: var(--ksd-icon-hover-color);
      }

      &[disabled] {
        cursor: not-allowed;
      }
    }

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
      gap: var(--ksd-padding);

      &.active {
        background-color: var(--ksd-select-option-active-bg);
      }

      &.selected {
        color: var(--ksd-select-option-selected-color);
        font-weight: var(--ksd-select-option-selected-font-weight);
        background-color: var(--ksd-select-option-selected-bg);

        &.active {
          background-color: var(--ksd-select-options-selected-active-bg);
        }

        &:has(+ .selected) {
          border-end-end-radius: 0;
          border-end-start-radius: 0;

          & + .selected {
            border-start-end-radius: 0;
            border-start-start-radius: 0;
          }
        }
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
      gap: var(--ksd-padding);
    }

    &__popper-item-content {
      flex: auto;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }

    &__popper-item-check {
      color: var(--ksd-accent-color);
      margin-left: auto;
    }

    &__popper {
      padding: var(--ksd-padding-xxs);
    }

    &__empty {
      padding: var(--ksd-padding);
    }
  }
</style>
