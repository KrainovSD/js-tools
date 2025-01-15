import { GRAPH_SETTINGS } from "../constants";
import type { GraphCanvasSettingInterface } from "../types";
import { dragPlaceCoefficientGetter } from "./drag-place-coefficient-getter";

export function graphSettingsGetter<NodeData extends Record<string, unknown>>(
  settings: GraphCanvasSettingInterface<NodeData> | undefined,
): Required<GraphCanvasSettingInterface<NodeData>> {
  return {
    zoomExtent: settings?.zoomExtent || GRAPH_SETTINGS.zoomExtent,
    dragPlaceCoefficient: settings?.dragPlaceCoefficient || dragPlaceCoefficientGetter,
  };
}
