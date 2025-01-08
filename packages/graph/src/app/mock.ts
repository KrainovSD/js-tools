import type { GraphInterface } from "@/module/Graph";
import type { NodeInterface } from "@/types";
import * as json from "./data.json";
import type { LinkData, NodeData } from "./types";

function randomNumber(min: number, max: number) {
  return Math.floor(Math.random() * (max - min) + min);
}

// const dataMock: Pick<GraphInterface<NodeData, LinkData>, "nodes" | "links"> = {
//   nodes: [
//     { id: "node1", group: 1, data: { citing_patents_count: 0, radius: 2 } },
//     { id: "node2", data: { citing_patents_count: 0, radius: 2 }, group: 1 },
//   ],
//   links: [{ source: "node1", target: "node2", data: { value: 2 } }],
// };

const NODES_COUNT = 1000;
const GROUPS_COUNT = 10;
const EXISTING_LINKS = new Map<number, number[]>();

const dataMock: Pick<GraphInterface<NodeData, LinkData>, "nodes" | "links"> = {
  links: Array.from({ length: (NODES_COUNT / 10) * 5 }, () => {
    let source: number | undefined;
    let target: number | undefined;

    while (source == undefined || target == undefined) {
      source = randomNumber(0, NODES_COUNT - 1);
      const currentTarget = randomNumber(0, NODES_COUNT - 1);
      const existingTargets = EXISTING_LINKS.get(source);
      if (existingTargets) {
        if (existingTargets.includes(currentTarget)) continue;
        existingTargets.push(currentTarget);
      } else {
        EXISTING_LINKS.set(source, [currentTarget]);
      }
      target = currentTarget;
    }

    return {
      data: { value: 1 },
      source,
      target,
    };
  }),
  nodes: Array.from({ length: NODES_COUNT }, (_, index) => {
    return {
      id: index,
      data: { citing_patents_count: 0, radius: 2 },
      group: randomNumber(1, GROUPS_COUNT),
    };
  }),
};

const dataJson: Pick<GraphInterface<NodeData, LinkData>, "nodes" | "links"> = {
  links: json.links.map((link) => ({ ...link, data: { value: link.value } })),
  nodes: json.nodes.map<NodeInterface<NodeData>>((node) => ({
    ...node,
    data: { radius: node.radius, citing_patents_count: node.citing_patents_count },
  })),
};

export { dataJson, dataMock };
