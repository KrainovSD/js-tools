import type { NodeInterface } from "@/types";
import type { NodeIterationProps } from "../GraphCanvas.types";

export function nodeIterationExtractor<
  NodeData extends Record<string, unknown>,
  Result extends string | number | boolean | Record<string, unknown> | unknown[],
>(
  node: NodeInterface<NodeData>,
  i: number,
  nodes: NodeInterface<NodeData>[],
  option: NodeIterationProps<NodeData, Result> | Result,
): Result {
  if (typeof option === "function") return option(node, i, nodes);

  return option;
}
