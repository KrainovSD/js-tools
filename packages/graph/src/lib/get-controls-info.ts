import {
  FORCE_SETTINGS,
  GRAPH_SETTINGS,
  LINK_OPTIONS,
  LINK_SETTINGS,
  NODE_OPTIONS,
  NODE_SETTINGS,
} from "@/module/GraphCanvas/constants";
import type {
  ForceSettingsInterface,
  GraphSettingsInterface,
  LinkOptionsInterface,
  LinkSettingsInterface,
  NodeOptionsInterface,
  NodeSettingsInterface,
} from "../module/GraphCanvas";
import type { GraphSettingsInputInterface } from "../types/controls";

export function getForceControls<
  NodeData extends Record<string, unknown>,
  LinkData extends Record<string, unknown>,
>(keys?: (keyof ForceSettingsInterface<NodeData, LinkData>)[]) {
  const FORCE_CONTROLS: GraphSettingsInputInterface<
    keyof ForceSettingsInterface<NodeData, LinkData>
  >[] = [
    {
      id: "centerStrength",
      initialValue: FORCE_SETTINGS.centerStrength,
      label: "Граница центра",
      max: 1,
      min: 0,
      step: 0.01,
      type: "range",
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
      label: "Гравитация",
      max: 0,
      min: -300,
      step: 0.1,
      type: "range",
    },
    {
      type: "range",
      id: "xForce",
      min: 0,
      max: 1,
      step: 0.01,
      label: "Граница X",
      initialValue: typeof FORCE_SETTINGS.xForce === "number" ? FORCE_SETTINGS.xForce : 0,
    },
    {
      type: "range",
      id: "yForce",
      min: 0,
      max: 1,
      step: 0.01,
      label: "Граница Y",
      initialValue: typeof FORCE_SETTINGS.yForce === "number" ? FORCE_SETTINGS.yForce : 0,
    },
    {
      type: "range",
      id: "xStrength",
      min: 0,
      max: 1,
      step: 0.01,
      label: "Гравитация X",
      initialValue: typeof FORCE_SETTINGS.xStrength === "number" ? FORCE_SETTINGS.xStrength : 0,
    },
    {
      type: "range",
      id: "yStrength",
      min: 0,
      max: 1,
      step: 0.01,
      label: "Гравитация Y",
      initialValue: typeof FORCE_SETTINGS.yStrength === "number" ? FORCE_SETTINGS.yStrength : 0,
    },
    {
      type: "range",
      id: "linkStrength",
      min: 0,
      max: 1,
      step: 0.01,
      label: "Натяжение связей",
      initialValue:
        typeof FORCE_SETTINGS.linkStrength === "number" ? FORCE_SETTINGS.linkStrength : 0,
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
    {
      id: "collideOn",
      type: "checkbox",
      initialValue: FORCE_SETTINGS.collideOn,
      label: "Отталкивание",
    },
  ];

  return keys ? FORCE_CONTROLS.filter((control) => keys.includes(control.id)) : FORCE_CONTROLS;
}

export function getGraphControls<NodeData extends Record<string, unknown>>(
  keys?: (keyof GraphSettingsInterface<NodeData>)[],
) {
  const GRAPH_CONTROLS: GraphSettingsInputInterface<keyof GraphSettingsInterface<NodeData>>[] = [
    {
      id: "highlightDownFrames",
      initialValue: GRAPH_SETTINGS.highlightDownFrames,
      max: 60,
      min: 1,
      step: 1,
      type: "range",
      label: "Скорость отмены анимации в кадрах",
    },
    {
      id: "highlightUpFrames",
      initialValue: GRAPH_SETTINGS.highlightUpFrames,
      max: 60,
      min: 1,
      step: 1,
      type: "range",
      label: "Скорость применения анимации в кадрах",
    },
  ];

  return keys ? GRAPH_CONTROLS.filter((control) => keys.includes(control.id)) : GRAPH_CONTROLS;
}

export function getNodeSettingControls<
  NodeData extends Record<string, unknown>,
  LinkData extends Record<string, unknown>,
>(keys?: keyof Omit<Required<NodeSettingsInterface<NodeData, LinkData>>, "options" | "idGetter">) {
  const NODE_SETTINGS_CONTROLS: GraphSettingsInputInterface<
    keyof Omit<Required<NodeSettingsInterface<NodeData, LinkData>>, "options" | "idGetter">
  >[] = [
    {
      id: "cache",
      type: "checkbox",
      initialValue: NODE_SETTINGS.cache,
      label: "Кеширование вычисляемых настроек",
    },

    {
      id: "highlightByNodeOnlyRoot",
      type: "checkbox",
      initialValue: NODE_SETTINGS.highlightByNodeOnlyRoot,
      label: "Дополнительная анимация только главное цели при анимации ноды",
    },
    {
      id: "highlightByHoverNode",
      type: "checkbox",
      initialValue: NODE_SETTINGS.highlightByHoverNode,
      label: "Анимации при наведении на ноду",
    },
    {
      id: "nodeRadiusFlexible",
      type: "checkbox",
      initialValue: NODE_SETTINGS.nodeRadiusFlexible,
      label: "Гибкий радиус ноды",
    },
    {
      id: "highlightByNodeNodeFading",
      type: "checkbox",
      initialValue: NODE_SETTINGS.highlightByNodeNodeFading,
      label: "Затухание при анимации ноды",
    },
    {
      id: "highlightByNodeNodeColor",
      type: "checkbox",
      initialValue: NODE_SETTINGS.highlightByNodeNodeColor,
      label: "Затухание цвета при анимации ноды",
    },
    {
      id: "highlightByNodeNodeSizing",
      type: "checkbox",
      initialValue: NODE_SETTINGS.highlightByNodeNodeSizing,
      label: "Изменение размера при анимации ноды",
    },
    {
      id: "highlightByNodeTextFading",
      type: "checkbox",
      initialValue: NODE_SETTINGS.highlightByNodeTextFading,
      label: "Затухание текста при анимации ноды",
    },
    {
      id: "highlightByNodeTextSizing",
      type: "checkbox",
      initialValue: NODE_SETTINGS.highlightByNodeTextSizing,
      label: "Изменение размера текста при анимации ноды",
    },

    {
      id: "highlightByLinkNodeFading",
      type: "checkbox",
      initialValue: NODE_SETTINGS.highlightByLinkNodeFading,
      label: "Затухание при анимации связи",
    },
    {
      id: "highlightByLinkNodeColor",
      type: "checkbox",
      initialValue: NODE_SETTINGS.highlightByLinkNodeColor,
      label: "Затухание цвета при анимации связи",
    },
    {
      id: "highlightByLinkNodeSizing",
      type: "checkbox",
      initialValue: NODE_SETTINGS.highlightByLinkNodeSizing,
      label: "Изменение размера при анимации связи",
    },
    {
      id: "highlightByLinkTextFading",
      type: "checkbox",
      initialValue: NODE_SETTINGS.highlightByLinkTextFading,
      label: "Затухание текста при анимации связи",
    },
    {
      id: "highlightByLinkTextSizing",
      type: "checkbox",
      initialValue: NODE_SETTINGS.highlightByLinkTextSizing,
      label: "Изменение размера текста при анимации связи",
    },
    {
      id: "nodeRadiusInitial",
      initialValue: NODE_SETTINGS.nodeRadiusInitial,
      max: 50,
      min: 0.1,
      step: 0.1,
      type: "range",
      label: "Изначальный радиус ноды",
    },
    {
      id: "nodeRadiusCoefficient",
      initialValue: NODE_SETTINGS.nodeRadiusCoefficient,
      max: 100,
      min: 0.1,
      step: 0.1,
      type: "range",
      label: "Количество связей для увеличения радиуса",
    },
    {
      id: "nodeRadiusFactor",
      initialValue: NODE_SETTINGS.nodeRadiusFactor,
      max: 50,
      min: 0.1,
      step: 0.1,
      type: "range",
      label: "Коэффициент увеличения радиуса",
    },
    {
      id: "highlightByNodeNodeSizingAdditional",
      initialValue: NODE_SETTINGS.highlightByNodeNodeSizingAdditional,
      max: 10,
      min: 0.1,
      step: 0.01,
      type: "range",
      label: "Дополнительный размер при анимации ноды",
    },
    {
      id: "highlightByNodeNodeColorFadingMin",
      initialValue: NODE_SETTINGS.highlightByNodeNodeColorFadingMin,
      max: 1,
      min: 0.01,
      step: 0.01,
      type: "range",
      label: "Граница затухания цвета при анимации ноды",
    },
    {
      id: "highlightByNodeTextShiftXAdditional",
      initialValue: NODE_SETTINGS.highlightByNodeTextShiftXAdditional,
      max: 50,
      min: 0,
      step: 0.1,
      type: "range",
      label: "Смещение текста по X при анимации ноды",
    },
    {
      id: "highlightByNodeTextShiftYAdditional",
      initialValue: NODE_SETTINGS.highlightByNodeTextShiftYAdditional,
      max: 50,
      min: 0,
      step: 0.1,
      type: "range",
      label: "Смещение текста по Y при анимации ноды",
    },
    {
      id: "highlightByNodeTextSizingAdditional",
      initialValue: NODE_SETTINGS.highlightByNodeTextSizingAdditional,
      max: 10,
      min: 0.1,
      step: 0.1,
      type: "range",
      label: "Увеличение текста при анимации ноды",
    },
    {
      id: "highlightByNodeTextWeightAdditional",
      initialValue: NODE_SETTINGS.highlightByNodeTextWeightAdditional,
      max: 1000,
      min: 0,
      step: 100,
      type: "range",
      label: "Увеличение жирности текста при анимации ноды",
    },
    {
      id: "highlightByNodeTextWidthAdditional",
      initialValue: NODE_SETTINGS.highlightByNodeTextWidthAdditional,
      max: 100,
      min: 0,
      step: 0.1,
      type: "range",
      label: "Увеличение ширины текста при анимации ноды",
    },
    {
      id: "highlightByNodeNodeFadingMin",
      initialValue: NODE_SETTINGS.highlightByNodeNodeFadingMin,
      max: 1,
      min: 0,
      step: 0.01,
      type: "range",
      label: "Граница затухания ноды при анимации ноды",
    },
    {
      id: "highlightByNodeTextFadingMin",
      initialValue: NODE_SETTINGS.highlightByNodeTextFadingMin,
      max: 1,
      min: 0,
      step: 0.01,
      type: "range",
      label: "Граница затухания текста при анимации ноды",
    },
    {
      id: "highlightByLinkNodeSizingAdditional",
      initialValue: NODE_SETTINGS.highlightByLinkNodeSizingAdditional,
      max: 10,
      min: 0.1,
      step: 0.01,
      type: "range",
      label: "Дополнительный размер при анимации связи",
    },
    {
      id: "highlightByLinkNodeColorFadingMin",
      initialValue: NODE_SETTINGS.highlightByLinkNodeColorFadingMin,
      max: 1,
      min: 0.01,
      step: 0.01,
      type: "range",
      label: "Граница затухания цвета при анимации связи",
    },
    {
      id: "highlightByLinkTextShiftXAdditional",
      initialValue: NODE_SETTINGS.highlightByLinkTextShiftXAdditional,
      max: 50,
      min: 0,
      step: 0.1,
      type: "range",
      label: "Смещение текста по X при анимации связи",
    },
    {
      id: "highlightByLinkTextShiftYAdditional",
      initialValue: NODE_SETTINGS.highlightByLinkTextShiftYAdditional,
      max: 50,
      min: 0,
      step: 0.1,
      type: "range",
      label: "Смещение текста по Y при анимации связи",
    },
    {
      id: "highlightByLinkTextSizingAdditional",
      initialValue: NODE_SETTINGS.highlightByLinkTextSizingAdditional,
      max: 10,
      min: 0.1,
      step: 0.1,
      type: "range",
      label: "Увеличение текста при анимации связи",
    },
    {
      id: "highlightByLinkTextWeightAdditional",
      initialValue: NODE_SETTINGS.highlightByLinkTextWeightAdditional,
      max: 1000,
      min: 0,
      step: 100,
      type: "range",
      label: "Увеличение жирности текста при анимации связи",
    },
    {
      id: "highlightByLinkTextWidthAdditional",
      initialValue: NODE_SETTINGS.highlightByLinkTextWidthAdditional,
      max: 100,
      min: 0,
      step: 0.1,
      type: "range",
      label: "Увеличение ширины текста при анимации связи",
    },
    {
      id: "highlightByLinkNodeFadingMin",
      initialValue: NODE_SETTINGS.highlightByLinkNodeFadingMin,
      max: 1,
      min: 0,
      step: 0.01,
      type: "range",
      label: "Граница затухания ноды при анимации связи",
    },
    {
      id: "highlightByLinkTextFadingMin",
      initialValue: NODE_SETTINGS.highlightByLinkTextFadingMin,
      max: 1,
      min: 0,
      step: 0.01,
      type: "range",
      label: "Граница затухания текста при анимации связи",
    },
  ];

  return keys
    ? NODE_SETTINGS_CONTROLS.filter((control) => keys.includes(control.id))
    : NODE_SETTINGS_CONTROLS;
}

export function getNodeOptionsControls<
  NodeData extends Record<string, unknown>,
  LinkData extends Record<string, unknown>,
>(keys?: (keyof NodeOptionsInterface<NodeData, LinkData>)[]) {
  const NODE_CONTROLS: GraphSettingsInputInterface<
    keyof NodeOptionsInterface<NodeData, LinkData>
  >[] = [
    {
      id: "radius",
      type: "range",
      max: 50,
      min: 1,
      step: 1,
      label: "Радиус",
      initialValue: NODE_OPTIONS.radius,
    },
    {
      id: "alpha",
      type: "range",
      max: 1,
      min: 0,
      step: 0.1,
      label: "Прозрачность",
      initialValue: NODE_OPTIONS.alpha,
    },
    {
      id: "borderWidth",
      type: "range",
      max: 5,
      min: 0,
      step: 0.1,
      label: "Толщина границы",
      initialValue: NODE_OPTIONS.borderWidth,
    },
    {
      id: "borderColor",
      type: "color",
      initialValue: "#000000FF",
      label: "Цвет границы",
    },
    {
      id: "color",
      type: "color",
      initialValue: "#000000FF",
      label: "Цвет",
    },
    {
      id: "textSize",
      type: "range",
      max: 30,
      min: 0,
      step: 0.1,
      label: "Размер текста",
      initialValue: 0,
    },
    {
      id: "textAlpha",
      type: "range",
      max: 1,
      min: 0,
      step: 0.1,
      label: "Прозрачность текста",
      initialValue: NODE_OPTIONS.textAlpha,
    },
    {
      id: "textWidth",
      type: "range",
      max: 200,
      min: 5,
      step: 1,
      label: "Ширина текста",
      initialValue: NODE_OPTIONS.textWidth,
    },
    {
      id: "textShiftX",
      type: "range",
      max: 100,
      min: 0,
      step: 0.1,
      label: "Смещение X текста",
      initialValue: NODE_OPTIONS.textShiftX,
    },
    {
      id: "textShiftY",
      type: "range",
      max: 100,
      min: 0,
      step: 0.1,
      label: "Смещение Y текста",
      initialValue: 4,
    },
    {
      id: "textWeight",
      type: "range",
      max: 1000,
      min: 100,
      step: 100,
      label: "Жирность текста",
      initialValue: NODE_OPTIONS.textWeight,
    },
    {
      id: "textGap",
      type: "range",
      max: 30,
      min: 0,
      step: 0.1,
      label: "Расстояние между строками",
      initialValue: NODE_OPTIONS.textGap,
    },
    {
      id: "textColor",
      type: "color",
      initialValue: NODE_OPTIONS.textColor,
      label: "Цвет текста",
    },
  ];

  return keys ? NODE_CONTROLS.filter((control) => keys.includes(control.id)) : NODE_CONTROLS;
}

export function getLinkSettingsControls<
  NodeData extends Record<string, unknown>,
  LinkData extends Record<string, unknown>,
>(keys?: keyof Omit<Required<LinkSettingsInterface<NodeData, LinkData>>, "options">) {
  const LINK_SETTINGS_CONTROLS: GraphSettingsInputInterface<
    keyof Omit<Required<LinkSettingsInterface<NodeData, LinkData>>, "options">
  >[] = [
    {
      id: "cache",
      type: "checkbox",
      label: "Кеширование вычисляемых настроек",
      initialValue: LINK_SETTINGS.cache,
    },
    {
      id: "particles",
      type: "checkbox",
      label: "Частицы",
      initialValue: LINK_SETTINGS.particles,
    },
    {
      id: "pretty",
      type: "checkbox",
      label: "Обсчет красивого соединения",
      initialValue: LINK_SETTINGS.pretty,
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
      id: "highlightByHoverLink",
      type: "checkbox",
      label: "Анимация при наведении на связь",
      initialValue: LINK_SETTINGS.highlightByHoverLink,
    },
    {
      id: "highlightByNodeLinkFading",
      type: "checkbox",
      label: "Затухание при анимации ноды",
      initialValue: LINK_SETTINGS.highlightByNodeLinkFading,
    },
    {
      id: "highlightByNodeArrowFading",
      type: "checkbox",
      label: "Затухание стрелки при анимации ноды",
      initialValue: LINK_SETTINGS.highlightByNodeArrowFading,
    },
    {
      id: "highlightByLinkLinkFading",
      type: "checkbox",
      label: "Затухание при анимации связи",
      initialValue: LINK_SETTINGS.highlightByLinkLinkFading,
    },
    {
      id: "highlightByLinkArrowFading",
      type: "checkbox",
      label: "Затухание стрелки при анимации связи",
      initialValue: LINK_SETTINGS.highlightByLinkArrowFading,
    },
    {
      id: "hoverLinkThreshold",
      initialValue: LINK_SETTINGS.hoverLinkThreshold,
      max: 10,
      min: 0,
      step: 0.01,
      type: "range",
      label: "Расширение границы связи для курсора",
    },
    {
      id: "highlightByNodeLinkFadingMin",
      initialValue: LINK_SETTINGS.highlightByNodeLinkFadingMin,
      max: 1,
      min: 0,
      step: 0.01,
      type: "range",
      label: "Граница затухания связи при анимации ноды",
    },
    {
      id: "highlightByNodeArrowFadingMin",
      initialValue: LINK_SETTINGS.highlightByNodeArrowFadingMin,
      max: 1,
      min: 0,
      step: 0.01,
      type: "range",
      label: "Граница затухания стрелки при анимации ноды",
    },
    {
      id: "highlightByLinkLinkFadingMin",
      initialValue: LINK_SETTINGS.highlightByLinkLinkFadingMin,
      max: 1,
      min: 0,
      step: 0.01,
      type: "range",
      label: "Граница затухания связи при анимации связи",
    },
    {
      id: "highlightByLinkArrowFadingMin",
      initialValue: LINK_SETTINGS.highlightByLinkArrowFadingMin,
      max: 1,
      min: 0,
      step: 0.01,
      type: "range",
      label: "Граница затухания стрелки при анимации связи",
    },
  ];

  return keys
    ? LINK_SETTINGS_CONTROLS.filter((control) => keys.includes(control.id))
    : LINK_SETTINGS_CONTROLS;
}

export function getLinkOptionsControls<
  NodeData extends Record<string, unknown>,
  LinkData extends Record<string, unknown>,
>(keys?: (keyof LinkOptionsInterface<NodeData, LinkData>)[]) {
  const LINK_CONTROLS: GraphSettingsInputInterface<
    keyof LinkOptionsInterface<NodeData, LinkData>
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
      id: "arrowAlpha",
      type: "range",
      max: 1,
      min: 0,
      step: 0.1,
      label: "Прозрачность стрелки",
      initialValue: LINK_OPTIONS.arrowAlpha,
    },
    {
      id: "arrowSize",
      type: "range",
      max: 10,
      min: 0.1,
      step: 0.1,
      label: "Размер стрелки",
      initialValue: LINK_OPTIONS.arrowSize,
    },
    {
      id: "arrowBorderWidth",
      type: "range",
      max: 10,
      min: 0.1,
      step: 0.1,
      label: "Размер границы стрелки",
      initialValue: LINK_OPTIONS.arrowBorderWidth,
    },
    {
      id: "particleBorderWidth",
      type: "range",
      max: 10,
      min: 0.1,
      step: 0.1,
      label: "Размер границы частиц",
      initialValue: LINK_OPTIONS.particleBorderWidth,
    },
    {
      id: "particleAlpha",
      type: "range",
      max: 1,
      min: 0,
      step: 0.1,
      label: "Прозрачность частиц",
      initialValue: LINK_OPTIONS.particleAlpha,
    },
    {
      id: "particleRadius",
      type: "range",
      max: 10,
      min: 0.1,
      step: 0.1,
      label: "Радиус частиц",
      initialValue: LINK_OPTIONS.particleRadius,
    },
    {
      id: "particleCount",
      type: "range",
      max: 20,
      min: 1,
      step: 1,
      label: "Количество частиц",
      initialValue: LINK_OPTIONS.particleCount,
    },
    {
      id: "particleSteps",
      type: "range",
      max: 200,
      min: 1,
      step: 1,
      label: "Количество кадров у частиц",
      initialValue: LINK_OPTIONS.particleSteps,
    },
    {
      id: "color",
      type: "color",
      initialValue: "#000000FF",
      label: "Цвет",
    },
    {
      id: "arrowColor",
      type: "color",
      initialValue: "#000000FF",
      label: "Цвет стрелки",
    },
    {
      id: "arrowBorderColor",
      type: "color",
      initialValue: LINK_OPTIONS.arrowBorderColor,
      label: "Цвет границы стрелки",
    },
    {
      id: "particleColor",
      type: "color",
      initialValue: LINK_OPTIONS.particleColor,
      label: "Цвет частиц",
    },
    {
      id: "particleBorderColor",
      type: "color",
      initialValue: LINK_OPTIONS.particleBorderColor,
      label: "Цвет границы частиц",
    },
  ];

  return keys ? LINK_CONTROLS.filter((control) => keys.includes(control.id)) : LINK_CONTROLS;
}
