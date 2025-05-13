import type { D3DragEvent } from "d3-drag";
import type { D3ZoomEvent } from "d3-zoom";
import type { GraphCanvas } from "../GraphCanvas";
import type { LinkInterface } from "./links";
import type { NodeInterface } from "./nodes";

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
  onContextMenu?: (
    this: GraphCanvas<NodeData, LinkData>,
    event: MouseEvent,
    node: NodeInterface<NodeData> | undefined,
    link: LinkInterface<NodeData, LinkData> | undefined,
  ) => void;
  onClick?: (
    this: GraphCanvas<NodeData, LinkData>,
    event: MouseEvent | TouchEvent,
    node: NodeInterface<NodeData> | undefined,
    link: LinkInterface<NodeData, LinkData> | undefined,
  ) => void;
  onDoubleClick?: (
    this: GraphCanvas<NodeData, LinkData>,
    event: MouseEvent | TouchEvent,
    node: NodeInterface<NodeData> | undefined,
    link: LinkInterface<NodeData, LinkData> | undefined,
  ) => void;
  onWheelClick?: (
    this: GraphCanvas<NodeData, LinkData>,
    event: MouseEvent,
    node: NodeInterface<NodeData> | undefined,
    link: LinkInterface<NodeData, LinkData> | undefined,
  ) => void;
  onMove?: (
    this: GraphCanvas<NodeData, LinkData>,
    event: MouseEvent | TouchEvent,
    node: NodeInterface<NodeData> | undefined,
    link: LinkInterface<NodeData, LinkData> | undefined,
  ) => void;
  onZoom?: (this: GraphCanvas<NodeData, LinkData>, event: ZoomEventInterface) => void;
  onDragSubject?: (
    this: GraphCanvas<NodeData, LinkData>,
    event: DragEventInterface<NodeData>,
  ) => NodeInterface<NodeData> | undefined;
  onDraw?: (this: GraphCanvas<NodeData, LinkData>) => void;
  onStartDragFinished?: (
    this: GraphCanvas<NodeData, LinkData>,
    event: DragEventInterface<NodeData>,
  ) => void;
  onMoveDragFinished?: (
    this: GraphCanvas<NodeData, LinkData>,
    event: DragEventInterface<NodeData>,
  ) => void;
  onEndDragFinished?: (
    this: GraphCanvas<NodeData, LinkData>,
    event: DragEventInterface<NodeData>,
  ) => void;
  onDrawFinished?: (this: GraphCanvas<NodeData, LinkData>) => void;
  onSimulationEnd?: (this: GraphCanvas<NodeData, LinkData>) => void;
};
