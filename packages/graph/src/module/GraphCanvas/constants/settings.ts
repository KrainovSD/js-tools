export const FORCE_SETTINGS = {
  centerPosition: {},
  centerStrength: 1,
  collideRadius: 10,
  collideStrength: 1,
  collideIterations: 1,
  collideOffMax: { links: 0, nodes: 0 },
  collideOn: true,
  chargeStrength: -40,
  chargeDistanceMax: Infinity,
  chargeDistanceMin: 1,
  xForce: 0,
  xStrength: 0.1,
  yForce: 0,
  yStrength: 0.1,
  linkDistance: 10,
  linkIterations: 1,
  linkStrength: 1,
};

export const GRAPH_SETTINGS = {
  zoomExtent: [0.5, 10] as [number, number],
};

export const NODE_SETTINGS = {
  alpha: 1,
  colorOuter: "#fff",
  font: "8px Arial",
  fontAlign: "center" as CanvasTextAlign,
  fontColor: "#333",
  radius: 5,
  width: 1,
};

export const LINK_SETTINGS = {
  alpha: 1,
  color: "#999",
  width: 1,
};
