import type { Simulation } from "d3-force";
import type { ZoomTransform } from "d3-zoom";
import type { ForceSettingsInterface } from "./force-settings";
import type { GraphSettingsInterface } from "./graph-settings";
import type { HighlightSettingsInterface } from "./highlight-settings";
import type { LinkSettingsInterface } from "./link-settings";
import type { LinkInterface } from "./links";
import type { ListenersInterface } from "./listeners";
import type { NodeSettingsInterface } from "./node-settings";
import type { CachedNodeTextInterface, NodeInterface } from "./nodes";

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

export type GraphState<
  NodeData extends Record<string, unknown>,
  LinkData extends Record<string, unknown>,
> = {
  context: CanvasRenderingContext2D | null | undefined;
  simulation: GraphCanvasSimulation<NodeData, LinkData> | undefined;
  areaTransform: ZoomTransform;
  eventAbortController: AbortController;
  cachedNodeText: CachedNodeTextInterface;
  simulationWorking: boolean;
  isDragging: boolean;
  highlightedNode: NodeInterface<NodeData> | null;
  highlightedLink: LinkInterface<NodeData, LinkData> | null;
  highlightedNeighbors: Set<string | number> | null;
  highlightProgress: number;
  highlightWorking: boolean;
  highlightDrawing: boolean;
  width: number;
  height: number;
  nodes: NodeInterface<NodeData>[];
  links: LinkInterface<NodeData, LinkData>[];
  graphSettings: Required<GraphSettingsInterface<NodeData>>;
  forceSettings: Required<ForceSettingsInterface<NodeData, LinkData>>;
  nodeSettings: Required<Omit<NodeSettingsInterface<NodeData, LinkData>, "options">> &
    Pick<NodeSettingsInterface<NodeData, LinkData>, "options">;
  linkSettings: Required<Omit<LinkSettingsInterface<NodeData, LinkData>, "options">> &
    Pick<LinkSettingsInterface<NodeData, LinkData>, "options">;
};
