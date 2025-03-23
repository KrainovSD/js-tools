import type { LinkInterface, NodeInterface } from "@krainovsd/graph";

export type NodeData = {};
export type LinkData = {};

export type Link = LinkInterface<NodeData, LinkData>;
export type Node = NodeInterface<NodeData>;
