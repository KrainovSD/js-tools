import type { GraphCanvasLinkSettings } from "../GraphCanvas.types";

export function linkSettingsGetter<
  NodeData extends Record<string, unknown>,
  LinkData extends Record<string, unknown>,
>(
  settings: GraphCanvasLinkSettings<NodeData, LinkData> | undefined,
): Required<Omit<GraphCanvasLinkSettings<NodeData, LinkData>, "options">> &
  Pick<GraphCanvasLinkSettings<NodeData, LinkData>, "options"> {
  return { options: settings?.options };
}
