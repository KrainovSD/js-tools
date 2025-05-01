import type { GraphState } from "./graph";
import type { LinkInterface } from "./links";
import type { NodeInterface } from "./nodes";

export type NodeIterationPropsInterface<
  NodeData extends Record<string, unknown>,
  LinkData extends Record<string, unknown>,
  Return = number,
> = (
  node: NodeInterface<NodeData>,
  i: number,
  nodes: NodeInterface<NodeData>[],
  state?: GraphState<NodeData, LinkData>,
) => Return;

export type LinkIterationPropsInterface<
  NodeData extends Record<string, unknown>,
  LinkData extends Record<string, unknown>,
  Return = number,
> = (
  link: LinkInterface<NodeData, LinkData>,
  i: number,
  links: LinkInterface<NodeData, LinkData>[],
  state?: GraphState<NodeData, LinkData>,
) => Return;
