import { checkType } from "@/lib";
import type { GraphCanvas } from "../../GraphCanvas";
import type { NodeInterface, NodeIterationPropsInterface } from "../../types";

export function nodeIterationExtractor<
  NodeData extends Record<string, unknown>,
  LinkData extends Record<string, unknown>,
  Result extends string | number | boolean | Record<string, unknown> | unknown[] | undefined | null,
>(
  node: NodeInterface<NodeData>,
  i: number,
  nodes: NodeInterface<NodeData>[],
  state: GraphCanvas<NodeData, LinkData>,
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
  state: GraphCanvas<NodeData, LinkData>,
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
  state: GraphCanvas<NodeData, LinkData>,
  option: NodeIterationPropsInterface<NodeData, LinkData, Result> | Result,
  optionConstantGetter:
    | NodeIterationPropsInterface<NodeData, LinkData, Result>
    | Result
    | undefined,
) {
  let customOptions: Result | undefined;
  let constantOptions: Result | undefined;

  if (typeof option === "function") customOptions = option.call(state, node, i, nodes);
  else customOptions = option;

  if (customOptions && typeof customOptions === "object" && !Array.isArray(customOptions)) {
    for (const key in customOptions) {
      if (customOptions[key] === undefined) delete customOptions[key];
    }
  }

  if (optionConstantGetter) {
    if (typeof optionConstantGetter === "function")
      constantOptions = optionConstantGetter.call(state, node, i, nodes);
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
