import { isArray, isObject, randomNumber } from "@krainovsd/js-helpers";
import type {
  QueryCondition,
  QueryConditionGroup,
  QueryConditionRule,
  QueryConditionShort,
} from "../QueryBuilder.vue";

export function transformQueryFromShort<
  F extends string | number,
  O extends string | number,
  C extends string | number,
>(queries: QueryConditionShort<F, O, C>[]): QueryCondition<F, O, C>[] {
  return queries.reduce((acc: QueryCondition<F, O, C>[], q) => {
    const query = transform(q);
    if (query != undefined) {
      acc.push(query);
    }

    return acc;
  }, []);
}

function transform<F extends string | number, O extends string | number, C extends string | number>(
  query: QueryConditionShort<F, O, C>,
) {
  if (!isObject(query)) return null;

  const [key, value] = Object.entries(query)[0];

  if (key == undefined || !isArray(value)) return null;

  if (isObject(value[0]) && "var" in value[0]) {
    return {
      id: randomNumber(),
      type: "rule",
      value: value[1],
      field: value[0].var as F,
      operator: key as O,
    } as QueryConditionRule<F, O>;
  }

  return {
    id: randomNumber(),
    type: "group",
    combinator: key as C,
    rules: value.reduce((acc: QueryCondition<F, O, C>[], v) => {
      const query = transform<F, O, C>(v as QueryConditionShort<F, O, C>);
      if (query != undefined) {
        acc.push(query);
      }

      return acc;
    }, []),
  } as QueryConditionGroup<F, O, C>;
}
