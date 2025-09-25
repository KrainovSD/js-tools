<script
  setup
  lang="ts"
  generic="F extends string | number, O extends string | number, C extends string | number"
>
  import { computed } from "vue";
  import Control from "../Control.vue";
  import type { FilterItem } from "../Filter.vue";
  import Input from "../Input.vue";
  import Select, { type SelectItem } from "../Select.vue";
  import type { QueryCombinator, QueryConditionRule } from "./QueryBuilder.vue";

  type Props = {
    fields: FilterItem<F, O>[];
    combinators: QueryCombinator<C>[];
    rule: QueryConditionRule<F, O>;
    fieldVariants: SelectItem[];
  };
  type Emits = {
    updateRule: [rule: QueryConditionRule<F, O>];
  };

  const props = defineProps<Props>();
  defineEmits<Emits>();

  const operatorVariants = computed<SelectItem[]>(() => {
    const field = props.fields.find((f) => f.field === props.rule.field);
    if (!field) return [];

    return field.components.map<SelectItem>((c) => ({
      label: c.operatorLabel,
      value: c.operatorValue,
    }));
  });
</script>

<template>
  <div class="ksd-query-builder__rule">
    <Select :model-value="$props.rule.field" :options="$props.fieldVariants" />
    <Select />
    <Input />
    <Control />
  </div>
</template>

<style lang="scss">
  .ksd-query-builder {
    display: flex;
    align-items: center;
    gap: var(--ksd-padding-sm);
  }
</style>
