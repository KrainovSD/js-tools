<script setup lang="ts" generic="F extends string | number, O extends string | number">
  import { dateFormat, isArray, isId, isObject, isString } from "@krainovsd/js-helpers";
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
  import type { FilterItemFlat, FilterProps } from "./filter.types";

  type Emits = {
    focus: [F | undefined];
  };

  const emit = defineEmits<Emits>();
  const props = defineProps<Required<FilterProps<F, O>>>();

  const form = defineModel<Partial<Record<F, unknown>>>({ default: {} });
  const operators = defineModel<Partial<Record<F, O>>>("operators", { default: {} });
  const openedFields = shallowRef<F[]>([]);
  const dropRef = useTemplateRef("drop");
  const buttonRef = useTemplateRef("button");
  const hoverDrop = ref(false);
  const focusDrop = ref(false);
  const activeDrop = computed(() => hoverDrop.value || focusDrop.value);

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
        if (form.value[openField] != undefined) {
          delete form.value[openField];
        }

        return field;
      }

      return openField;
    });
    emit("focus", field);
  }
  function closeFilter(field: F) {
    openedFields.value = openedFields.value.filter((filter) => filter !== field);
    if (form.value[field] != undefined) {
      delete form.value[field];
    }

    emit("focus", undefined);
  }
  function dropFilters() {
    if (Object.keys(form.value).length !== 0) {
      form.value = {} as Partial<Record<F, unknown>>;
    }
    openedFields.value = [];
    emit("focus", undefined);
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
      const filterItem = props.filters.find((filter) => filter.field === field);
      if (!filterItem) {
        return acc;
      }

      const filterComponent =
        operators.value[field] != undefined
          ? (filterItem.components.find(
              (component) => component.operatorValue === operators.value[field],
            ) ?? filterItem.components[0])
          : filterItem.components[0];
      if (!filterComponent) {
        return acc;
      }

      acc.push({
        ...filterItem,
        ...filterComponent,
        icon: isObject(filterItem.icon) ? toRaw(filterItem.icon) : filterItem.icon,
        operators: filterItem.components.reduce((acc: SelectItem[], component) => {
          if (component.operatorLabel && component.operatorValue != undefined) {
            acc.push({
              value: component.operatorValue,
              label: component.operatorLabel,
              desc:
                component.operatorLabel && component.operatorShortLabel
                  ? h("div", { class: "ksd-filter__field-operator-item" }, [
                      h(Text, {}, () => component.operatorShortLabel),
                      h(Text, { type: "secondary", size: "sm" }, () => component.operatorLabel),
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

  function extractFilterDisplayValue(filter: FilterItemFlat<F, O>) {
    let displayValue: string = "";
    const filterValue = form.value[filter.field];
    const displayType: keyof ControlComponents =
      "displayValue" in filter
        ? (filter.displayValue ?? "text")
        : isString(filter.component)
          ? filter.component
          : "text";
    const filterProps = isObject(filter.props) ? filter.props : {};

    if (displayType === "select" && "options" in filterProps && isArray(filterProps.options)) {
      if (filterProps?.multiple) {
        const tempValue = isArray(filterValue)
          ? filterValue.map(
              (value) =>
                (filterProps?.options as SelectItem[])?.find?.((option) => option?.value === value)
                  ?.label ?? value,
            )
          : [];
        displayValue = tempValue.join(", ");
      } else {
        displayValue = isId(filterValue)
          ? (
              (filterProps?.options as SelectItem[])?.find?.(
                (option) => option?.value === filterValue,
              )?.label ?? filterValue
            ).toString()
          : "";
      }
    } else if (displayType === "date") {
      displayValue = isId(filterValue)
        ? dateFormat(
            filterValue,
            "format" in filterProps && isString(filterProps.format)
              ? filterProps.format
              : (props.displayedDateFormat ?? "DD-MM-YYYY"),
          )
        : "";
    } else if (displayType === "date-range") {
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
    form,
    (form) => {
      const formKeys = Object.keys(form) as F[];
      if (formKeys.length !== openedFields.value.length) {
        const actualOpenedFields = new Set([...openedFields.value, ...formKeys]);
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
    openedFields.value = Object.keys(form.value) as F[];

    for (let i = 0; i < props.filters.length; i++) {
      const filter = props.filters[i];
      if (
        filter.components.length > 0 &&
        filter.components[0].operatorValue != undefined &&
        operators.value[filter.field] == undefined
      ) {
        operators.value[filter.field] = filter.components[0].operatorValue;
      }
    }
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
    v-for="(filter, index) in openedFilters"
    :key="filter.field"
    class="ksd-filter__field"
    :class="{ drop: activeDrop }"
  >
    <DropDown :menu="dropMenu(index)">
      <Button
        :data-id="filter.field"
        :size="$props.buttonSize"
        class="ksd-filter__field-button-info"
        :class="{ operator: filter.operators && filter.operators.length > 0 }"
      >
        <component :is="filter.icon" v-if="filter.icon" class="ksd-filter__field-icon" />
        <span class="ksd-filter__field-label">
          {{ filter.label }}
        </span>
      </Button>
    </DropDown>
    <DropDown
      v-if="filter.operators && filter.operators.length > 0"
      :menu="
        filter.operators.map((operator) => ({
          key: String(operator.value),
          label: operator.desc,
          onClick: () => {
            operators[filter.field] = operator.value as O;

            const nextClearTag = $props.filters
              .find((propsFilter) => propsFilter.field === filter.field)
              ?.components?.find?.(
                (component) => component.operatorValue === operator.value,
              )?.clearTag;
            if (!nextClearTag || !filter.clearTag || nextClearTag !== filter.clearTag) {
              form[filter.field] = undefined;
            }
          },
        }))
      "
    >
      <Button
        :data-id="filter.field"
        :size="$props.buttonSize"
        class="ksd-filter__field-button-operator"
        >{{ filter.operatorShortLabel ?? filter.operatorLabel ?? operators[filter.field] }}</Button
      >
    </DropDown>
    <Popover :size="$props.controlSize">
      <Button
        :data-id="filter.field"
        :size="$props.buttonSize"
        class="ksd-filter__field-button-value"
        :class="{ operator: filter.operators && filter.operators.length > 0 }"
      >
        <Tooltip :text="extractFilterDisplayValue(filter)" :open-not-visible="true">
          <span class="ksd-filter__field-value">
            {{
              form[filter.field] == undefined || form[filter.field] === ""
                ? "Выберите значение"
                : extractFilterDisplayValue(filter)
            }}
          </span>
        </Tooltip>
      </Button>
      <template #content>
        <component
          :is="filter.component"
          v-if="!isString(filter.component)"
          :model-value="form[filter.field]"
          @update:model-value="
            (value: unknown) => {
              form[filter.field] = value;
            }
          "
        />
        <template v-if="isString(filter.component)">
          <Control
            v-model="form[filter.field]"
            :component="filter.component"
            :props="filter.props"
            :control-size="$props.controlSize"
            :control-variant="$props.controlVariant"
            :class="{
              'ksd-filter__field-control': true,
              text: filter.component === 'text',
              select: filter.component === 'select',
              number: filter.component === 'number',
              'number-range': filter.component === 'number-range',
            }"
            @update:model-value="
              (value) => {
                console.log(value);
              }
            "
          />
        </template>
      </template>
    </Popover>
    <Button
      :size="$props.buttonSize"
      class="ksd-filter__field-button-close"
      @click="closeFilter(filter.field)"
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
