import type { GraphCanvasInterface } from "@/module/GraphCanvas";
import type { LinkData, NodeData } from "../types";

function randomNumber(min: number, max: number) {
  return Math.floor(Math.random() * (max - min) + min);
}

const NODES_COUNT = 20000;
const GROUPS_COUNT = 10;
const EXISTING_LINKS = new Map<number, number[]>();

export const customMock: Pick<GraphCanvasInterface<NodeData, LinkData>, "nodes" | "links"> = {
  links: Array.from({ length: NODES_COUNT }, () => {
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
      source,
      target,
    };
  }),
  nodes: Array.from({ length: NODES_COUNT }, (_, index) => {
    return {
      id: index,
      group: randomNumber(1, GROUPS_COUNT),
    };
  }),
};
