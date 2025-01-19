import type { D3DragEvent } from "d3-drag";
import type { D3ZoomEvent, ZoomTransform } from "d3-zoom";
import type { NodeInterface } from "@/types";
import type { GraphCanvasSimulation } from "./graph";

export type GraphCanvasZoomEvent = D3ZoomEvent<HTMLCanvasElement, unknown>;

export type GraphCanvasDragEvent<NodeData extends Record<string, unknown>> = D3DragEvent<
  HTMLElement,
  unknown,
  NodeInterface<NodeData>
>;

export type GraphCanvasListeners<
  NodeData extends Record<string, unknown>,
  LinkData extends Record<string, unknown>,
> = {
  onContextMenu?: (event: MouseEvent, node?: NodeInterface<NodeData>) => void;
  onClick?: (event: MouseEvent, node?: NodeInterface<NodeData>) => void;
  onDoubleClick?: (event: MouseEvent, node?: NodeInterface<NodeData>) => void;
  onWheelClick?: (event: MouseEvent, node?: NodeInterface<NodeData>) => void;
  onMove?: (event: MouseEvent, node?: NodeInterface<NodeData>) => void;
  onZoom?: (event: GraphCanvasZoomEvent) => void;
  onDragSubject?: (
    event: GraphCanvasDragEvent<NodeData>,
    transform: ZoomTransform,
    nodes: NodeInterface<NodeData>[],
  ) => NodeInterface<NodeData> | undefined;
  onDraw?: (canvasContext: CanvasRenderingContext2D, transform: ZoomTransform) => void;
  onStartDragFinished?: (
    event: GraphCanvasDragEvent<NodeData>,
    simulations: GraphCanvasSimulation<NodeData, LinkData> | undefined,
    transform: ZoomTransform,
  ) => void;
  onMoveDragFinished?: (
    event: GraphCanvasDragEvent<NodeData>,
    simulations: GraphCanvasSimulation<NodeData, LinkData> | undefined,
    transform: ZoomTransform,
  ) => void;
  onEndDragFinished?: (
    event: GraphCanvasDragEvent<NodeData>,
    simulations: GraphCanvasSimulation<NodeData, LinkData> | undefined,
    transform: ZoomTransform,
  ) => void;
  onDrawFinished?: (canvasContext: CanvasRenderingContext2D, transform: ZoomTransform) => void;
  onSimulationEnd?: (simulations: GraphCanvasSimulation<NodeData, LinkData> | undefined) => void;
};
