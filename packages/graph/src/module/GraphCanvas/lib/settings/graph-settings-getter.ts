import { GRAPH_SETTINGS } from "../../constants";
import type { GraphSettingsInterface } from "../../types";

export function graphSettingsGetter<NodeData extends Record<string, unknown>>(
  settings: GraphSettingsInterface<NodeData> | undefined,
  prevSettings?: Required<GraphSettingsInterface<NodeData>>,
): Required<GraphSettingsInterface<NodeData>> {
  return {
    ...(prevSettings ?? GRAPH_SETTINGS),
    ...settings,
  };
}
