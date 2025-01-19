import type { Simulation } from "d3-force";
import type { LinkInterface, NodeInterface } from "@/types";
import type { GraphCanvasListeners } from "./listeners";
import type {
  GraphCanvasForceSettings,
  GraphCanvasLinkSettings,
  GraphCanvasNodeSettings,
  GraphCanvasSettingInterface,
} from "./settings";

export type GraphCanvasInterface<
  NodeData extends Record<string, unknown>,
  LinkData extends Record<string, unknown>,
> = {
  nodes: NodeInterface<NodeData>[];
  links: LinkInterface<NodeData, LinkData>[];
  root: HTMLElement;
  graphSettings?: GraphCanvasSettingInterface<NodeData>;
  forceSettings?: GraphCanvasForceSettings<NodeData, LinkData>;
  nodeSettings?: GraphCanvasNodeSettings<NodeData>;
  linkSettings?: GraphCanvasLinkSettings<NodeData, LinkData>;
  listeners?: GraphCanvasListeners<NodeData, LinkData>;
};

export type GraphCanvasSimulation<
  NodeData extends Record<string, unknown>,
  LinkData extends Record<string, unknown>,
> = Simulation<NodeInterface<NodeData>, LinkInterface<NodeData, LinkData>>;
