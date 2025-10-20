<script setup lang="ts" generic="F extends string | number, O extends string | number">
  import {
    arrayToMapByKey,
    dateFormat,
    isArray,
    isId,
    isObject,
    isString,
  } from "@krainovsd/js-helpers";
  import { VCloseCircleFilled, VDeleteOutlined, VPlusOutlined } from "@krainovsd/vue-icons";
  import { computed, h, onMounted, ref, shallowRef, toRaw, useTemplateRef, watch } from "vue";
  import Button from "../Button.vue";
  import type { ControlComponents } from "../Control.vue";
  import Control from "../Control.vue";
  import DropDown, { type DropDownMenuItem } from "../DropDown.vue";
  import Popover from "../Popover.vue";
  import type { SelectItem } from "../Select.vue";
  import Text from "../Text.vue";
  import Tooltip from "../Tooltip.vue";
  import type { UserPickerUser } from "../UserPicker.vue";
  import type { FilterItem, FilterItemFlat, FilterProps } from "./filter.types";

  type Emits = {
    focus: [F | undefined];
  };

  const emit = defineEmits<Emits>();
  const props = defineProps<Required<FilterProps<F, O>>>();

  const filter = defineModel<FilterItem<F, O>[]>({ default: [] });
  const openedFields = shallowRef<F[]>([]);
  const dropRef = useTemplateRef("drop");
  const buttonRef = useTemplateRef("button");
  const hoverDrop = ref(false);
  const focusDrop = ref(false);
  const activeDrop = computed(() => hoverDrop.value || focusDrop.value);

  const filterMap = computed(() => arrayToMapByKey(filter.value, "field"));

  function openFilterField() {
    const field = availableFilters.value[0]?.field;

    if (field) {
      if (props.direction === "right") {
        openedFields.value = [...openedFields.value, field];
      } else {
        openedFields.value = [field, ...openedFields.value];
      }

      emit("focus", field);
    }
  }

  function changeFilterField(field: F, index: number) {
    openedFields.value = openedFields.value.map((openField, openIndex) => {
      if (openIndex === index) {
        const filterIndex = filter.value.findIndex((f) => f.field === openField);
        if (filterIndex !== -1) {
          filter.value = filter.value.toSpliced(filterIndex, 1);
        }

        return field;
      }

      return openField;
    });
    emit("focus", field);
  }
  function closeFilter(field: F) {
    openedFields.value = openedFields.value.filter((filter) => filter !== field);
    const filterIndex = filter.value.findIndex((f) => f.field === field);
    if (filterIndex !== -1) {
      filter.value = filter.value.toSpliced(filterIndex, 1);
    }

    emit("focus", undefined);
  }
  function dropFilters() {
    if (filter.value.length !== 0) {
      filter.value = [];
    }
    openedFields.value = [];
    emit("focus", undefined);
  }
  function changeOperator(openedFilter: FilterItemFlat<F, O>, operator: O) {
    let clearValue = false;
    const nextClearTag = props.filters
      .find((propsFilter) => propsFilter.field === openedFilter.field)
      ?.components?.find?.((component) => component.operatorValue === operator)?.clearTag;
    if (!nextClearTag || !openedFilter.clearTag || nextClearTag !== openedFilter.clearTag) {
      clearValue = true;
    }

    const filterIndex = filter.value.findIndex((f) => f.field === openedFilter.field);
    if (filterIndex === -1) {
      filter.value = [...filter.value, { field: openedFilter.field, value: undefined, operator }];
    } else {
      filter.value = filter.value.toSpliced(filterIndex, 1, {
        ...filter.value[filterIndex],
        operator,
        value: clearValue ? undefined : filter.value[filterIndex].value,
      });
    }
  }
  function changeValue(openedFilter: FilterItemFlat<F, O>, value: unknown) {
    const filterIndex = filter.value.findIndex((f) => f.field === openedFilter.field);
    if (filterIndex === -1) {
      filter.value = [
        ...filter.value,
        { field: openedFilter.field, value, operator: openedFilter.operators[0]?.value },
      ];
    } else {
      filter.value = filter.value.toSpliced(filterIndex, 1, {
        ...filter.value[filterIndex],
        value,
      });
    }
  }

  const availableFilters = computed(() =>
    props.filters.filter((filter) => !openedFields.value.includes(filter.field)),
  );
  const dropMenu = computed(
    () => (index: number) =>
      availableFilters.value.map<DropDownMenuItem>((filter) => ({
        key: filter.field.toString(),
        icon: filter.icon ? toRaw(filter.icon) : undefined,
        label: filter.label,
        onClick: () => changeFilterField(filter.field, index),
        ellipsis: true,
      })),
  );

  const openedFilters = computed(() => {
    return openedFields.value.reduce((acc: FilterItemFlat<F, O>[], field) => {
      const openedField = props.filters.find((filter) => filter.field === field);
      if (!openedField) {
        return acc;
      }

      const operator = filterMap.value[openedField.field.toString()]?.operator;
      const filterComponent =
        operator != undefined
          ? (openedField.components.find((component) => component.operatorValue === operator) ??
            openedField.components[0])
          : openedField.components[0];
      if (!filterComponent) {
        return acc;
      }

      acc.push({
        ...openedField,
        ...filterComponent,
        icon: isObject(openedField.icon) ? toRaw(openedField.icon) : openedField.icon,
        operators: openedField.components.reduce((acc: SelectItem<O>[], component) => {
          if (component.operatorLabel && component.operatorValue != undefined) {
            acc.push({
              value: component.operatorValue,
              label: component.operatorLabel,
              desc:
                component.operatorLabel && component.operatorShortLabel
                  ? h("div", { class: "ksd-filter__field-operator-item" }, [
                      h(Text, {}, () => component.operatorShortLabel),
                      h(Text, { type: "secondary", size: "small" }, () => component.operatorLabel),
                    ])
                  : (component.operatorShortLabel ?? component.operatorLabel),
            });
          }

          return acc;
        }, []),
      });

      return acc;
    }, []);
  });

  function extractFilterDisplayValue(extractingFilter: FilterItemFlat<F, O>) {
    let displayValue: string = "";
    const filterValue = filter.value.find((f) => f.field === extractingFilter.field)?.value;
    const displayType: keyof ControlComponents =
      "displayValue" in extractingFilter
        ? (extractingFilter.displayValue ?? "text")
        : isString(extractingFilter.component)
          ? extractingFilter.component
          : "text";
    const filterProps = isObject(extractingFilter.props) ? extractingFilter.props : {};

    /** user */
    if (displayType === "user" && "users" in filterProps && isArray(filterProps.users)) {
      const tempValue = (isArray(filterValue) ? filterValue : [filterValue]).map(
        (v) =>
          (filterProps.users as UserPickerUser<string | number>[]).find((u) => u.id === v)?.name,
      );
      displayValue = tempValue.join(", ");
      /** select */
    } else if (
      displayType === "select" &&
      "options" in filterProps &&
      isArray(filterProps.options)
    ) {
      if (filterProps?.multiple) {
        const tempValue = isArray(filterValue)
          ? filterValue.map(
              (value) =>
                (filterProps?.options as SelectItem<string | number>[])?.find?.(
                  (option) => option?.value === value,
                )?.label ?? value,
            )
          : [];
        displayValue = tempValue.join(", ");
      } else {
        displayValue = isId(filterValue)
          ? (
              (filterProps?.options as SelectItem<string | number>[])?.find?.(
                (option) => option?.value === filterValue,
              )?.label ?? filterValue
            ).toString()
          : "";
      }
      /** date */
    } else if (displayType === "date" && "multiple" in filterProps && filterProps.multiple) {
      const tempValue = isArray(filterValue) ? filterValue : [];
      const tempFirst = isId(tempValue[0])
        ? dateFormat(
            tempValue[0],
            "format" in filterProps && isString(filterProps.format)
              ? filterProps.format
              : (props.displayedDateFormat ?? "DD-MM-YYYY"),
          )
        : "";
      const tempSecond = isId(tempValue[1])
        ? dateFormat(
            tempValue[1],
            "format" in filterProps && isString(filterProps.format)
              ? filterProps.format
              : (props.displayedDateFormat ?? "DD-MM-YYYY"),
          )
        : "";

      displayValue = `${tempFirst} ${tempFirst ? " - " : ""} ${tempSecond}`;
    } else if (displayType === "date") {
      displayValue = isId(filterValue)
        ? dateFormat(
            filterValue,
            "format" in filterProps && isString(filterProps.format)
              ? filterProps.format
              : (props.displayedDateFormat ?? "DD-MM-YYYY"),
          )
        : "";
      /** other */
    } else {
      displayValue = isId(filterValue)
        ? filterValue.toString()
        : isArray(filterValue)
          ? filterValue.join(", ")
          : "";
    }

    return displayValue;
  }

  watch(
    filter,
    (filter) => {
      const fields = filter.map((f) => f.field);

      if (fields.length !== openedFields.value.length) {
        const actualOpenedFields = new Set([...openedFields.value, ...fields]);
        openedFields.value = Array.from(actualOpenedFields);
      }
    },
    { deep: true },
  );
  watch(
    () => dropRef.value?.element,
    (dropRef, _, clean) => {
      if (!dropRef) {
        hoverDrop.value = false;

        return;
      }

      function onHoverDrop() {
        hoverDrop.value = true;
      }
      function onLeaveDrop() {
        hoverDrop.value = false;
      }
      function onFocusDrop() {
        focusDrop.value = true;
      }
      function onBlurDrop() {
        focusDrop.value = false;
      }

      dropRef.addEventListener("mouseenter", onHoverDrop);
      dropRef.addEventListener("mouseleave", onLeaveDrop);
      dropRef.addEventListener("focus", onFocusDrop);
      dropRef.addEventListener("blur", onBlurDrop);

      clean(() => {
        dropRef.removeEventListener("focus", onHoverDrop);
        dropRef.removeEventListener("blur", onLeaveDrop);
        dropRef.removeEventListener("focus", onFocusDrop);
        dropRef.removeEventListener("blur", onBlurDrop);
      });
    },
    { immediate: true },
  );

  onMounted(() => {
    openedFields.value = filter.value.map((f) => f.field);
  });

  defineExpose({ element: buttonRef });
</script>

<template>
  <div v-if="$props.direction === 'left'" ref="button" class="ksd-filter__button-wrapper">
    <Button
      v-if="availableFilters.length !== 0"
      :size="$props.buttonSize"
      class="ksd-filter__button-filter"
      :class="{ clear: openedFields.length > 0 }"
      @click="openFilterField"
    >
      <template #icon>
        <component :is="$props.icon" v-if="$props.icon" class="ksd-filter__icon" />
        <VPlusOutlined v-if="!$props.icon" class="ksd-filter__icon" />
      </template>
      {{ $props.label }}
    </Button>
    <Button
      v-if="openedFields.length > 0"
      ref="drop"
      class="ksd-filter__button-clear"
      :class="{ empty: availableFilters.length === 0 }"
      :size="$props.buttonSize"
      @click="dropFilters"
    >
      <template #icon>
        <VDeleteOutlined />
      </template>
    </Button>
  </div>
  <div
    v-for="(openedFilter, index) in openedFilters"
    :key="openedFilter.field"
    class="ksd-filter__field"
    :class="{ drop: activeDrop }"
  >
    <DropDown :menu="dropMenu(index)">
      <Button
        :data-id="openedFilter.field"
        :size="$props.buttonSize"
        class="ksd-filter__field-button-info"
        :class="{ operator: openedFilter.operators && openedFilter.operators.length > 0 }"
      >
        <component
          :is="openedFilter.icon"
          v-if="openedFilter.icon"
          class="ksd-filter__field-icon"
        />
        <span class="ksd-filter__field-label">
          {{ openedFilter.label }}
        </span>
      </Button>
    </DropDown>
    <DropDown
      v-if="openedFilter.operators && openedFilter.operators.length > 0"
      :menu="
        openedFilter.operators.map((operator) => ({
          key: String(operator.value),
          label: operator.desc,
          onClick: () => changeOperator(openedFilter, operator.value),
        }))
      "
    >
      <Button
        :data-id="openedFilter.field"
        :size="$props.buttonSize"
        class="ksd-filter__field-button-operator"
        >{{
          openedFilter.operatorShortLabel ??
          openedFilter.operatorLabel ??
          filterMap[openedFilter.field.toString()]?.operator
        }}</Button
      >
    </DropDown>
    <Popover :size="$props.controlSize" :autofocus="false">
      <Button
        :data-id="openedFilter.field"
        :size="$props.buttonSize"
        class="ksd-filter__field-button-value"
        :class="{ operator: openedFilter.operators && openedFilter.operators.length > 0 }"
      >
        <Tooltip :text="extractFilterDisplayValue(openedFilter)" :open-not-visible="true">
          <span class="ksd-filter__field-value">
            {{
              filterMap[openedFilter.field.toString()]?.value == undefined ||
              filterMap[openedFilter.field.toString()]?.value === ""
                ? "Выберите значение"
                : extractFilterDisplayValue(openedFilter)
            }}
          </span>
        </Tooltip>
      </Button>
      <template #content>
        <component
          :is="openedFilter.component"
          v-if="!isString(openedFilter.component)"
          :model-value="filterMap[openedFilter.field.toString()]?.value"
          @update:model-value="(value: unknown) => changeValue(openedFilter, value)"
        />
        <template v-if="isString(openedFilter.component)">
          <Control
            :model-value="filterMap[openedFilter.field.toString()]?.value"
            :component="openedFilter.component"
            :props="openedFilter.props"
            :autofocus="true"
            :control-size="$props.controlSize"
            :control-variant="$props.controlVariant"
            :class="{
              'ksd-filter__field-control': true,
              text: openedFilter.component === 'text',
              select: openedFilter.component === 'select',
              number: openedFilter.component === 'number',
              'number-range': openedFilter.component === 'number-range',
            }"
            @update:model-value="(value: unknown) => changeValue(openedFilter, value)"
          />
        </template>
      </template>
    </Popover>
    <Button
      :size="$props.buttonSize"
      class="ksd-filter__field-button-close"
      @click="closeFilter(openedFilter.field)"
    >
      <template #icon>
        <VCloseCircleFilled />
      </template>
    </Button>
  </div>
  <div v-if="$props.direction === 'right'" ref="button" class="ksd-filter__button-wrapper">
    <Button
      v-if="availableFilters.length !== 0"
      :size="$props.buttonSize"
      class="ksd-filter__button-filter"
      :class="{ clear: openedFields.length > 0 }"
      @click="openFilterField"
    >
      <template #icon>
        <component :is="$props.icon" v-if="$props.icon" class="ksd-filter__icon" />
        <VPlusOutlined v-if="!$props.icon" class="ksd-filter__icon" />
      </template>
      {{ $props.label }}
    </Button>
    <Button
      v-if="openedFields.length > 0"
      ref="drop"
      class="ksd-filter__button-clear"
      :class="{ empty: availableFilters.length === 0 }"
      :size="$props.buttonSize"
      @click="dropFilters"
    >
      <template #icon>
        <VDeleteOutlined />
      </template>
    </Button>
  </div>
</template>

<style lang="scss">
  button.ksd-filter__field-button-info {
    border-top-right-radius: 0;
    border-bottom-right-radius: 0;
    border-right-color: transparent;
    &:focus-visible {
      z-index: 1;
    }
  }
  button.ksd-filter__field-button-operator {
    border-radius: 0;
    border-right-color: transparent;
    &:focus-visible {
      z-index: 1;
    }
  }
  button.ksd-filter__field-button-value {
    border-radius: 0;
    border-right-color: transparent;
    &:focus-visible {
      z-index: 1;
    }
  }

  button.ksd-filter__field-button-close {
    border-top-left-radius: 0;
    border-bottom-left-radius: 0;
    color: var(--ksd-icon-color);
    &:focus-visible {
      z-index: 1;
    }
  }
  button.ksd-filter__button-filter {
    &.clear {
      border-top-right-radius: 0;
      border-bottom-right-radius: 0;
      border-right-color: transparent;
    }
    &:focus-visible {
      z-index: 1;
    }
  }
  button.ksd-filter__button-clear {
    border-top-left-radius: 0;
    border-bottom-left-radius: 0;
    color: var(--ksd-icon-color);
    &.empty {
      border-top-left-radius: var(--ksd-border-radius);
      border-bottom-left-radius: var(--ksd-border-radius);
    }
    &:focus-visible {
      z-index: 1;
    }
  }

  .ksd-filter {
    &__field {
      display: flex;
      align-items: center;

      &.drop {
        animation: ksd-filter__field-shake var(--ksd-transition-slow) infinite;
      }

      @keyframes ksd-filter__field-shake {
        0% {
          transform: rotate(0deg);
        }
        25% {
          transform: rotate(0.5deg);
        }
        50% {
          transform: rotate(0eg);
        }
        75% {
          transform: rotate(-0.5deg);
        }
        100% {
          transform: rotate(0deg);
        }
      }
    }

    &__field-operator-item {
      display: flex;
      flex-direction: column;
      gap: var(--ksd-padding-xss);
    }

    &__field-info {
      display: flex;
      align-items: center;
    }
    &__field-label {
      max-width: 150px;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      font-weight: var(--ksd-font-weight-strong);
    }

    &__field-value {
      max-width: 200px;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      margin-left: var(--ksd-filter-field-gap);
    }

    &__field-control {
      &.text {
        min-width: 300px;
      }
      &.select {
        min-width: 300px;
        max-width: 300px;
      }
      &.number {
        width: 80px;
      }
      &.number-range > .ksd-input {
        width: 80px;
      }
    }
  }
</style>
