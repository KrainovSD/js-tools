export type ControlRange = {
  type: "range";
  min: number;
  max: number;
  step: number;
  label: string;
  id: string;
};

export type ValueOf<T> = T extends {} ? T[keyof T] : unknown;

export type ControlCheckBox = {
  type: "checkbox";
  label: string;
  id: string;
};

export type ControlRadio = {
  type: "radio";
  label: string;
  id: string;
  name: string;
};

export type ControlInterface = ControlRange | ControlRadio | ControlCheckBox;

export const CONTROLS = {
  Data: "data-controls",
  ForceUseless: "force-useless",
  Force: "force",
};

export const DATA_TYPES = {
  D3: "d3",
  Real: "real",
  Stress: "stress",
  Custom: "custom",
  Dynamic: "dynamic",
} as const;

export const FORCE_USELESS_TYPES = {
  Center: "center",
  LinkForce: "linkForce",
};

export const FORCE_TYPES = {
  Charge: "charge",
  LinkDistance: "linkDistance",
  XForce: "xForce",
  YForce: "yForce",
  RadiusCoefficient: "radiusCoefficient",
  RadiusFactor: "radiusFactor",
};

export const DATA_CONTROLS: ControlInterface[] = [
  { type: "radio", id: DATA_TYPES.D3, label: "D3", name: "data" },
  { type: "radio", id: DATA_TYPES.Real, label: "Real", name: "data" },
  { type: "radio", id: DATA_TYPES.Stress, label: "Stress", name: "data" },
  { type: "radio", id: DATA_TYPES.Custom, label: "Custom", name: "data" },
  { type: "radio", id: DATA_TYPES.Dynamic, label: "Dynamic", name: "data" },
];

export const FORCES_USELESS_CONTROLS: ControlInterface[] = [
  { type: "range", id: FORCE_USELESS_TYPES.Center, label: "Center", min: 0, max: 1, step: 0.01 },
  {
    type: "range",
    id: FORCE_USELESS_TYPES.LinkForce,
    label: "Link Force",
    min: 0,
    max: 1,
    step: 0.01,
  },
];

export const FORCES_CONTROLS: ControlInterface[] = [
  { type: "range", id: FORCE_TYPES.Charge, label: "Charge", min: 0, max: 500, step: 1 },
  {
    type: "range",
    id: FORCE_TYPES.LinkDistance,
    label: "Link Distance",
    min: 0,
    max: 500,
    step: 1,
  },
  { type: "range", id: FORCE_TYPES.XForce, label: "X", min: 0, max: 1, step: 0.01 },
  { type: "range", id: FORCE_TYPES.YForce, label: "Y", min: 0, max: 1, step: 0.01 },
  {
    type: "range",
    id: FORCE_TYPES.RadiusCoefficient,
    label: "RadiusCoefficient",
    min: 1,
    max: 100,
    step: 1,
  },
  {
    type: "range",
    id: FORCE_TYPES.RadiusFactor,
    label: "RadiusFactor",
    min: 0.1,
    max: 50,
    step: 0.1,
  },
];
