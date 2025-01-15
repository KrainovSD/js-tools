import type { Selection, Simulation } from "d3";
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
  graphSettings?: GraphCanvasSettingInterface;
  forceSettings?: GraphCanvasForceSettings<NodeData, LinkData>;
  nodeSettings?: GraphCanvasNodeSettings<NodeData>;
  linkSettings?: GraphCanvasLinkSettings<NodeData, LinkData>;
  listeners?: GraphCanvasListeners<NodeData, LinkData>;
};

export type GraphCanvasSimulation<
  NodeData extends Record<string, unknown>,
  LinkData extends Record<string, unknown>,
> = Simulation<NodeInterface<NodeData>, LinkInterface<NodeData, LinkData>>;

export type GraphCanvasSelection = Selection<SVGGElement, unknown, HTMLElement, unknown>;
