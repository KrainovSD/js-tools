import { cloneDeep } from "@krainovsd/js-helpers";
import { type GraphCanvasInterface, prepareGraph } from "@/module/GraphCanvas";
import type { LinkData, NodeData } from "../types";

export function prepareData(
  data: Pick<GraphCanvasInterface<NodeData, LinkData>, "nodes" | "links">,
) {
  const links = cloneDeep(data.links);
  const nodes = cloneDeep(data.nodes);

  nodes.forEach((node) => {
    node.label = "+5";
  });

  prepareGraph({
    neighbors: true,
    links,
    nodes,
  });

  return {
    nodes,
    links,
  };
}
