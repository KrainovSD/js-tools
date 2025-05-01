import { dragPlaceCoefficientGetter } from "../lib";
import type { GraphSettingsInterface } from "../types/graph-settings";

export const GRAPH_SETTINGS: Required<GraphSettingsInterface<Record<string, unknown>>> = {
  zoomExtent: [0.3, 10] as [number, number],
  translateExtent: [[], []],
  translateExtentEnable: true,
  translateExtentCoefficient: [3, 3],
  highlightUpFrames: 5,
  highlightDownFrames: 5,
  dragPlaceCoefficient: dragPlaceCoefficientGetter,
  zoomInitial: null,
  showDrawTime: true,
  showDrawTimeEveryTick: false,
};
