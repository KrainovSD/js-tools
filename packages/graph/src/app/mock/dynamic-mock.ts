import type { GraphInterface } from "@/module/Graph";
import type { LinkData, NodeData } from "../types";

export function createNewDynamicMock(
  oldState: Pick<GraphInterface<NodeData, LinkData>, "nodes" | "links">,
): Pick<GraphInterface<NodeData, LinkData>, "nodes" | "links"> {
  const { nodes, links } = oldState;
  const id = nodes.length;
  const target = Math.round(Math.random() * (id - 1));

  return {
    nodes: [...nodes, { id, group: 1, data: {} }],
    links: [...links, { source: id, target: target < 0 ? 0 : target }],
  };
}
