import type { LinkIterationPropsNoThisInterface, NodeIterationPropsNoThisInterface } from "./utils";

export type ForceSettingsInterface<
  NodeData extends Record<string, unknown>,
  LinkData extends Record<string, unknown>,
> = {
  forces?: boolean;
  xForce?: boolean;
  yForce?: boolean;
  chargeForce?: boolean;
  centerForce?: boolean;
  collideForce?: boolean;
  linkForce?: boolean;

  collideOffMax?: {
    nodes: number;
    links: number;
  };
  collideRadius?: NodeIterationPropsNoThisInterface<NodeData> | number | null;
  collideAdditionalRadius?: number;
  collideStrength?: number;
  collideIterations?: number;
  linkDistance?: LinkIterationPropsNoThisInterface<NodeData, LinkData> | number;
  linkStrength?: LinkIterationPropsNoThisInterface<NodeData, LinkData> | number;
  linkIterations?: number;
  chargeStrength?: NodeIterationPropsNoThisInterface<NodeData> | number;
  chargeDistanceMin?: number;
  centerPosition?: { x?: number; y?: number };
  centerStrength?: number;
  xPosition?: NodeIterationPropsNoThisInterface<NodeData> | number;
  xStrength?: NodeIterationPropsNoThisInterface<NodeData> | number;
  yPosition?: NodeIterationPropsNoThisInterface<NodeData> | number;
  yStrength?: NodeIterationPropsNoThisInterface<NodeData> | number;
};
