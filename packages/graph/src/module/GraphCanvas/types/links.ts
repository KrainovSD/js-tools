import type { SimulationLinkDatum } from "d3-force";
import type { NodeInterface } from "./nodes";

export interface LinkInterface<
  NodeData extends Record<string, unknown>,
  LinkData extends Record<string, unknown>,
> extends SimulationLinkDatum<NodeInterface<NodeData>> {
  data?: LinkData;
  highlight?: boolean;
  visible?: boolean;
}

export type LinkParticle = {
  step: number;
  index: number;
  prev: LinkParticle | undefined;
  next: LinkParticle | undefined;
  x?: number;
  y?: number;
  sourceId: string | number;
  targetId: string | number;
};
