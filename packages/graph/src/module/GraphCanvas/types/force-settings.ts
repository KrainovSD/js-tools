import type { LinkIterationPropsInterface, NodeIterationPropsInterface } from "./utils";

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
  collideRadius?: NodeIterationPropsInterface<NodeData, LinkData> | number | null;
  collideAdditionalRadius?: number;
  collideStrength?: number;
  collideIterations?: number;
  linkDistance?: LinkIterationPropsInterface<NodeData, LinkData> | number;
  linkStrength?: LinkIterationPropsInterface<NodeData, LinkData> | number;
  linkIterations?: number;
  chargeStrength?: NodeIterationPropsInterface<NodeData, LinkData> | number;
  chargeDistanceMax?: number;
  chargeDistanceMin?: number;
  centerPosition?: { x?: number; y?: number };
  centerStrength?: number;
  xPosition?: NodeIterationPropsInterface<NodeData, LinkData> | number;
  xStrength?: NodeIterationPropsInterface<NodeData, LinkData> | number;
  yPosition?: NodeIterationPropsInterface<NodeData, LinkData> | number;
  yStrength?: NodeIterationPropsInterface<NodeData, LinkData> | number;
};
