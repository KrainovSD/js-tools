<script setup lang="ts">
  import { isArray, isId, isNumber, isString } from "@krainovsd/js-helpers";
  import { VCloseCircleFilled, VFilterOutlined } from "@krainovsd/vue-icons";
  import { type Component, computed, markRaw, onMounted, shallowRef } from "vue";
  import Button, { type ButtonSize } from "./Button.vue";
  import DropDown, { type DropDownMenuItem } from "./DropDown.vue";
  import Input, { type InputVariant } from "./Input.vue";
  import InputNumber from "./InputNumber.vue";
  import Popover from "./Popover.vue";
  import type { SelectItem, SelectValue } from "./Select.vue";
  import Select from "./Select.vue";
  import Tooltip from "./Tooltip.vue";

  export type FilterComponentProps = {
    select: FilterSelectComponentProps;
    text: FilterTextComponentProps;
    number: FilterNumberComponentProps;
    range: FilterNumberComponentProps;
    date: FilterDateComponentProps;
    "date-range": FilterDateComponentProps;
  };
  export type FilterComponent = keyof FilterComponentProps;

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
  export type FilterDateComponentProps = {};

  export type FilterItem = {
    [K in keyof FilterComponentProps]: {
      props?: FilterComponentProps[K];
      field: string;
      operators?: SelectItem[];
      label: string;
      component: K;
      icon?: Component;
    };
  }[keyof FilterComponentProps];

  export type FilterProps = {
    filters: FilterItem[];
    label?: string;
    icon?: Component;
    buttonSize?: ButtonSize;
    controlSize?: ButtonSize;
    controlVariant?: InputVariant;
  };

  const props = withDefaults(defineProps<FilterProps>(), {
    label: "Фильтр",
    buttonSize: "default",
    controlSize: "default",
    controlVariant: "outlined",
    icon: undefined,
  });
  const form = defineModel<Record<string, unknown>>({ default: {} });
  const operators = defineModel<Record<string, unknown>>("operators", { default: {} });
  const openedFields = shallowRef<string[]>([]);

  function openFilter(field: string) {
    openedFields.value = [...openedFields.value, field];
  }
  function closeFilter(field: string) {
    openedFields.value = openedFields.value.filter((filter) => filter !== field);
    if (form.value[field] != undefined) {
      delete form.value[field];
    }
  }

  const dropMenu = computed(() =>
    props.filters.reduce<DropDownMenuItem[]>((acc, filter) => {
      if (!openedFields.value.includes(filter.field)) {
        acc.push({
          key: filter.field,
          icon: filter.icon ? markRaw(filter.icon) : undefined,
          label: filter.label,
          onClick: () => openFilter(filter.field),
        });
      }

      return acc;
    }, []),
  );
  const openedFilters = computed(() =>
    props.filters.filter((filter) => openedFields.value.includes(filter.field)),
  );
  const filterClasses = computed(() => ({ [`control-size-${props.controlSize}`]: true }));

  function extractFilterDisplayValue(filter: FilterItem) {
    let displayValue: string = "";
    const filterValue = form.value[filter.field];

    if (filter.component === "select") {
      if (filter.props?.multiple) {
        const tempValue = isArray(filterValue)
          ? filterValue.map(
              (value) =>
                filter.props?.options?.find?.((option) => option.value === value)?.label ?? value,
            )
          : [];
        displayValue = tempValue.join(", ");
      } else {
        displayValue = isId(filterValue)
          ? (
              filter.props?.options?.find?.((option) => option.value === filterValue)?.label ??
              filterValue
            ).toString()
          : "";
      }
    } else {
      displayValue = isId(filterValue)
        ? filterValue.toString()
        : isArray(filterValue)
          ? filterValue.join(", ")
          : "";
    }

    return displayValue;
  }

  onMounted(() => {
    openedFields.value = Object.keys(form.value);

    for (let i = 0; i < props.filters.length; i++) {
      const filter = props.filters[i];
      if (
        filter.operators &&
        filter.operators.length > 0 &&
        operators.value[filter.field] == undefined
      ) {
        operators.value[filter.field] = filter.operators[0].value;
      }
    }
  });
</script>

<template>
  <div class="ksd-filter" :class="filterClasses">
    <DropDown :menu="dropMenu">
      <Button :size="$props.buttonSize">
        <template #icon>
          <component :is="$props.icon" v-if="$props.icon" class="ksd-filter__icon" />
          <VFilterOutlined v-if="!$props.icon" class="ksd-filter__icon" />
        </template>
        {{ $props.label }}
      </Button>
    </DropDown>
    <div v-for="filter in openedFilters" :key="filter.field" class="ksd-filter__field">
      <DropDown
        v-if="filter.operators && filter.operators.length > 0"
        :menu="
          filter.operators.map((operator) => ({
            key: String(operator.value),
            label: operator.label,
            onClick: () => {
              operators[filter.field] = operator.value;
            },
          }))
        "
      >
        <Button :size="$props.buttonSize" class="ksd-filter__field-button-operator">{{
          filter.operators?.find?.((operator) => operator.value === operators[filter.field])
            ?.label ?? operators[filter.field]
        }}</Button>
      </DropDown>

      <Popover :size="$props.controlSize">
        <Button
          :size="$props.buttonSize"
          class="ksd-filter__field-button-content"
          :class="{ operator: filter.operators && filter.operators.length > 0 }"
        >
          <component :is="filter.icon" v-if="filter.icon" class="ksd-filter__field-icon" />
          <div class="ksd-filter__field-content">
            <span class="ksd-filter__field-label">
              {{ filter.label }}
            </span>
            {{ ":" }}
            <Tooltip :text="extractFilterDisplayValue(filter)" :open-not-visible="true">
              <span class="ksd-filter__field-value"> {{ extractFilterDisplayValue(filter) }} </span>
            </Tooltip>
          </div>
        </Button>
        <template #content>
          <Input
            v-if="filter.component === 'text'"
            :model-value="isString(form[filter.field]) ? (form[filter.field] as string) : undefined"
            :size="$props.controlSize"
            :variant="$props.controlVariant"
            :allow-clear="filter.props?.allowClear"
            :placeholder="filter.props?.placeholder"
            class="ksd-filter__field-control text"
            @update:model-value="(value) => (form[filter.field] = value)"
          />
          <InputNumber
            v-if="filter.component === 'number'"
            :model-value="isNumber(form[filter.field]) ? (form[filter.field] as number) : undefined"
            :size="$props.controlSize"
            :variant="$props.controlVariant"
            :placeholder="filter.props?.placeholder"
            :min="filter.props?.min"
            :max="filter.props?.max"
            :step="filter.props?.step"
            class="ksd-filter__field-control number"
            @update:model-value="(value) => (form[filter.field] = value)"
          />
          <template v-if="filter.component === 'range'">
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
  </div>
</template>

<style lang="scss">
  .ksd-filter {
    display: flex;
    gap: var(--ksd-filter-gap);
    align-items: center;
    flex-wrap: wrap;

    &__field {
      display: flex;
      align-items: center;

      & > button {
        &:focus-visible {
          z-index: 1;
        }
      }
    }

    button.ksd-filter__field-button-operator {
      border-top-right-radius: 0;
      border-bottom-right-radius: 0;
      border-right-color: transparent;
    }
    button.ksd-filter__field-button-content {
      border-top-right-radius: 0;
      border-bottom-right-radius: 0;
      border-right-color: transparent;

      &.operator {
        border-top-left-radius: 0;
        border-bottom-left-radius: 0;
      }
    }
    button.ksd-filter__field-button-close {
      border-top-left-radius: 0;
      border-bottom-left-radius: 0;
      color: var(--ksd-icon-color);
    }

    &__field-content {
      display: flex;
      align-items: center;
    }
    &__field-label {
      max-width: 150px;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }

    &__field-value {
      max-width: 150px;
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
