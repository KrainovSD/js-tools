import type { LinkOptionsInterface } from "@/module/GraphCanvas";
import type { LinkData, NodeData } from "../types";

export function getLinkSettings(opts: Partial<LinkOptionsInterface<NodeData, LinkData>>) {
  return function getLinkSettings(): LinkOptionsInterface<NodeData, LinkData> {
    return {
      ...opts,
    };
  };
}
