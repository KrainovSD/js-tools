import type { SimulationNodeDatum } from "d3-force";

export interface NodeInterface<NodeData extends Record<string, unknown>>
  extends SimulationNodeDatum {
  id: number | string;
  linkCount?: number;
  group?: number | string;
  neighbors?: (string | number)[];
  _radius?: number;
  _borderWidth?: number;
  _width?: number;
  _height?: number;
  _borderRadius?: number;
  _visible?: boolean;
  _shape?: NodeShape;
  name?: string;
  label?: string;
  drag?: boolean;
  highlight?: boolean;
  visible?: boolean;
  image?: HTMLImageElement;
  data?: NodeData;
}

export type NodeShape = "circle" | "square" | "text";
export type TextStyleEnum = "normal" | "italic" | "oblique";
export type CachedNodeTextInterface = Record<string | number, string[] | undefined>;
