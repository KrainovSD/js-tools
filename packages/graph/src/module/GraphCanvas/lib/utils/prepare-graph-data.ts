import type { SimulationLinkDatum, SimulationNodeDatum } from "d3-force";
import type { LinkInterface, NodeInterface } from "../../types";

type PrepareGraphDataOptions<
  NodeData extends Record<string, unknown>,
  LinkData extends Record<string, unknown>,
> = {
  nodes: NodeInterface<NodeData>[];
  links: LinkInterface<NodeData, LinkData>[];
  idGetter: (node: NodeInterface<NodeData>) => string | number;
};

/**
 * Mutates nodes and links to match the state that d3-force simulation
 * would produce after initialization + one tick.
 *
 * - Assigns `index`, `x`, `y`, `vx`, `vy` to each node
 * - Resolves link `source`/`target` from IDs to node references
 * - Assigns `index` to each link
 * - Computes `neighbors` and `linkCount` for each node
 */
export function prepareGraphData<
  NodeData extends Record<string, unknown>,
  LinkData extends Record<string, unknown>,
>({ nodes, links, idGetter }: PrepareGraphDataOptions<NodeData, LinkData>) {
  const nodeById = new Map<string | number, NodeInterface<NodeData>>();
  const initialRadius = 10;
  const initialAngle = Math.PI * (3 - Math.sqrt(5));

  for (let i = 0; i < nodes.length; i++) {
    const node = nodes[i];
    (node as SimulationNodeDatum & { index: number }).index = i;

    if (node.x == undefined) {
      const radius = initialRadius * Math.sqrt(0.5 + i);
      const angle = i * initialAngle;
      node.x = radius * Math.cos(angle);
    }
    if (node.y == undefined) {
      const radius = initialRadius * Math.sqrt(0.5 + i);
      const angle = i * initialAngle;
      node.y = radius * Math.sin(angle);
    }
    node.vx = 0;
    node.vy = 0;

    nodeById.set(idGetter(node), node);
  }

  // Build neighbor map
  const neighborMap = new Map<string | number, Set<string | number>>();

  for (let i = 0; i < links.length; i++) {
    const link = links[i];
    (link as SimulationLinkDatum<NodeInterface<NodeData>> & { index: number }).index = i;

    if (typeof link.source !== "object") {
      const sourceNode = nodeById.get(link.source as string | number);
      if (sourceNode) link.source = sourceNode;
    }
    if (typeof link.target !== "object") {
      const targetNode = nodeById.get(link.target as string | number);
      if (targetNode) link.target = targetNode;
    }

    // Track neighbors
    const sourceId = typeof link.source === "object" ? link.source.id : link.source;
    const targetId = typeof link.target === "object" ? link.target.id : link.target;

    if (sourceId != undefined && targetId != undefined) {
      let sNeighbors = neighborMap.get(sourceId);
      if (!sNeighbors) {
        sNeighbors = new Set();
        neighborMap.set(sourceId, sNeighbors);
      }
      sNeighbors.add(targetId);

      let tNeighbors = neighborMap.get(targetId);
      if (!tNeighbors) {
        tNeighbors = new Set();
        neighborMap.set(targetId, tNeighbors);
      }
      tNeighbors.add(sourceId);
    }
  }

  for (const node of nodes) {
    const neighbors = neighborMap.get(node.id);
    if (neighbors) {
      node.neighbors = [...neighbors];
      node.linkCount = neighbors.size;
    }
  }
}
