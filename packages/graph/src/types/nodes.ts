import type { SimulationNodeDatum } from "d3";
import type { Graphics } from "pixi.js";

export interface NodeInterface<NodeData extends Record<string, unknown>>
  extends SimulationNodeDatum {
  id: number | string;
  group: number | string;
  data?: NodeData;
  element?: Graphics;
}
