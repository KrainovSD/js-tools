import type { SimulationNodeDatum } from "d3-force";

export interface NodeInterface<NodeData extends Record<string, unknown>>
  extends SimulationNodeDatum {
  id: number | string;
  linkCount?: number;
  group?: number | string;
  neighbors?: (string | number)[];
  radius?: number;
  name?: string;
  data?: NodeData;
}

export type CachedNodeTextInterface = Record<string | number, string[]>;
