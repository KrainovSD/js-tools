import type {
  QueryCondition,
  QueryConditionGroupShort,
  QueryConditionRuleShort,
  QueryConditionShort,
} from "../QueryBuilder.vue";

export function transformQueryToShort<
  F extends string | number,
  O extends string | number,
  C extends string | number,
>(queries: QueryCondition<F, O, C>[]): QueryConditionShort<F, O, C>[] {
  return queries.map((q) => transform(q));
}

function transform<F extends string | number, O extends string | number, C extends string | number>(
  query: QueryCondition<F, O, C>,
): QueryConditionShort<F, O, C> {
  if (query.type === "rule") {
    return { [query.operator]: [{ var: query.field }, query.value] } as QueryConditionRuleShort<
      F,
      O
    >;
  }

  return {
    [query.combinator]: query.rules.map((rule) => transform(rule)),
  } as QueryConditionGroupShort<F, O, C>;
}
