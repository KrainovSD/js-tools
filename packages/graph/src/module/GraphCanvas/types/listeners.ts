import type { D3DragEvent, D3ZoomEvent, ZoomTransform } from "d3";
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
  onZoom?: (event: GraphCanvasZoomEvent) => void;
  onStartDrag?: (
    event: GraphCanvasDragEvent<NodeData>,
    simulations: GraphCanvasSimulation<NodeData, LinkData> | undefined,
  ) => void;
  onMoveDrag?: (
    event: GraphCanvasDragEvent<NodeData>,
    simulations: GraphCanvasSimulation<NodeData, LinkData> | undefined,
  ) => void;
  onEndDrag?: (
    event: GraphCanvasDragEvent<NodeData>,
    simulations: GraphCanvasSimulation<NodeData, LinkData> | undefined,
  ) => void;
  onDraw?: (canvasContext: CanvasRenderingContext2D, transform: ZoomTransform) => void;
  onStartDragFinished?: (
    event: GraphCanvasDragEvent<NodeData>,
    simulations: GraphCanvasSimulation<NodeData, LinkData> | undefined,
  ) => void;
  onMoveDragFinished?: (
    event: GraphCanvasDragEvent<NodeData>,
    simulations: GraphCanvasSimulation<NodeData, LinkData> | undefined,
  ) => void;
  onEndDragFinished?: (
    event: GraphCanvasDragEvent<NodeData>,
    simulations: GraphCanvasSimulation<NodeData, LinkData> | undefined,
  ) => void;
  onDrawFinished?: (canvasContext: CanvasRenderingContext2D, transform: ZoomTransform) => void;
  onSimulationEnd?: (simulations: GraphCanvasSimulation<NodeData, LinkData> | undefined) => void;
};
