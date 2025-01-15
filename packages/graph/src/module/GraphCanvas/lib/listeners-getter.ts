import type { GraphCanvasListeners } from "../types";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function listenersGetter(settings: GraphCanvasListeners | undefined): GraphCanvasListeners {
  return settings || {};
}
