import type { ZoomTransform } from "d3";
import { checkType } from "@/lib";
import type { NodeInterface } from "@/types";
import type { GraphCanvasNodeIterationProps } from "../../types";

export function nodeIterationExtractor<
  NodeData extends Record<string, unknown>,
  Result extends string | number | boolean | Record<string, unknown> | unknown[] | undefined | null,
>(
  node: NodeInterface<NodeData>,
  i: number,
  nodes: NodeInterface<NodeData>[],
  transform: ZoomTransform,
  option: GraphCanvasNodeIterationProps<NodeData, Result> | Result,
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
  option: GraphCanvasNodeIterationProps<NodeData, Result> | Result,
  optionConstantGetter: GraphCanvasNodeIterationProps<NodeData, Result> | Result,
): Required<Result>;
export function nodeIterationExtractor<
  NodeData extends Record<string, unknown>,
  Result extends string | number | boolean | Record<string, unknown> | unknown[] | undefined | null,
>(
  node: NodeInterface<NodeData>,
  i: number,
  nodes: NodeInterface<NodeData>[],
  transform: ZoomTransform,
  option: GraphCanvasNodeIterationProps<NodeData, Result> | Result,
  optionConstantGetter: GraphCanvasNodeIterationProps<NodeData, Result> | Result | undefined,
) {
  let customOptions: Result | undefined;
  let constantOptions: Result | undefined;

  if (typeof option === "function") customOptions = option(node, i, nodes, transform);
  else customOptions = option;

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
          (typeof customOptions === "object" && !Array.isArray(constantOptions)),
      )
    ) {
      return {
        ...constantOptions,
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
        ...((customOptions as Record<string, unknown> | undefined) || {}),
      } as Result;
    }
  }

  return customOptions;
}
