import type { SimulationNodeDatum } from "d3-force";

export interface NodeInterface<NodeData extends Record<string, unknown>>
  extends SimulationNodeDatum {
  id: number | string;
  linkCount?: number;
  group?: number | string;
  neighbors?: (string | number)[];
  _radius?: number;
  _width?: number;
  _height?: number;
  _borderRadius?: number;
  _visible?: boolean;
  _shape?: NodeShape;
  name?: string;
  drag?: boolean;
  highlight?: boolean;
  data?: NodeData;
}

export type NodeShape = "circle" | "square" | "text" | "icon";

export type CachedNodeTextInterface = Record<string | number, string[] | undefined>;
export type CachedTextNodeParametersMap = Record<string | number, [number, number] | undefined>;

/**
 * 1. Initial max size of text
 * 2. Initial size of text
 */
export type CachedTextNodeParametersInterface = [number, number];
