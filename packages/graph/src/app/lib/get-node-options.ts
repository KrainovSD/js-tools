import type { GraphCanvas, NodeInterface, NodeOptionsInterface } from "@/module/GraphCanvas";
import { HIGHLIGHT_COLOR, SELECT_COLOR } from "../constants";
import type { LinkData, Node, NodeData } from "../types";

export function getNodeOptions(
  opts: Partial<NodeOptionsInterface<NodeData, LinkData>>,
  selectedNode: Node | null,
  selectedNodes: Node[],
) {
  return function nodeOptions(
    this: GraphCanvas<NodeData, LinkData>,
    node: NodeInterface<NodeData>,
  ): NodeOptionsInterface<NodeData, LinkData> {
    const highlight = selectedNode?.id === node.id;
    const selected = selectedNodes.includes(node);

    if (node.name === "Cited Works 70") {
      node.visible = false;
    }

    return {
      ...opts,
      borderColor: highlight ? HIGHLIGHT_COLOR : selected ? SELECT_COLOR : "transparent",
      borderWidth: highlight || selected ? 0.5 : 0.2,
      textSize: opts.textSize ?? (opts.shape === "text" ? 3.5 : undefined),
      // nodeExtraDraw(node) {
      //   if (!this.context) return;
      //   this.context.strokeStyle = "aqua";
      //   this.context.lineWidth = 1;
      //   this.context.beginPath();
      //   this.context.arc(node.x ?? 0, node.y ?? 0, (node._radius ?? 5) + 5, 0, 2 * Math.PI);
      //   this.context.stroke();
      // },
    };
  };
}
