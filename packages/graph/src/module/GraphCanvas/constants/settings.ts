export const FORCE_SETTINGS = {
  centerPosition: {},
  centerStrength: 1,
  collideAdditionalRadius: 2,
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
  zoomExtent: [0.1, 10] as [number, number],
  stickAfterDrag: false,
  highlightByHover: false,
  minFading: 0.2,
};

export const NODE_SETTINGS = {
  alpha: 1,
  colorOuter: "#fff",
  textWidth: 30,
  textShiftX: 0,
  textShiftY: 8,
  textSize: 6,
  textFont: "Arial",
  textAlign: "center" as CanvasTextAlign,
  textColor: "#333",
  width: 1,
  zoomTextBorder: 2,
  initialRadius: 4,
  radiusCoefficient: 5,
  radiusFactor: 1,
  flexibleRadius: true,
};

export const LINK_SETTINGS = {
  alpha: 1,
  colorFar: "#999",
  colorNear: "#000000FF",
  widthFar: 1,
  widthNear: 0.1,
  zoomWidthBorder: 1,
  zoomColorBorder: 1,
};
