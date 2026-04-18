import type { NodeInterface } from "./nodes";

export type GraphSettingsInterface<NodeData extends Record<string, unknown>> = {
  zoomExtent?: [number, number] | null;
  // margin out of center of graph
  zoomExtentMargin?: number;
  translateExtent?: [[number?, number?], [number?, number?]] | null;
  translateExtentCoefficient?: number | [number, number] | null;
  // fraction of graph that must remain visible at max pan
  translateExtentOverlap?: number;
  zoomInitial?: {
    k?: number;
    x?: number;
    y?: number;
  } | null;
  dragPlaceCoefficient?: (
    node: NodeInterface<NodeData>,
    pxEvent: number,
    pyEvent: number,
  ) => number | undefined;
  showDrawTime?: boolean;
  showDrawTimeEveryTick?: boolean;
};
