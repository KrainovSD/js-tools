import { FORCE_SETTINGS } from "../constants";
import type { GraphCanvasForceSettings } from "../types";

export function forceSettingsGetter<
  NodeData extends Record<string, unknown>,
  LinkData extends Record<string, unknown>,
>(
  settings: GraphCanvasForceSettings<NodeData, LinkData> | undefined,
): Required<GraphCanvasForceSettings<NodeData, LinkData>> {
  return {
    centerPosition: settings?.centerPosition ?? FORCE_SETTINGS.centerPosition,
    centerStrength: settings?.centerStrength ?? FORCE_SETTINGS.centerStrength,
    collideRadius: settings?.collideRadius ?? FORCE_SETTINGS.collideRadius,
    collideStrength: settings?.collideStrength ?? FORCE_SETTINGS.collideStrength,
    collideIterations: settings?.collideIterations ?? FORCE_SETTINGS.collideIterations,
    collideOffMax: settings?.collideOffMax ?? FORCE_SETTINGS.collideOffMax,
    collideOn: settings?.collideOn ?? FORCE_SETTINGS.collideOn,
    chargeStrength: settings?.chargeStrength ?? FORCE_SETTINGS.chargeStrength,
    chargeDistanceMax: settings?.chargeDistanceMax ?? FORCE_SETTINGS.chargeDistanceMax,
    chargeDistanceMin: settings?.chargeDistanceMin ?? FORCE_SETTINGS.chargeDistanceMin,
    xForce: settings?.xForce ?? FORCE_SETTINGS.xForce,
    xStrength: settings?.xStrength ?? FORCE_SETTINGS.xStrength,
    yForce: settings?.yForce ?? FORCE_SETTINGS.yForce,
    yStrength: settings?.yStrength ?? FORCE_SETTINGS.yStrength,
    linkDistance: settings?.linkDistance ?? FORCE_SETTINGS.linkDistance,
    linkIterations: settings?.linkIterations ?? FORCE_SETTINGS.linkIterations,
    linkStrength: settings?.linkStrength ?? FORCE_SETTINGS.linkStrength,
  };
}
