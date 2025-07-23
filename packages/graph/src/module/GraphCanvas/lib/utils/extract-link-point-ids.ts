import type { LinkInterface } from "../../types";

export function extractLinkPointIds<
  NodeData extends Record<string, unknown>,
  LinkData extends Record<string, unknown>,
>(link: LinkInterface<NodeData, LinkData>) {
  const sourceId = typeof link.source === "object" ? link.source.id : link.source;
  const targetId = typeof link.target === "object" ? link.target.id : link.target;

  return { sourceId, targetId };
}
