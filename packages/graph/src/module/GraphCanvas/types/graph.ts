import type { Simulation } from "d3-force";
import type { LinkInterface, NodeInterface } from "@/types";
import type { ListenersInterface } from "./listeners";
import type {
  ForceSettingsInterface,
  GraphSettingsInterface,
  LinkSettingsInterface,
  NodeSettingsInterface,
} from "./settings";

export type GraphCanvasInterface<
  NodeData extends Record<string, unknown>,
  LinkData extends Record<string, unknown>,
> = {
  nodes: NodeInterface<NodeData>[];
  links: LinkInterface<NodeData, LinkData>[];
  root: HTMLElement;
  graphSettings?: GraphSettingsInterface<NodeData>;
  forceSettings?: ForceSettingsInterface<NodeData, LinkData>;
  nodeSettings?: NodeSettingsInterface<NodeData>;
  linkSettings?: LinkSettingsInterface<NodeData, LinkData>;
  listeners?: ListenersInterface<NodeData, LinkData>;
};

export type GraphCanvasSimulation<
  NodeData extends Record<string, unknown>,
  LinkData extends Record<string, unknown>,
> = Simulation<NodeInterface<NodeData>, LinkInterface<NodeData, LinkData>>;
