import type { GraphCanvasInterface, NodeInterface } from "@/module/GraphCanvas";
import { getNodeNeighbors } from "../lib";
import type { LinkData, NodeData } from "../types";
import * as d3MockIncorrect from "./d3-mock.json";
import * as realMockIncorrect from "./real.json";
import * as stressMockIncorrect from "./stress-mock.json";

export const d3Mock: Pick<GraphCanvasInterface<NodeData, LinkData>, "nodes" | "links"> = {
  links: d3MockIncorrect.links.map((link) => ({ ...link })),
  nodes: d3MockIncorrect.nodes.map<NodeInterface<NodeData>>((node, index) => ({
    ...node,
    name: `${node.group} ${index}`,
  })),
};

// export const d3Mock: Pick<GraphCanvasInterface<NodeData, LinkData>, "nodes" | "links"> = {
//   links: [],
//   nodes: [
//     {
//       id: "custom-1",
//       name: "Загрузка потребности в АСЭЗ для проведения конкурентных процедур",
//       vx: -0.004415519454507829,
//       vy: -0.0014493223705162935,
//       x: -308.6436703638238,
//       y: -171.61133627072942,
//       group: "Загрузка потребности в АСЭЗ для проведения конкурентных процедур",
//     },
//   ],
// };

export const stressMock: Pick<GraphCanvasInterface<NodeData, LinkData>, "nodes" | "links"> = {
  links: stressMockIncorrect.links.map((link, index) => ({
    index,
    source: link._from,
    target: link._to,
  })),
  nodes: stressMockIncorrect.nodes.map<NodeInterface<NodeData>>((node) => ({
    id: node._id,
    group: 1,
    name: node.name,
  })),
};
export const realMock: Pick<GraphCanvasInterface<NodeData, LinkData>, "nodes" | "links"> = {
  nodes: Object.entries(realMockIncorrect.entities).map(([id, info]) => ({
    id,
    group: info.entity_type,
    name: info.entity,
  })),
  links: realMockIncorrect.relations.map((link) => ({ source: link.from_id, target: link.to_id })),
};
getNodeNeighbors(d3Mock);
getNodeNeighbors(stressMock);
getNodeNeighbors(realMock);

export * from "./custom-mock";
export * from "./dynamic-mock";
