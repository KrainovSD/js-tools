import type { SimulationLinkDatum } from "d3-force";
import type { NodeInterface } from "./nodes";

export interface LinkInterface<
  NodeData extends Record<string, unknown>,
  LinkData extends Record<string, unknown>,
> extends SimulationLinkDatum<NodeInterface<NodeData>> {
  data?: LinkData;
  highlight?: boolean;
  visible?: boolean;
  _groupIndex?: number;
  _groupSize?: number;
  _self?: boolean;
  // x start
  _x1?: number;
  // y start
  _y1?: number;
  // x end
  _x2?: number;
  // y end
  _y2?: number;
  // x control curve
  _cx?: number;
  // y control curve
  _cy?: number;
  // x arrow
  _ax?: number;
  // y arrow
  _ay?: number;
}

export type LinkParticle = {
  index: number;
  x?: number;
  y?: number;
  _distanceTraveled?: number;
  _lastDistance?: number;
  _lastTime?: number;
};
