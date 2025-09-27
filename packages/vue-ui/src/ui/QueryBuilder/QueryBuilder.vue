<script
  setup
  lang="ts"
  generic="F extends string | number, O extends string | number, C extends string | number"
>
  import { randomNumber } from "@krainovsd/js-helpers";
  import { computed } from "vue";
  import type { ButtonSize } from "../Button.vue";
  import type { FilterItem } from "../Filter.vue";
  import type { InputSize, InputVariant } from "../Input.vue";
  import type { SelectItem } from "../Select.vue";
  import type { TagColor } from "../Tag.vue";
  import QueryBuilderGroup from "./QueryBuilderGroup.vue";
  import QueryBuilderResolver from "./QueryBuilderResolver.vue";
  import { createDefaultGroup } from "./lib";

  export type QueryCombinator<C extends string | number> = {
    value: C;
    label: string;
    color?: TagColor;
  };
  export type QueryConditionRule<F extends string | number, O extends string | number> = {
    id: number | string;
    type: "rule";
    field: F;
    value: unknown;
    operator: O;
  };
  export type QueryConditionGroup<
    F extends string | number,
    O extends string | number,
    C extends string | number,
  > = {
    id: number | string;
    type: "group";
    combinator: C;
    rules: QueryCondition<F, O, C>[];
  };
  export type QueryCondition<
    F extends string | number,
    O extends string | number,
    C extends string | number,
  > = QueryConditionRule<F, O> | QueryConditionGroup<F, O, C>;

  export type QueryBuilderProps<
    F extends string | number,
    O extends string | number,
    C extends string | number,
  > = {
    fields: FilterItem<F, O>[];
    combinators: QueryCombinator<C>[];
    buttonSize?: ButtonSize;
    controlSize?: InputSize;
    controlVariant?: InputVariant;
  };

  const props = withDefaults(defineProps<QueryBuilderProps<F, O, C>>(), {
    buttonSize: "default",
    controlSize: "default",
    controlVariant: "outlined",
  });
  const model = defineModel<QueryCondition<F, O, C>[]>({ default: [] });
  const firstField = computed(() => props.fields?.[0]?.field);
  const firstOperator = computed(() => props.fields?.[0]?.components?.[0]?.operatorValue);
  const firstCombinator = computed(() => props.combinators?.[0]?.value);

  function addRule() {
    if (!firstOperator.value) return;

    model.value = [
      {
        type: "group",
        combinator: props.combinators[0].value,
        id: randomNumber(),
        rules: [
          {
            type: "rule",
            field: props.fields[0].field,
            id: randomNumber(),
            operator: firstOperator.value,
            value: undefined,
          },
        ],
      },
    ];
  }
  function addGroup() {
    if (!firstCombinator.value) return;

    model.value = [
      { type: "group", combinator: firstCombinator.value, id: randomNumber(), rules: [] },
    ];
  }
  function changeGroup(combinator: C) {
    model.value = [{ type: "group", combinator, id: randomNumber(), rules: [] }];
  }

  const fieldVariants = computed<SelectItem[]>(() =>
    props.fields.map<SelectItem>((f) => ({ label: f.label, value: f.field })),
  );

  const hasFirst = computed(
    () =>
      firstField.value != undefined &&
      firstCombinator.value != undefined &&
      firstOperator.value != undefined,
  );
</script>

<template>
  <div v-if="hasFirst" class="ksd-query-builder">
    <QueryBuilderGroup
      v-if="model.length === 0"
      :fields="$props.fields"
      :combinators="$props.combinators"
      :group="createDefaultGroup(firstCombinator)"
      :root="true"
      @add-group="addGroup"
      @add-rule="addRule"
      @change-group="(combinator) => changeGroup(combinator)"
    />
    <QueryBuilderResolver
      v-else
      v-model="model"
      :fields="$props.fields"
      :combinators="$props.combinators"
      :level="0"
      :button-size="$props.buttonSize ?? 'default'"
      :control-size="$props.controlSize ?? 'default'"
      :control-variant="$props.controlVariant ?? 'outlined'"
      :first-combinator="firstCombinator"
      :first-field="firstField"
      :first-operator="firstOperator!"
      :field-variants="fieldVariants"
    />
  </div>
</template>

<style lang="scss">
  .ksd-query-builder {
    display: flex;
    flex-direction: column;
    height: 100%;
    width: 100%;
  }
</style>
