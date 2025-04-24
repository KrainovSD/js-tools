import type { D3DragEvent } from "d3-drag";
import type { D3ZoomEvent } from "d3-zoom";
import type { NodeInterface } from "@/types";
import type { GraphState } from "./graph";

export type ZoomEventInterface = D3ZoomEvent<HTMLCanvasElement, unknown>;

export type DragEventInterface<NodeData extends Record<string, unknown>> = D3DragEvent<
  HTMLElement,
  unknown,
  NodeInterface<NodeData>
>;

export type ListenersInterface<
  NodeData extends Record<string, unknown>,
  LinkData extends Record<string, unknown>,
> = {
  onContextMenu?: (event: MouseEvent, node?: NodeInterface<NodeData>) => void;
  onClick?: (event: MouseEvent | TouchEvent, node?: NodeInterface<NodeData>) => void;
  onDoubleClick?: (event: MouseEvent | TouchEvent, node?: NodeInterface<NodeData>) => void;
  onWheelClick?: (event: MouseEvent, node?: NodeInterface<NodeData>) => void;
  onMove?: (event: MouseEvent | TouchEvent, node?: NodeInterface<NodeData>) => void;
  onZoom?: (event: ZoomEventInterface) => void;
  onDragSubject?: (
    event: DragEventInterface<NodeData>,
    state: GraphState<NodeData, LinkData>,
  ) => NodeInterface<NodeData> | undefined;
  onDraw?: (
    state: GraphState<NodeData, LinkData>,
    toggleHighlightStatus: (status: boolean) => void,
    clearHighlightState: () => void,
  ) => void;
  onStartDragFinished?: (
    event: DragEventInterface<NodeData>,
    state: GraphState<NodeData, LinkData>,
  ) => void;
  onMoveDragFinished?: (
    event: DragEventInterface<NodeData>,
    state: GraphState<NodeData, LinkData>,
  ) => void;
  onEndDragFinished?: (
    event: DragEventInterface<NodeData>,
    state: GraphState<NodeData, LinkData>,
  ) => void;
  onDrawFinished?: (state: GraphState<NodeData, LinkData>) => void;
  onSimulationEnd?: (state: GraphState<NodeData, LinkData>) => void;
};
