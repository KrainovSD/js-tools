import type { SimulationLinkDatum } from "d3";
import type { NodeInterface } from "./nodes";

export interface LinkInterface<
  NodeData extends Record<string, unknown>,
  LinkData extends Record<string, unknown>,
> extends SimulationLinkDatum<NodeInterface<NodeData>> {
  data: LinkData;
}
