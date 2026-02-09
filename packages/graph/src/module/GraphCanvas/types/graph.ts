import type { ValueOf } from "@krainovsd/js-helpers";
import type { Simulation } from "d3-force";
import type { GRAPH_CACHE_TYPE } from "../constants";
import type { ForceSettingsInterface } from "./force-settings";
import type { GraphSettingsInterface } from "./graph-settings";
import type { HighlightSettingsInterface } from "./highlight-settings";
import type { LinkSettingsInterface } from "./link-settings";
import type { LinkInterface } from "./links";
import type { ListenersInterface } from "./listeners";
import type { NodeSettingsInterface } from "./node-settings";
import type { NodeInterface } from "./nodes";

export type GraphCanvasInterface<
  NodeData extends Record<string, unknown>,
  LinkData extends Record<string, unknown>,
> = {
  nodes: NodeInterface<NodeData>[];
  links: LinkInterface<NodeData, LinkData>[];
  root: HTMLElement;
  graphSettings?: GraphSettingsInterface<NodeData>;
  forceSettings?: ForceSettingsInterface<NodeData, LinkData>;
  nodeSettings?: NodeSettingsInterface<NodeData, LinkData>;
  linkSettings?: LinkSettingsInterface<NodeData, LinkData>;
  listeners?: ListenersInterface<NodeData, LinkData>;
  highlightSettings?: HighlightSettingsInterface;
};

export type GraphCanvasSimulation<
  NodeData extends Record<string, unknown>,
  LinkData extends Record<string, unknown>,
> = Simulation<NodeInterface<NodeData>, LinkInterface<NodeData, LinkData>>;

export type GraphCanvasCacheKeys = ValueOf<typeof GRAPH_CACHE_TYPE>;
