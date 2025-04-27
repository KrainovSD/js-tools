import type { GraphCanvasInterface } from "@/module/GraphCanvas";
import type { NodeInterface } from "@/types";
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
//       id: "Node with text in 3 line minimum",
//       name: "Node with text in 3 line minimum",
//       vx: -0.004415519454507829,
//       vy: -0.0014493223705162935,
//       x: -308.6436703638238,
//       y: -171.61133627072942,
//       group: "Node with text in 3 line minimum",
//     },
//     {
//       id: "new",
//       name: "new 101",
//       vx: -0.004415519454507829,
//       vy: -0.0014493223705162935,
//       x: -308.6436703638238,
//       y: -171.61133627072942,
//       group: "new",
//     },
//     {
//       id: "109-294-662-661-65X",
//       name: "Citing Patents 100",
//       vx: -0.0007155991352571433,
//       vy: -0.0018676338328438014,
//       x: 132.32209874871648,
//       y: 90.21080778555283,
//       group: "Citing Patents",
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
