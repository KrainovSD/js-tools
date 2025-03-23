import type { SimulationNodeDatum } from "d3-force";

export interface NodeInterface<NodeData extends Record<string, unknown>>
  extends SimulationNodeDatum {
  id: number | string;
  linkCount?: number;
  group?: number | string;
  neighbors?: (string | number)[];
  _radius?: number;
  _visible?: boolean;
  name?: string;
  data?: NodeData;
  drag?: boolean;
}

export type CachedNodeTextInterface = Record<string | number, string[]>;
