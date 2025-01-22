import type { ListenersInterface } from "../../types";

export function listenersGetter<
  NodeData extends Record<string, unknown>,
  LinkData extends Record<string, unknown>,
>(
  settings: ListenersInterface<NodeData, LinkData> | undefined,
): ListenersInterface<NodeData, LinkData> {
  return settings || {};
}
