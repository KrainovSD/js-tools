<script
  setup
  lang="ts"
  generic="F extends string | number, O extends string | number, C extends string | number"
>
  import { randomNumber } from "@krainovsd/js-helpers";
  import type { ButtonSize } from "../Button.vue";
  import type { InputSize, InputVariant } from "../Input.vue";
  import type { SelectItem } from "../Select.vue";
  import type {
    QueryCombinator,
    QueryCondition,
    QueryConditionGroup,
    QueryConditionRule,
    QueryField,
  } from "./QueryBuilder.vue";
  import QueryBuilderGroup from "./QueryBuilderGroup.vue";
  import QueryBuilderRule from "./QueryBuilderRule.vue";

  type Props = {
    /** the common list of fields with available operators and ui components */
    fields: QueryField<F, O>[];
    /** the list of available combinators */
    combinators: QueryCombinator<C>[];
    /** the level of recursion */
    level: number;
    /** the size of buttons */
    buttonSize: ButtonSize;
    /** the size of controls */
    controlSize: InputSize;
    /** this variant of controls */
    controlVariant: InputVariant;
    /** the field list extracted from common list for select */
    fieldVariants: SelectItem<F>[];
    /** the first field extracted from common list for auto set */
    firstField: F;
    /** the first combinator extracted from common list for auto set */
    firstCombinator: C;
    /** the first operator extracted from common list for auto set */
    firstOperator: O;
  };
  const props = defineProps<Props>();
  const model = defineModel<QueryCondition<F, O, C>[]>({ default: [] });

  function addRule(group: QueryConditionGroup<F, O, C>) {
    model.value = model.value.map((r) =>
      r === group
        ? {
            ...r,
            rules: [
              ...r.rules,
              {
                type: "rule",
                field: props.firstField,
                operator: props.firstOperator,
                id: randomNumber(),
                value: null,
              },
            ],
          }
        : r,
    );
  }
  function deleteRule(rule: QueryConditionRule<F, O>) {
    model.value = model.value.filter((r) => r !== rule);
  }
  function changeRule(rule: QueryConditionRule<F, O>, newRule: QueryConditionRule<F, O>) {
    model.value = model.value.map((r) => (r === rule ? newRule : r));
  }
  function addGroup(group: QueryConditionGroup<F, O, C>) {
    model.value = model.value.map((r) =>
      r === group
        ? {
            ...r,
            rules: [
              ...r.rules,
              {
                type: "group",
                combinator: props.firstCombinator,
                id: randomNumber(),
                rules: [],
              },
            ],
          }
        : r,
    );
  }
  function deleteGroup(group: QueryConditionGroup<F, O, C>) {
    model.value = model.value.filter((r) => r !== group);
  }
  function changeGroupCombinator(group: QueryConditionGroup<F, O, C>, combinator: C) {
    model.value = model.value.map((r) => (r === group ? { ...r, combinator } : r));
  }
  function changeGroupRules(group: QueryConditionGroup<F, O, C>, rules: QueryCondition<F, O, C>[]) {
    model.value = model.value.map((r) => (r === group ? { ...r, rules } : r));
  }
</script>

<template>
  <template v-for="query in model" :key="query.id">
    <QueryBuilderGroup
      v-if="query.type == 'group' && $props.level === 0"
      :fields="$props.fields"
      :combinators="$props.combinators"
      :group="query"
      :level="$props.level"
      :root="$props.level === 0"
      :button-size="$props.buttonSize"
      @add-group="() => addGroup(query)"
      @add-rule="() => addRule(query)"
      @delete-group="() => deleteGroup(query)"
      @change-group-combinator="(value) => changeGroupCombinator(query, value)"
    >
      <QueryBuilderResolver
        :fields="$props.fields"
        :combinators="$props.combinators"
        :level="$props.level + 1"
        :button-size="$props.buttonSize"
        :control-size="$props.controlSize"
        :control-variant="$props.controlVariant"
        :first-combinator="firstCombinator"
        :first-field="firstField"
        :first-operator="firstOperator"
        :field-variants="fieldVariants"
        :model-value="query.rules"
        @update:model-value="(rules) => changeGroupRules(query, rules)"
      />
    </QueryBuilderGroup>
    <div
      v-else-if="query.type == 'group'"
      class="ksd-query-builder__group-wrap"
      :style="{ '--level': $props.level }"
    >
      <QueryBuilderGroup
        :fields="$props.fields"
        :combinators="$props.combinators"
        :group="query"
        :level="$props.level"
        :root="$props.level === 0"
        :button-size="$props.buttonSize"
        @add-group="() => addGroup(query)"
        @add-rule="() => addRule(query)"
        @delete-group="() => deleteGroup(query)"
        @change-group-combinator="(value) => changeGroupCombinator(query, value)"
      >
        <QueryBuilderResolver
          :fields="$props.fields"
          :combinators="$props.combinators"
          :level="$props.level + 1"
          :button-size="$props.buttonSize"
          :control-size="$props.controlSize"
          :control-variant="$props.controlVariant"
          :first-combinator="firstCombinator"
          :first-field="firstField"
          :first-operator="firstOperator"
          :field-variants="fieldVariants"
          :model-value="query.rules"
          @update:model-value="(rules) => changeGroupRules(query, rules)"
        />
      </QueryBuilderGroup>
    </div>
    <div v-else class="ksd-query-builder__rule-wrap" :style="{ '--level': $props.level }">
      <QueryBuilderRule
        :fields="$props.fields"
        :combinators="$props.combinators"
        :rule="query"
        :field-variants="$props.fieldVariants"
        :button-size="$props.buttonSize"
        :control-size="$props.controlSize"
        :control-variant="$props.controlVariant"
        @update-rule="(rule) => changeRule(query, rule)"
        @delete-rule="() => deleteRule(query)"
      />
    </div>
  </template>
</template>

<style lang="scss">
  .ksd-query-builder {
    &__rule-wrap {
      padding-left: calc(48px * var(--level));
      position: relative;

      &::before {
        content: "";
        position: absolute;
        width: 0.5rem;
        border-style: solid;
        border-width: 0px 0px 1px 1px;
        border-radius: 0px;
        border-color: var(--ksd-border-color);
        left: calc(44px * var(--level));
        height: 65px;
        top: -35px;
      }
      &:first-child::before {
        height: 30px;
        top: 0px;
      }
    }
    &__group-wrap {
      position: relative;

      &::after {
        content: "";
        position: absolute;
        width: 0.5rem;
        border-style: solid;
        border-width: 0px 0px 0px 1px;
        border-radius: 0px;
        border-color: var(--ksd-border-color);
        left: calc(44px * var(--level));
        height: calc(100% - 26px);
        top: 0%;
      }

      &::before {
        content: "";
        position: absolute;
        width: 0.5rem;
        border-style: solid;
        border-width: 0px 0px 1px 1px;
        border-radius: 0px;
        border-color: var(--ksd-border-color);
        left: calc(44px * var(--level));
        height: 65px;
        top: -35px;
      }
    }
  }
</style>
