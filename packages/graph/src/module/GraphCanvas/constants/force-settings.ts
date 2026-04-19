import type { ForceSettingsInterface } from "../types/force-settings";

export const FORCE_SETTINGS: Required<
  ForceSettingsInterface<Record<string, unknown>, Record<string, unknown>>
> = {
  forces: true,
  centerForce: true,
  chargeForce: true,
  linkForce: true,
  xForce: true,
  yForce: true,
  collideForce: true,
  precompute: true,
  precomputeMaxTicks: 300,
  precomputeMaxTimeMs: 200,
  precomputeDisableForcesAfter: false,
  centerPosition: {},
  centerStrength: 1,
  collideStrength: 0.1,
  collideAdditionalRadius: 4,
  collideIterations: 2,
  collideOffMax: { links: 0, nodes: 0 },
  chargeStrength: -40,
  chargeDistanceMin: 1,
  xPosition: 0,
  xStrength: 0.1,
  yPosition: 0,
  yStrength: 0.1,
  linkDistance: 30,
  linkIterations: 1,
  linkStrength: 1,
  collideRadius: null,
};

export const PERFORMANCE_FORCE_SETTINGS: Required<
  ForceSettingsInterface<Record<string, unknown>, Record<string, unknown>>
> = {
  ...FORCE_SETTINGS,
  collideIterations: 1,
  precomputeMaxTimeMs: 350,
  precomputeDisableForcesAfter: true,
};
