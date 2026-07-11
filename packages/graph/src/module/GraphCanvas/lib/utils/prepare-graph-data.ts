import type { LinkInterface, NodeInterface } from "../../types";
import { extractLinkPointIds } from "./extract-link-point-ids";

type PrepareGraphOptions<
  NodeData extends Record<string, unknown>,
  LinkData extends Record<string, unknown>,
> = {
  nodes: NodeInterface<NodeData>[];
  links: LinkInterface<NodeData, LinkData>[];
  neighbors?: boolean;
};
export function prepareGraph<
  NodeData extends Record<string, unknown>,
  LinkData extends Record<string, unknown>,
>(opts: PrepareGraphOptions<NodeData, LinkData>) {
  const nodes = opts.nodes;
  const links = opts.links;
  const map = new Map<string | number, NodeInterface<NodeData>>();
  const neighbors = new Map<string | number, (string | number)[]>();

  for (let i = 0; i < links.length; i++) {
    const link = links[i];
    const { sourceId, targetId } = extractLinkPointIds(link);
    const sources = neighbors.get(sourceId);
    if (sources) {
      sources.push(targetId);
    } else {
      neighbors.set(sourceId, [targetId]);
    }
    const targets = neighbors.get(targetId);
    if (targets) {
      targets.push(sourceId);
    } else {
      neighbors.set(targetId, [sourceId]);
    }
  }

  for (let i = 0; i < nodes.length; i++) {
    const node = nodes[i];
    map.set(node.id, node);
    node.index = i;
    node.x ??= 0;
    node.y ??= 0;
    if (opts.neighbors) {
      const n = neighbors.get(node.id);
      if (n) {
        node.neighbors = [...new Set(n)];
        node.linkCount = node.neighbors.length;
      }
    }
  }

  for (let i = 0; i < links.length; i++) {
    const link = links[i];
    const { sourceId, targetId } = extractLinkPointIds(link);
    link.source = map.get(sourceId) ?? link.source;
    link.target = map.get(targetId) ?? link.target;
  }
}
