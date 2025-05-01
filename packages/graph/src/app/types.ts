import type { LinkInterface, NodeInterface } from "@/module/GraphCanvas";

export type NodeData = {
  image?: string;
};
export type LinkData = {};

export type Link = LinkInterface<NodeData, LinkData>;
export type Node = NodeInterface<NodeData>;
