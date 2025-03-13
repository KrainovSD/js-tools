import { checkType } from "@/lib";
import type { NodeInterface } from "@/types";
import type { GraphState, NodeIterationPropsInterface } from "../../types";

export function nodeIterationExtractor<
  NodeData extends Record<string, unknown>,
  LinkData extends Record<string, unknown>,
  Result extends string | number | boolean | Record<string, unknown> | unknown[] | undefined | null,
>(
  node: NodeInterface<NodeData>,
  i: number,
  nodes: NodeInterface<NodeData>[],
  state: GraphState<NodeData, LinkData>,
  option: NodeIterationPropsInterface<NodeData, LinkData, Result> | Result,
  optionConstantGetter: undefined,
): Result;
export function nodeIterationExtractor<
  NodeData extends Record<string, unknown>,
  LinkData extends Record<string, unknown>,
  Result extends string | number | boolean | Record<string, unknown> | unknown[] | undefined | null,
>(
  node: NodeInterface<NodeData>,
  i: number,
  nodes: NodeInterface<NodeData>[],
  state: GraphState<NodeData, LinkData>,
  option: NodeIterationPropsInterface<NodeData, LinkData, Result> | Result,
  optionConstantGetter: NodeIterationPropsInterface<NodeData, LinkData, Result> | Result,
): Required<Result>;
export function nodeIterationExtractor<
  NodeData extends Record<string, unknown>,
  LinkData extends Record<string, unknown>,
  Result extends string | number | boolean | Record<string, unknown> | unknown[] | undefined | null,
>(
  node: NodeInterface<NodeData>,
  i: number,
  nodes: NodeInterface<NodeData>[],
  state: GraphState<NodeData, LinkData>,
  option: NodeIterationPropsInterface<NodeData, LinkData, Result> | Result,
  optionConstantGetter:
    | NodeIterationPropsInterface<NodeData, LinkData, Result>
    | Result
    | undefined,
) {
  let customOptions: Result | undefined;
  let constantOptions: Result | undefined;

  if (typeof option === "function") customOptions = option(node, i, nodes, state);
  else customOptions = option;

  if (customOptions && typeof customOptions === "object" && !Array.isArray(customOptions)) {
    for (const key in customOptions) {
      if (customOptions[key] === undefined) delete customOptions[key];
    }
  }

  if (optionConstantGetter) {
    if (typeof optionConstantGetter === "function")
      constantOptions = optionConstantGetter(node, i, nodes, state);
    else constantOptions = optionConstantGetter;

    if (
      constantOptions &&
      typeof constantOptions === "object" &&
      !Array.isArray(constantOptions) &&
      checkType<Record<string, unknown> | undefined>(
        customOptions,
        customOptions === undefined ||
          (typeof customOptions === "object" && !Array.isArray(customOptions)),
      )
    ) {
      return {
        ...(constantOptions as Record<string, unknown> | undefined),
        ...(customOptions as Record<string, unknown> | undefined),
      } as Result;
    }
  }

  return customOptions;
}
