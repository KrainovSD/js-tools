import type { GraphCanvas } from "../GraphCanvas";
import type { LinkInterface } from "./links";
import type { NodeInterface } from "./nodes";

export type NodeIterationPropsInterface<
  NodeData extends Record<string, unknown>,
  LinkData extends Record<string, unknown>,
  Return = number,
> = (
  this: GraphCanvas<NodeData, LinkData>,
  node: NodeInterface<NodeData>,
  i: number,
  nodes: NodeInterface<NodeData>[],
) => Return;

export type LinkIterationPropsInterface<
  NodeData extends Record<string, unknown>,
  LinkData extends Record<string, unknown>,
  Return = number,
> = (
  this: GraphCanvas<NodeData, LinkData>,
  link: LinkInterface<NodeData, LinkData>,
  i: number,
  links: LinkInterface<NodeData, LinkData>[],
) => Return;
