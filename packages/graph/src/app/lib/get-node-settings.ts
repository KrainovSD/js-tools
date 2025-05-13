import type { GraphCanvas, NodeInterface, NodeOptionsInterface } from "@/module/GraphCanvas";
import type { LinkData, NodeData } from "../types";

export function getNodeSettings(opts: Partial<NodeOptionsInterface<NodeData, LinkData>>) {
  return function nodeSettings(
    this: GraphCanvas<NodeData, LinkData>,
    node: NodeInterface<NodeData>,
  ): NodeOptionsInterface<NodeData, LinkData> {
    return {
      ...opts,
      textSize: opts.textSize ?? (opts.shape === "text" ? 3.5 : undefined),
      label: opts.shape === "text" ? node.name : node.label,
      labelColor: opts.shape === "text" ? "#000000" : "#ffffff",
      textVisible: opts.shape === "text" ? false : undefined,
    };
  };
}
