/* eslint-disable no-underscore-dangle */
import type { GraphInterface } from "@/module/Graph";
import type { NodeInterface } from "@/types";
import type { LinkData, NodeData } from "../types";
import * as d3MockIncorrect from "./d3-mock.json";
import * as stressMockIncorrect from "./stress-mock.json";

export const d3Mock: Pick<GraphInterface<NodeData, LinkData>, "nodes" | "links"> = {
  links: d3MockIncorrect.links.map((link) => ({ ...link, data: { value: link.value } })),
  nodes: d3MockIncorrect.nodes.map<NodeInterface<NodeData>>((node) => ({
    ...node,
  })),
};
export const stressMock: Pick<GraphInterface<NodeData, LinkData>, "nodes" | "links"> = {
  links: stressMockIncorrect.links.map((link, index) => ({
    index,
    source: link._from,
    target: link._to,
  })),
  nodes: stressMockIncorrect.nodes.map<NodeInterface<NodeData>>((node) => ({
    id: node._id,
    group: 1,
  })),
};
export * from "./custom-mock";
export * from "./dynamic-mock";
