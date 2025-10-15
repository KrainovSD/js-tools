import type {
  LinkOptionsArrowInterface,
  LinkOptionsLinkInterface,
  LinkOptionsParticleInterface,
  LinkSettingsInterface,
} from "@/module/GraphCanvas";
import { LINK_OPTIONS, LINK_SETTINGS } from "@/module/GraphCanvas/constants";
import type { GraphSettingsInputInterface } from "@/types";

export const LINK_SETTINGS_CONTROLS: GraphSettingsInputInterface<
  keyof Omit<
    Required<LinkSettingsInterface<Record<string, unknown>, Record<string, unknown>>>,
    "options"
  >
>[] = [
  {
    id: "prettyDraw",
    type: "checkbox",
    label: "Обсчет корректного соединения",
    initialValue: LINK_SETTINGS.prettyDraw,
  },
  {
    id: "linkScaleSwitch",
    initialValue: LINK_SETTINGS.linkScaleSwitch,
    max: 20,
    min: 0,
    step: 0.01,
    type: "range",
    label: "Граница зума для связи",
  },
  {
    id: "linkWidthAfterScaleSwitch",
    initialValue: LINK_SETTINGS.linkWidthAfterScaleSwitch,
    max: 20,
    min: 0,
    step: 0.01,
    type: "range",
    label: "Размер связи после границы зума",
  },
  {
    id: "linkWidthBeforeScaleSwitch",
    initialValue: LINK_SETTINGS.linkWidthBeforeScaleSwitch,
    max: 20,
    min: 0,
    step: 0.01,
    type: "range",
    label: "Размер связи до границы зума",
  },
  {
    id: "linkColorAfterScaleSwitch",
    type: "color",
    initialValue: LINK_SETTINGS.linkColorAfterScaleSwitch,
    label: "Цвет связи после границы зума",
  },
  {
    id: "linkColorBeforeScaleSwitch",
    type: "color",
    initialValue: LINK_SETTINGS.linkColorBeforeScaleSwitch,
    label: "Цвет связи до границы зума",
  },
  {
    id: "arrow",
    type: "checkbox",
    label: "Стрелка",
    initialValue: LINK_SETTINGS.arrow,
  },
  {
    id: "arrowByHighlight",
    type: "checkbox",
    label: "Появление стрелки при анимации",
    initialValue: LINK_SETTINGS.arrowByHighlight,
  },
  {
    id: "particles",
    type: "checkbox",
    label: "Частицы",
    initialValue: LINK_SETTINGS.particles,
  },
  {
    id: "particleFlexSpeed",
    type: "checkbox",
    label: "Гибкий расчет скорости частицы",
    initialValue: LINK_SETTINGS.particleFlexSpeed,
  },
  {
    id: "particleFlexSpeedCoefficient",
    initialValue: LINK_SETTINGS.particleFlexSpeedCoefficient,
    max: 10,
    min: 0.1,
    step: 0.1,
    type: "range",
    label: "Коэффициент скорости частицы относительно расстояния",
  },
];

export const LINK_OPTIONS_LINK_CONTROLS: GraphSettingsInputInterface<
  keyof LinkOptionsLinkInterface
>[] = [
  {
    id: "alpha",
    type: "range",
    max: 1,
    min: 0,
    step: 0.1,
    label: "Прозрачность",
    initialValue: LINK_OPTIONS.alpha,
  },
  {
    id: "width",
    type: "range",
    max: 10,
    min: 0.1,
    step: 0.1,
    label: "Толщина",
    initialValue: 0.1,
  },
  {
    id: "color",
    type: "color",
    initialValue: "#000000FF",
    label: "Цвет",
  },
];
export const LINK_OPTIONS_ARROW_CONTROLS: GraphSettingsInputInterface<
  keyof LinkOptionsArrowInterface
>[] = [
  {
    id: "arrowColor",
    type: "color",
    initialValue: "#000000FF",
    label: "Цвет стрелки",
  },
  {
    id: "arrowAlpha",
    type: "range",
    max: 1,
    min: 0,
    step: 0.1,
    label: "Прозрачность",
    initialValue: LINK_OPTIONS.arrowAlpha,
  },
  {
    id: "arrowSize",
    type: "range",
    max: 10,
    min: 0.1,
    step: 0.1,
    label: "Размер",
    initialValue: LINK_OPTIONS.arrowSize,
  },
  {
    id: "arrowBorderColor",
    type: "color",
    initialValue: LINK_OPTIONS.arrowBorderColor,
    label: "Цвет границы",
  },
  {
    id: "arrowBorderWidth",
    type: "range",
    max: 10,
    min: 0,
    step: 0.1,
    label: "Размер границы",
    initialValue: LINK_OPTIONS.arrowBorderWidth,
  },
];
export const LINK_OPTIONS_PARTICLE_CONTROLS: GraphSettingsInputInterface<
  keyof LinkOptionsParticleInterface
>[] = [
  {
    id: "particleColor",
    type: "color",
    initialValue: LINK_OPTIONS.particleColor,
    label: "Цвет",
  },
  {
    id: "particleAlpha",
    type: "range",
    max: 1,
    min: 0,
    step: 0.1,
    label: "Прозрачность",
    initialValue: LINK_OPTIONS.particleAlpha,
  },
  {
    id: "particleRadius",
    type: "range",
    max: 10,
    min: 0.1,
    step: 0.1,
    label: "Радиус",
    initialValue: LINK_OPTIONS.particleRadius,
  },
  {
    id: "particleCount",
    type: "range",
    max: 20,
    min: 1,
    step: 1,
    label: "Количество",
    initialValue: LINK_OPTIONS.particleCount,
  },
  {
    id: "particleSteps",
    type: "range",
    max: 200,
    min: 1,
    step: 1,
    label: "Количество кадров",
    initialValue: LINK_OPTIONS.particleSteps,
  },
  {
    id: "particleBorderColor",
    type: "color",
    initialValue: LINK_OPTIONS.particleBorderColor,
    label: "Цвет границы",
  },
  {
    id: "particleBorderWidth",
    type: "range",
    max: 10,
    min: 0,
    step: 0.1,
    label: "Размер границы",
    initialValue: LINK_OPTIONS.particleBorderWidth,
  },
];
