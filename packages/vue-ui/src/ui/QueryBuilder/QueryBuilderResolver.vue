<script
  setup
  lang="ts"
  generic="F extends string | number, O extends string | number, C extends string | number"
>
  import type { ButtonSize } from "../Button.vue";
  import type { FilterItem } from "../Filter.vue";
  import type { InputSize, InputVariant } from "../Input.vue";
  import type { SelectItem } from "../Select.vue";
  import type { QueryCombinator, QueryCondition } from "./QueryBuilder.vue";
  import QueryBuilderGroup from "./QueryBuilderGroup.vue";
  import QueryBuilderRule from "./QueryBuilderRule.vue";

  type Props = {
    fields: FilterItem<F, O>[];
    combinators: QueryCombinator<C>[];
    level: number;
    buttonSize: ButtonSize;
    controlSize: InputSize;
    controlVariant: InputVariant;
    fieldVariants: SelectItem[];
    firstField: F;
    firstCombinator: C;
    firstOperator: O;
  };
  const props = defineProps<Props>();
  const model = defineModel<QueryCondition<F, O, C>[]>({ default: [] });

  function addRule() {}
  function addGroup() {}
  function deleteGroup() {}
  function changeGroup() {}
</script>

<template>
  <template v-for="query in model" :key="query.id">
    <QueryBuilderGroup
      v-if="query.type == 'group'"
      :fields="$props.fields"
      :combinators="$props.combinators"
      :group="query"
      :root="$props.level === 0"
    />
    <QueryBuilderRule
      v-else
      :fields="$props.fields"
      :combinators="$props.combinators"
      :rule="query"
      :field-variants="$props.fieldVariants"
    />
  </template>
</template>

<style lang="scss">
  .ksd-query-builder {
  }
</style>
