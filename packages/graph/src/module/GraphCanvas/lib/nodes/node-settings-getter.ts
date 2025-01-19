import type { GraphCanvasNodeSettings } from "../../types";
import { nodeIdGetter } from "./node-id-getter";

export function nodeSettingsGetter<NodeData extends Record<string, unknown>>(
  settings: GraphCanvasNodeSettings<NodeData> | undefined,
): Required<Omit<GraphCanvasNodeSettings<NodeData>, "options">> &
  Pick<GraphCanvasNodeSettings<NodeData>, "options"> {
  return {
    idGetter: settings?.idGetter ?? nodeIdGetter,
    options: settings?.options,
  };
}
