import type { GraphCanvasInterface } from "@/module/GraphCanvas";
import type { LinkData, NodeData } from "../types";

export function createNewDynamicMock(
  oldState: Pick<GraphCanvasInterface<NodeData, LinkData>, "nodes" | "links">,
): Pick<GraphCanvasInterface<NodeData, LinkData>, "nodes" | "links"> {
  const { nodes, links } = oldState;
  const id = nodes.length;
  const target = Math.round(Math.random() * (id - 1));

  return {
    nodes: [...nodes, { id, group: 1, data: {} }],
    links: [...links, { source: id, target: target < 0 ? 0 : target }],
  };
}
