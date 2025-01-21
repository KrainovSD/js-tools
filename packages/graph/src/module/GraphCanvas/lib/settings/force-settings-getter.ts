import { FORCE_SETTINGS } from "../../constants";
import type { GraphCanvasForceSettings } from "../../types";

export function forceSettingsGetter<
  NodeData extends Record<string, unknown>,
  LinkData extends Record<string, unknown>,
>(
  settings: GraphCanvasForceSettings<NodeData, LinkData> | undefined,
): Required<GraphCanvasForceSettings<NodeData, LinkData>> {
  return {
    ...FORCE_SETTINGS,
    ...settings,
  };
}
