import { dragPlaceCoefficientGetter } from "../lib";
import type { GraphSettingsInterface } from "../types/graph-settings";

export const GRAPH_SETTINGS: Required<GraphSettingsInterface<Record<string, unknown>>> = {
  zoomAnimation: true,
  zoomAnimationDuration: 300,
  zoomToNodeScale: 5,
  zoomToFitMargin: 0.25,
  zoomExtent: null,
  zoomExtentMargin: 0.3,
  translateExtent: null,
  translateExtentCoefficient: null,
  translateExtentOverlap: 0.3,
  dragPlaceCoefficient: dragPlaceCoefficientGetter,
  zoomInitial: null,
  showDrawTime: true,
  showDrawTimeEveryTick: false,
  maxFps: 120,
};
