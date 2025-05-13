import type { GraphCanvas, LinkOptionsInterface } from "@/module/GraphCanvas";
import type { LinkData, NodeData } from "../types";

export function getLinkSettings(opts: Partial<LinkOptionsInterface<NodeData, LinkData>>) {
  return function getLinkSettings(
    this: GraphCanvas<NodeData, LinkData>,
  ): LinkOptionsInterface<NodeData, LinkData> {
    return {
      ...opts,
    };
  };
}
