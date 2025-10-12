import { cloneDeep } from "@krainovsd/js-helpers";
import type { GraphCanvasInterface } from "@/module/GraphCanvas";
import type { LinkData, NodeData } from "../types";

export function getNodeNeighbors(
  data: Pick<GraphCanvasInterface<NodeData, LinkData>, "nodes" | "links">,
) {
  const neighbors: Record<string, (string | number)[]> = {};
  const links = cloneDeep(data.links);
  const nodes = cloneDeep(data.nodes);

  links.forEach((link) => {
    if (typeof link.source === "object" || typeof link.target === "object") return;

    const prevSource = neighbors[link.source];
    if (prevSource) prevSource.push(link.target);
    else neighbors[link.source] = [link.target];

    const prevTarget = neighbors[link.target];
    if (prevTarget) prevTarget.push(link.source);
    else neighbors[link.target] = [link.source];
  });

  nodes.forEach((node) => {
    if (neighbors[node.id]) {
      node.neighbors = [...new Set(neighbors[node.id])];
      node.linkCount = neighbors[node.id].length;
    }

    if (node.data?.image) {
      const image = new Image();
      image.src = node.data.image;
      node.image = image;
    }

    node.label = "+5";
  });

  return {
    nodes,
    links,
  };
}
