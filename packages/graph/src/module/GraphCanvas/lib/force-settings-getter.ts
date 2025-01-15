import type { GraphCanvasForceOptions } from "../GraphCanvas.types";

export function forceSettingsGetter<
  NodeData extends Record<string, unknown>,
  LinkData extends Record<string, unknown>,
>(
  settings: GraphCanvasForceOptions<NodeData, LinkData> | undefined,
): Required<GraphCanvasForceOptions<NodeData, LinkData>> {
  return {
    centerPosition: settings?.centerPosition ?? {},
    centerStrength: settings?.centerStrength ?? 1,
    collideRadius: settings?.collideRadius ?? 10,
    collideStrength: settings?.collideStrength ?? 1,
    collideIterations: settings?.collideIterations ?? 1,
    collideOffMax: settings?.collideOffMax ?? { links: 0, nodes: 0 },
    collideOn: settings?.collideOn ?? true,
    chargeStrength: settings?.chargeStrength ?? -40,
    chargeDistanceMax: settings?.chargeDistanceMax ?? Infinity,
    chargeDistanceMin: settings?.chargeDistanceMin ?? 1,
    xForce: settings?.xForce ?? 0,
    xStrength: settings?.xStrength ?? 0.1,
    yForce: settings?.yForce ?? 0,
    yStrength: settings?.yStrength ?? 0.1,
    linkDistance: settings?.linkDistance ?? 10,
    linkIterations: settings?.linkIterations ?? 1,
    linkStrength: settings?.linkStrength ?? 1,
  };
}
