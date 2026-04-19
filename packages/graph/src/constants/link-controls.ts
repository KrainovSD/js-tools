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
    id: "particleSpeedByDistance",
    initialValue: LINK_SETTINGS.particleSpeedByDistance,
    max: 500,
    min: 1,
    step: 1,
    type: "range",
    label: "Скорость частицы на один пиксель",
  },
  {
    id: "particleCountByDistance",
    initialValue: LINK_SETTINGS.particleCountByDistance,
    max: 250,
    min: 1,
    step: 1,
    type: "range",
    label: "Количество пикселей для появления частицы",
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
