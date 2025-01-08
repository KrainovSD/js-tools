import type { SimulationLinkDatum, SimulationNodeDatum } from "d3";

export interface NodeInterface<NodeData extends Record<string, unknown>>
  extends SimulationNodeDatum {
  id: number | string;
  group: number | string;
  data: NodeData;
}

export interface LinkInterface<
  NodeData extends Record<string, unknown>,
  LinkData extends Record<string, unknown>,
> extends SimulationLinkDatum<NodeInterface<NodeData>> {
  data: LinkData;
}

export type GraphInterface<
  NodeData extends Record<string, unknown>,
  LinkData extends Record<string, unknown>,
> = {
  nodes: NodeInterface<NodeData>[];
  links: LinkInterface<NodeData, LinkData>[];
  width: number;
  height: number;
  selector: string;
};
