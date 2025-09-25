<script setup lang="ts" generic="F extends string | number, O extends string | number">
  import { dateFormat, isArray, isId, isNumber, isObject, isString } from "@krainovsd/js-helpers";
  import { VCloseCircleFilled, VDeleteOutlined, VPlusOutlined } from "@krainovsd/vue-icons";
  import {
    type Component,
    computed,
    h,
    nextTick,
    onMounted,
    ref,
    shallowRef,
    toRaw,
    useTemplateRef,
    watch,
  } from "vue";
  import Button, { type ButtonSize } from "./Button.vue";
  import DropDown, { type DropDownMenuItem } from "./DropDown.vue";
  import Input, { type InputVariant } from "./Input.vue";
  import InputNumber from "./InputNumber.vue";
  import Popover from "./Popover.vue";
  import type { SelectItem, SelectValue } from "./Select.vue";
  import Select from "./Select.vue";
  import Text from "./Text.vue";
  import Tooltip from "./Tooltip.vue";

  export type FilterComponentProps = {
    select: FilterSelectComponentProps;
    text: FilterTextComponentProps;
    number: FilterNumberComponentProps;
    "number-range": FilterNumberComponentProps;
    date: FilterDateComponentProps;
    "date-range": FilterDateComponentProps;
  };
  export type FilterComponentKey = keyof FilterComponentProps;
  export type FilterDirection = "left" | "right";

  export type FilterSelectComponentProps = {
    options: SelectItem[];
    multiple?: boolean;
    placeholder?: string;
    search?: boolean;
    clear?: boolean;
  };
  export type FilterTextComponentProps = {
    allowClear?: boolean;
    placeholder?: string;
  };
  export type FilterNumberComponentProps = {
    min?: number;
    max?: number;
    step?: number;
    placeholder?: string;
  };
  export type FilterDateComponentProps = {
    format?: string;
  };

  export type FilterComponent<O extends string | number> =
    | {
        [K in keyof FilterComponentProps]: {
          props?: FilterComponentProps[K];
          component: K;
          operatorValue?: O;
          operatorLabel?: string;
          operatorShortLabel?: string;
          /** When the operator is changed, the tags of the old and new components are compared. If they differ or are missing, the previous filter value will be cleared. */
          clearTag?: string;
        };
      }[keyof FilterComponentProps]
    | {
        operatorValue?: O;
        operatorLabel?: string;
        operatorShortLabel?: string;
        component: Component;
        displayValue?: FilterComponentKey;
        props?: unknown;
        /** When the operator is changed, the tags of the old and new components are compared. If they differ or are missing, the previous filter value will be cleared. */
        clearTag?: string;
      };

  export type FilterItem<F extends string | number, O extends string | number> = {
    field: F;
    label: string;
    icon?: Component;
    components: FilterComponent<O>[];
  };
  export type FilterItemFlat<F extends string | number, O extends string | number> =
    | {
        [K in keyof FilterComponentProps]: {
          field: F;
          label: string;
          icon?: Component;
          props?: FilterComponentProps[K];
          component: K;
          operatorValue?: O;
          operatorLabel?: string;
          operatorShortLabel?: string;
          operators: SelectItem[];
          /** When the operator is changed, the tags of the old and new components are compared. If they differ or are missing, the previous filter value will be cleared. */
          clearTag?: string;
        };
      }[keyof FilterComponentProps]
    | {
        field: F;
        label: string;
        icon?: Component;
        operatorValue?: O;
        operatorLabel?: string;
        operatorShortLabel?: string;
        component: Component;
        displayValue?: FilterComponentKey;
        props?: unknown;
        operators: SelectItem[];
        /** When the operator is changed, the tags of the old and new components are compared. If they differ or are missing, the previous filter value will be cleared. */
        clearTag?: string;
      };

  export type FilterProps<
    F extends string | number = string | number,
    O extends string | number = string | number,
  > = {
    filters: FilterItem<F, O>[];
    label?: string;
    icon?: Component;
    buttonSize?: ButtonSize;
    controlSize?: ButtonSize;
    controlVariant?: InputVariant;
    direction?: FilterDirection;
    displayedDateFormat?: string;
  };

  const props = withDefaults(defineProps<FilterProps<F, O>>(), {
    label: "Фильтр",
    buttonSize: "default",
    controlSize: "default",
    controlVariant: "outlined",
    displayedDateFormat: "DD-MM-YYYY",
    icon: undefined,
    direction: "right",
  });
  const form = defineModel<Partial<Record<F, unknown>>>({ default: {} });
  const operators = defineModel<Partial<Record<F, O>>>("operators", { default: {} });
  const openedFields = shallowRef<F[]>([]);
  const filterRef = useTemplateRef("filter");
  const dropRef = useTemplateRef("drop");
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

      void nextTick(() => {
        filterRef.value
          ?.querySelector?.<HTMLElement>(`button.ksd-filter__field-button-info[data-id='${field}']`)
          ?.focus?.();
      });
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
    void nextTick(() => {
      filterRef.value
        ?.querySelector?.<HTMLElement>(`button.ksd-filter__field-button-info[data-id='${field}']`)
        ?.focus?.();
    });
  }
  function closeFilter(field: F) {
    openedFields.value = openedFields.value.filter((filter) => filter !== field);
    if (form.value[field] != undefined) {
      delete form.value[field];
    }

    filterRef.value?.querySelector?.<HTMLElement>(`button.ksd-filter__button-filter`)?.focus?.();
  }
  function dropFilters() {
    form.value = {} as Partial<Record<F, unknown>>;
    openedFields.value = [];
    filterRef.value?.querySelector?.<HTMLElement>(`button.ksd-filter__button-filter`)?.focus?.();
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
  const filterClasses = computed(() => ({ [`control-size-${props.controlSize}`]: true }));

  function extractFilterDisplayValue(filter: FilterItemFlat<F, O>) {
    let displayValue: string = "";
    const filterValue = form.value[filter.field];
    const displayType: FilterComponentKey =
      "displayValue" in filter
        ? (filter.displayValue ?? "text")
        : isString(filter.component)
          ? filter.component
          : "text";
    const filterProps = isObject(filter.props) ? filter.props : {};

    if (displayType === "select" && isArray(filterProps.options)) {
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
            isString(filterProps.format)
              ? filterProps.format
              : (props.displayedDateFormat ?? "DD-MM-YYYY"),
          )
        : "";
    } else if (displayType === "date-range") {
      const tempValue = isArray(filterValue) ? filterValue : [];
      const tempFirst = isId(tempValue[0])
        ? dateFormat(
            tempValue[0],
            isString(filterProps.format)
              ? filterProps.format
              : (props.displayedDateFormat ?? "DD-MM-YYYY"),
          )
        : "";
      const tempSecond = isId(tempValue[1])
        ? dateFormat(
            tempValue[1],
            isString(filterProps.format)
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
</script>

<template>
  <div ref="filter" class="ksd-filter" :class="filterClasses">
    <div v-if="$props.direction === 'left'" class="ksd-filter__button-wrapper">
      <Button
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
          >{{
            filter.operatorShortLabel ?? filter.operatorLabel ?? operators[filter.field]
          }}</Button
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
                form[filter.field] != undefined
                  ? extractFilterDisplayValue(filter)
                  : "Выберите значение"
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
            <Input
              v-if="filter.component === 'text'"
              :model-value="
                isString(form[filter.field]) ? (form[filter.field] as string) : undefined
              "
              :size="$props.controlSize"
              :variant="$props.controlVariant"
              :allow-clear="filter.props?.allowClear"
              :placeholder="filter.props?.placeholder"
              class="ksd-filter__field-control text"
              @update:model-value="(value) => (form[filter.field] = value)"
            />
            <InputNumber
              v-if="filter.component === 'number'"
              :model-value="
                isNumber(form[filter.field]) ? (form[filter.field] as number) : undefined
              "
              :size="$props.controlSize"
              :variant="$props.controlVariant"
              :placeholder="filter.props?.placeholder"
              :min="filter.props?.min"
              :max="filter.props?.max"
              :step="filter.props?.step"
              class="ksd-filter__field-control number"
              @update:model-value="(value) => (form[filter.field] = value)"
            />
            <template v-if="filter.component === 'number-range'">
              <div class="ksd-filter__field-control number-container">
                <InputNumber
                  :model-value="
                    isArray(form[filter.field]) && isNumber((form[filter.field] as unknown[])?.[0])
                      ? ((form[filter.field] as unknown[])[0] as number)
                      : undefined
                  "
                  :size="$props.controlSize"
                  :variant="$props.controlVariant"
                  :placeholder="filter.props?.placeholder"
                  :min="filter.props?.min"
                  :max="filter.props?.max"
                  :step="filter.props?.step"
                  class="ksd-filter__field-control number"
                  @update:model-value="
                    (value) => {
                      if (!isArray(form[filter.field])) {
                        form[filter.field] = [];
                      }
                      (form[filter.field] as unknown[])[0] = value;
                    }
                  "
                />
                <span> - </span>
                <InputNumber
                  :model-value="
                    isArray(form[filter.field]) && isNumber((form[filter.field] as unknown[])?.[1])
                      ? ((form[filter.field] as unknown[])[1] as number)
                      : undefined
                  "
                  :size="$props.controlSize"
                  :variant="$props.controlVariant"
                  :placeholder="filter.props?.placeholder"
                  :min="filter.props?.min"
                  :max="filter.props?.max"
                  :step="filter.props?.step"
                  class="ksd-filter__field-control number"
                  @update:model-value="
                    (value) => {
                      if (!isArray(form[filter.field])) {
                        form[filter.field] = [];
                      }
                      (form[filter.field] as unknown[])[1] = value;
                    }
                  "
                />
              </div>
            </template>
            <Select
              v-if="filter.component === 'select'"
              :options="filter.props?.options ?? []"
              :size="$props.controlSize"
              :variant="$props.controlVariant"
              :multiple="filter.props?.multiple"
              :search="filter.props?.search"
              :clear="filter.props?.clear"
              :placeholder="filter.props?.placeholder"
              :nested="true"
              class="ksd-filter__field-control select"
              :model-value="
                filter.props?.multiple
                  ? isArray(form[filter.field])
                    ? (form[filter.field] as SelectValue[])
                    : undefined
                  : (form[filter.field] as SelectValue)
              "
              @update:model-value="(value) => (form[filter.field] = value)"
            />
            <input
              v-if="filter.component === 'date'"
              type="date"
              class="ksd-filter__field-control date"
              :value="isString(form[filter.field]) ? form[filter.field] : ''"
              @input="
                (event: Event) => {
                  const target = event.target as HTMLInputElement;
                  form[filter.field] = target.value;
                }
              "
            />
            <template v-if="filter.component === 'date-range'">
              <div class="ksd-filter__field-control date-container">
                <input
                  type="date"
                  class="ksd-filter__field-control date"
                  :value="
                    isArray(form[filter.field])
                      ? isString((form[filter.field] as unknown[])[0])
                        ? (form[filter.field] as unknown[])[0]
                        : ''
                      : ''
                  "
                  @input="
                    (event: Event) => {
                      const target = event.target as HTMLInputElement;
                      if (!isArray(form[filter.field])) {
                        form[filter.field] = [];
                      }
                      (form[filter.field] as unknown[])[0] = target.value;
                    }
                  "
                />
                <span> - </span>
                <input
                  type="date"
                  class="ksd-filter__field-control date"
                  :value="
                    isArray(form[filter.field])
                      ? isString((form[filter.field] as unknown[])[1])
                        ? (form[filter.field] as unknown[])[1]
                        : ''
                      : ''
                  "
                  @input="
                    (event: Event) => {
                      const target = event.target as HTMLInputElement;
                      if (!isArray(form[filter.field])) {
                        form[filter.field] = [];
                      }
                      (form[filter.field] as unknown[])[1] = target.value;
                    }
                  "
                />
              </div>
            </template>
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
    <div v-if="$props.direction === 'right'" class="ksd-filter__button-wrapper">
      <Button
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
        :size="$props.buttonSize"
        @click="dropFilters"
      >
        <template #icon>
          <VDeleteOutlined />
        </template>
      </Button>
    </div>
  </div>
</template>

<style lang="scss">
  .ksd-filter {
    display: flex;
    gap: var(--ksd-filter-gap);
    align-items: center;
    flex-wrap: wrap;

    & button {
      &:focus-visible {
        z-index: 1;
      }
    }

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

    button.ksd-filter__field-button-info {
      border-top-right-radius: 0;
      border-bottom-right-radius: 0;
      border-right-color: transparent;
    }
    button.ksd-filter__field-button-operator {
      border-radius: 0;
      border-right-color: transparent;
    }
    button.ksd-filter__field-button-value {
      border-radius: 0;
      border-right-color: transparent;
    }

    button.ksd-filter__field-button-close {
      border-top-left-radius: 0;
      border-bottom-left-radius: 0;
      color: var(--ksd-icon-color);
    }
    button.ksd-filter__button-filter {
      &.clear {
        border-top-right-radius: 0;
        border-bottom-right-radius: 0;
        border-right-color: transparent;
      }
    }
    button.ksd-filter__button-clear {
      border-top-left-radius: 0;
      border-bottom-left-radius: 0;
      color: var(--ksd-icon-color);
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
      &.number-container {
        display: flex;
        gap: var(--ksd-margin-xs);
        align-items: center;
      }
    }
  }
</style>
