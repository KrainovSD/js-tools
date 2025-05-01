import type { ForceSettingsInterface } from "@/module/GraphCanvas";
import { FORCE_SETTINGS } from "@/module/GraphCanvas/constants";
import type { GraphSettingsInputInterface } from "@/types";

export const FORCE_CONTROLS: GraphSettingsInputInterface<
  keyof ForceSettingsInterface<Record<string, unknown>, Record<string, unknown>>
>[] = [
  {
    id: "forces",
    initialValue: FORCE_SETTINGS.forces,
    label: "Физика",
    type: "checkbox",
  },
  {
    id: "collideForce",
    type: "checkbox",
    label: "Сила отталкивания",
    initialValue: FORCE_SETTINGS.collideForce,
  },
  {
    id: "centerForce",
    type: "checkbox",
    label: "Сила центрирования",
    initialValue: FORCE_SETTINGS.centerForce,
  },
  {
    id: "chargeForce",
    type: "checkbox",
    label: "Сила дистанции",
    initialValue: FORCE_SETTINGS.chargeForce,
  },
  {
    id: "linkForce",
    type: "checkbox",
    label: "Сила связей",
    initialValue: FORCE_SETTINGS.linkForce,
  },
  {
    id: "xForce",
    type: "checkbox",
    label: "Сила притяжения по оси X",
    initialValue: FORCE_SETTINGS.xForce,
  },
  {
    id: "yForce",
    type: "checkbox",
    label: "Сила притяжения по оси Y",
    initialValue: FORCE_SETTINGS.yForce,
  },

  {
    id: "collideStrength",
    initialValue: FORCE_SETTINGS.collideStrength,
    label: "Сила отталкивания",
    max: 1,
    min: 0,
    step: 0.01,
    type: "range",
  },
  {
    id: "collideAdditionalRadius",
    initialValue: FORCE_SETTINGS.collideAdditionalRadius,
    label: "Радиус отталкивания",
    max: 300,
    min: 0,
    step: 0.1,
    type: "range",
  },
  {
    id: "collideIterations",
    initialValue: FORCE_SETTINGS.collideIterations,
    label: "Итерации отталкивания",
    max: 10,
    min: 0,
    step: 1,
    type: "range",
  },
  {
    id: "chargeStrength",
    initialValue:
      typeof FORCE_SETTINGS.chargeStrength === "number" ? FORCE_SETTINGS.chargeStrength : 0,
    label: "Дистанция",
    max: 0,
    min: -300,
    step: 0.1,
    type: "range",
  },
  {
    type: "range",
    id: "xPosition",
    min: 0,
    max: 2000,
    step: 1,
    label: "Координата притяжения по оси X",
    initialValue: typeof FORCE_SETTINGS.xPosition === "number" ? FORCE_SETTINGS.xPosition : 0,
  },
  {
    type: "range",
    id: "yPosition",
    min: 0,
    max: 2000,
    step: 1,
    label: "Координата притяжения по оси Y",
    initialValue: typeof FORCE_SETTINGS.yPosition === "number" ? FORCE_SETTINGS.yPosition : 0,
  },
  {
    type: "range",
    id: "xStrength",
    min: 0,
    max: 1,
    step: 0.01,
    label: "Сила притяжения по оси X",
    initialValue: typeof FORCE_SETTINGS.xStrength === "number" ? FORCE_SETTINGS.xStrength : 0,
  },
  {
    type: "range",
    id: "yStrength",
    min: 0,
    max: 1,
    step: 0.01,
    label: "Сила притяжения по оси Y",
    initialValue: typeof FORCE_SETTINGS.yStrength === "number" ? FORCE_SETTINGS.yStrength : 0,
  },
  {
    type: "range",
    id: "linkStrength",
    min: 0,
    max: 1,
    step: 0.01,
    label: "Сила связей",
    initialValue: typeof FORCE_SETTINGS.linkStrength === "number" ? FORCE_SETTINGS.linkStrength : 0,
  },
  {
    type: "range",
    id: "linkDistance",
    min: 0,
    max: 300,
    step: 0.1,
    label: "Расстояние связей",
    initialValue:
      typeof FORCE_SETTINGS.linkDistance === "number" ? FORCE_SETTINGS.linkDistance : 30,
  },
];
