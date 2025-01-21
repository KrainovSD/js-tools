import type { GraphCanvasListeners } from "../../types";

export function listenersGetter<
  NodeData extends Record<string, unknown>,
  LinkData extends Record<string, unknown>,
>(
  settings: GraphCanvasListeners<NodeData, LinkData> | undefined,
): GraphCanvasListeners<NodeData, LinkData> {
  return settings || {};
}
