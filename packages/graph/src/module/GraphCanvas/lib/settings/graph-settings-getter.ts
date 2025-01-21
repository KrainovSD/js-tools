import { GRAPH_SETTINGS } from "../../constants";
import type { GraphCanvasSettingInterface } from "../../types";

export function graphSettingsGetter<NodeData extends Record<string, unknown>>(
  settings: GraphCanvasSettingInterface<NodeData> | undefined,
): Required<GraphCanvasSettingInterface<NodeData>> {
  return {
    ...GRAPH_SETTINGS,
    ...settings,
  };
}
