import type { ZoomTransform } from "d3-zoom";
import { checkType } from "@/lib";
import type { NodeInterface } from "@/types";
import type { NodeIterationPropsInterface } from "../../types";

export function nodeIterationExtractor<
  NodeData extends Record<string, unknown>,
  Result extends string | number | boolean | Record<string, unknown> | unknown[] | undefined | null,
>(
  node: NodeInterface<NodeData>,
  i: number,
  nodes: NodeInterface<NodeData>[],
  transform: ZoomTransform,
  option: NodeIterationPropsInterface<NodeData, Result> | Result,
  optionConstantGetter: undefined,
): Result;
export function nodeIterationExtractor<
  NodeData extends Record<string, unknown>,
  Result extends string | number | boolean | Record<string, unknown> | unknown[] | undefined | null,
>(
  node: NodeInterface<NodeData>,
  i: number,
  nodes: NodeInterface<NodeData>[],
  transform: ZoomTransform,
  option: NodeIterationPropsInterface<NodeData, Result> | Result,
  optionConstantGetter: NodeIterationPropsInterface<NodeData, Result> | Result,
): Required<Result>;
export function nodeIterationExtractor<
  NodeData extends Record<string, unknown>,
  Result extends string | number | boolean | Record<string, unknown> | unknown[] | undefined | null,
>(
  node: NodeInterface<NodeData>,
  i: number,
  nodes: NodeInterface<NodeData>[],
  transform: ZoomTransform,
  option: NodeIterationPropsInterface<NodeData, Result> | Result,
  optionConstantGetter: NodeIterationPropsInterface<NodeData, Result> | Result | undefined,
) {
  let customOptions: Result | undefined;
  let constantOptions: Result | undefined;

  if (typeof option === "function") customOptions = option(node, i, nodes, transform);
  else customOptions = option;

  if (customOptions && typeof customOptions === "object" && !Array.isArray(customOptions)) {
    for (const key in customOptions) {
      if (customOptions[key] === undefined) delete customOptions[key];
    }
  }

  if (optionConstantGetter) {
    if (typeof optionConstantGetter === "function")
      constantOptions = optionConstantGetter(node, i, nodes, transform);
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
