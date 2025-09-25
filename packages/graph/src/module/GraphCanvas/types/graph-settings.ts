import type { NodeInterface } from "./nodes";

export type GraphSettingsInterface<NodeData extends Record<string, unknown>> = {
  zoomExtent?: [number, number];
  translateExtent?: [[number?, number?], [number?, number?]];
  translateExtentCoefficient?: number | [number, number];
  translateExtentEnable?: boolean;
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
