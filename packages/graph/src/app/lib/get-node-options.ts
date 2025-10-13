import type { GraphCanvas, NodeInterface, NodeOptionsInterface } from "@/module/GraphCanvas";
import { HIGHLIGHT_COLOR } from "../constants";
import type { LinkData, Node, NodeData } from "../types";

export function getNodeOptions(
  opts: Partial<NodeOptionsInterface<NodeData, LinkData>>,
  selectedNode: Node | null,
) {
  return function nodeOptions(
    this: GraphCanvas<NodeData, LinkData>,
    node: NodeInterface<NodeData>,
  ): NodeOptionsInterface<NodeData, LinkData> {
    const selected = selectedNode?.id === node.id;

    return {
      ...opts,
      borderColor: selected ? HIGHLIGHT_COLOR : "transparent",
      borderWidth: selected ? 0.5 : 0.2,
      textSize: opts.textSize ?? (opts.shape === "text" ? 3.5 : undefined),
      label: opts.shape === "text" ? node.name : node.label,
      labelColor: opts.shape === "text" ? "#000000" : "#ffffff",
      textVisible: opts.shape === "text" ? false : undefined,
    };
  };
}
