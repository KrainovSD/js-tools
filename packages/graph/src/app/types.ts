import type { LinkInterface, NodeInterface } from "@/types";

export type NodeData = {};
export type LinkData = {};

export type Link = LinkInterface<NodeData, LinkData>;
export type Node = NodeInterface<NodeData>;
