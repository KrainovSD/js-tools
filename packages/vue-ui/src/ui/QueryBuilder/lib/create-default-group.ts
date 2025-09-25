import { generateId } from "../../../lib/generate-id";
import type { QueryConditionGroup } from "../QueryBuilder.vue";

export function createDefaultGroup<
  F extends string | number,
  O extends string | number,
  C extends string | number,
>(combinator: C): QueryConditionGroup<F, O, C> {
  return { type: "group", rules: [], combinator, id: generateId() };
}
