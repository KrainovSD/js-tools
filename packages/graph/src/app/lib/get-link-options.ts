import type { GraphCanvas, LinkOptionsInterface } from "@/module/GraphCanvas";
import type { LinkData, NodeData } from "../types";

export function getLinkOptions(opts: Partial<LinkOptionsInterface<NodeData, LinkData>>) {
  return function getLinkOptions(
    this: GraphCanvas<NodeData, LinkData>,
  ): LinkOptionsInterface<NodeData, LinkData> {
    return {
      ...opts,
    };
  };
}
