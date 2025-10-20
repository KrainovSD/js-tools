<script setup lang="ts" generic="F extends string | number, O extends string | number">
  import { computed, nextTick, useTemplateRef } from "vue";
  import FilterBody from "./FilterBody.vue";
  import type { FilterItem, FilterProps } from "./filter.types";

  withDefaults(defineProps<FilterProps<F, O>>(), {
    label: "Фильтр",
    buttonSize: "default",
    controlSize: "default",
    controlVariant: "outlined",
    displayedDateFormat: "DD-MM-YYYY",
    icon: undefined,
    direction: "right",
    wrap: true,
  });
  const filterRef = useTemplateRef("filter-component");
  const filterBodyComponentTef = useTemplateRef("body");
  const filter = defineModel<FilterItem<F, O>[]>({ default: [] });
  const rootRef = computed(
    () => filterRef.value ?? filterBodyComponentTef.value?.element?.parentElement,
  );

  function focus(field: string | number | undefined) {
    if (!rootRef.value) return;

    void nextTick(() => {
      if (field) {
        rootRef.value
          ?.querySelector?.<HTMLElement>(`button.ksd-filter__field-button-info[data-id='${field}']`)
          ?.focus?.();
      } else {
        rootRef.value?.querySelector?.<HTMLElement>(`button.ksd-filter__button-filter`)?.focus?.();
      }
    });
  }
</script>

<template>
  <div v-if="$props.wrap == undefined || $props.wrap" ref="filter-component" class="ksd-filter">
    <FilterBody ref="body" v-model="filter" v-bind="$props" @focus="focus" />
  </div>
  <FilterBody v-else ref="body" v-model="filter" v-bind="$props" @focus="focus" />
</template>

<style lang="scss">
  .ksd-filter {
    display: flex;
    gap: var(--ksd-filter-gap);
    align-items: center;
    flex-wrap: wrap;
  }
</style>
