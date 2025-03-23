import type {
  ForceSettingsInterface,
  GraphSettingsInterface,
  LinkOptionsInterface,
  NodeOptionsInterface,
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
      initialValue: 1,
      label: "Граница центра",
      max: 1,
      min: 0,
      step: 0.01,
      type: "range",
    },
    {
      id: "collideStrength",
      initialValue: 0.1,
      label: "Сила отталкивания",
      max: 1,
      min: 0,
      step: 0.01,
      type: "range",
    },
    {
      id: "collideAdditionalRadius",
      initialValue: 4,
      label: "Радиус отталкивания",
      max: 300,
      min: 0,
      step: 0.1,
      type: "range",
    },
    {
      id: "collideIterations",
      initialValue: 2,
      label: "Итерации отталкивания",
      max: 10,
      min: 0,
      step: 1,
      type: "range",
    },
    {
      id: "chargeStrength",
      initialValue: 2,
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
      initialValue: 0,
    },
    {
      type: "range",
      id: "yForce",
      min: 0,
      max: 1,
      step: 0.01,
      label: "Граница Y",
      initialValue: 0,
    },
    {
      type: "range",
      id: "xStrength",
      min: 0,
      max: 1,
      step: 0.01,
      label: "Гравитация X",
      initialValue: 0.1,
    },
    {
      type: "range",
      id: "yStrength",
      min: 0,
      max: 1,
      step: 0.01,
      label: "Гравитация Y",
      initialValue: 0.1,
    },
    {
      type: "range",
      id: "linkStrength",
      min: 0,
      max: 1,
      step: 0.01,
      label: "Натяжение связей",
      initialValue: 1,
    },
    {
      type: "range",
      id: "linkDistance",
      min: 0,
      max: 300,
      step: 0.1,
      label: "Расстояние связей",
      initialValue: 30,
    },
    {
      id: "collideOn",
      type: "checkbox",
      initialValue: true,
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
      id: "highlightSizingAdditional",
      initialValue: 0.5,
      max: 10,
      min: 0.1,
      step: 0.01,
      type: "range",
      label: "Дополнительный размер при анимации",
    },
    {
      id: "highlightColorFadingMin",
      initialValue: 0.15,
      max: 1,
      min: 0.01,
      step: 0.01,
      type: "range",
      label: "Граница затухания цвета",
    },
    {
      id: "highlightTextShiftXAdditional",
      initialValue: 0,
      max: 50,
      min: 0,
      step: 0.1,
      type: "range",
      label: "Смещение текста по X при анимации",
    },
    {
      id: "highlightTextShiftYAdditional",
      initialValue: 2,
      max: 50,
      min: 0,
      step: 0.1,
      type: "range",
      label: "Смещение текста по Y при анимации",
    },
    {
      id: "highlightTextSizingAdditional",
      initialValue: 1,
      max: 10,
      min: 0.1,
      step: 0.1,
      type: "range",
      label: "Увеличение текста при анимации",
    },
    {
      id: "highlightTextWeightAdditional",
      initialValue: 0,
      max: 1000,
      min: 0,
      step: 100,
      type: "range",
      label: "Увеличение жирности текста при анимации",
    },
    {
      id: "highlightTextWidthAdditional",
      initialValue: 0,
      max: 100,
      min: 0,
      step: 0.1,
      type: "range",
      label: "Увеличение ширины текста при анимации",
    },
    {
      id: "highlightTextFadingMin",
      initialValue: 0.21,
      max: 1,
      min: 0,
      step: 0.01,
      type: "range",
      label: "Граница затухания текста при анимации",
    },
    {
      id: "highlightLinkFadingMin",
      initialValue: 0.21,
      max: 1,
      min: 0,
      step: 0.01,
      type: "range",
      label: "Граница затухания связи при анимации",
    },
    {
      id: "highlightFadingMin",
      initialValue: 0.21,
      max: 1,
      min: 0,
      step: 0.01,
      type: "range",
      label: "Граница затухания ноды при анимации",
    },

    {
      id: "highlightDownStep",
      initialValue: 0.2,
      max: 1,
      min: 0.01,
      step: 0.01,
      type: "range",
      label: "Скорость отмены анимации",
    },
    {
      id: "highlightUpStep",
      initialValue: 0.2,
      max: 1,
      min: 0.01,
      step: 0.01,
      type: "range",
      label: "Скорость применения анимации",
    },
    {
      id: "nodeRadiusInitial",
      initialValue: 4,
      max: 50,
      min: 0.1,
      step: 0.1,
      type: "range",
      label: "Изначальный радиус ноды",
    },
    {
      id: "nodeRadiusCoefficient",
      initialValue: 5,
      max: 100,
      min: 0.1,
      step: 0.1,
      type: "range",
      label: "Количество связей для увеличения радиуса",
    },
    {
      id: "nodeRadiusFactor",
      initialValue: 1,
      max: 50,
      min: 0.1,
      step: 0.1,
      type: "range",
      label: "Коэффициент увеличения радиуса",
    },
    {
      id: "highlightOnlyRoot",
      type: "checkbox",
      initialValue: true,
      label: "Дополнительная анимация только главное цели",
    },
    {
      id: "stickAfterDrag",
      type: "checkbox",
      initialValue: true,
      label: "Фиксировании ноды после перетаскивания",
    },
    {
      id: "highlightByHover",
      type: "checkbox",
      initialValue: true,
      label: "Анимации при наведении",
    },
    {
      id: "nodeRadiusFlexible",
      type: "checkbox",
      initialValue: true,
      label: "Гибкий радиус ноды",
    },
  ];

  return keys ? GRAPH_CONTROLS.filter((control) => keys.includes(control.id)) : GRAPH_CONTROLS;
}

export function getNodeControls<
  NodeData extends Record<string, unknown>,
  LinkData extends Record<string, unknown>,
>(keys?: (keyof NodeOptionsInterface<NodeData, LinkData>)[]) {
  const NODE_CONTROLS: GraphSettingsInputInterface<
    keyof NodeOptionsInterface<NodeData, LinkData>
  >[] = [
    {
      id: "alpha",
      type: "range",
      max: 1,
      min: 0,
      step: 0.1,
      label: "Прозрачность",
      initialValue: 1,
    },

    {
      id: "radius",
      type: "range",
      max: 50,
      min: 1,
      step: 1,
      label: "Радиус",
      initialValue: 4,
    },
    {
      id: "borderWidth",
      type: "range",
      max: 5,
      min: 0,
      step: 0.1,
      label: "Толщина границы",
      initialValue: 1,
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
      id: "highlightFading",
      type: "checkbox",
      initialValue: true,
      label: "Анимация затухания",
    },
    {
      id: "highlightColor",
      type: "checkbox",
      initialValue: false,
      label: "Анимация затухания цвета",
    },
    {
      id: "highlightSizing",
      type: "checkbox",
      initialValue: true,
      label: "Анимация размера",
    },
  ];

  return keys ? NODE_CONTROLS.filter((control) => keys.includes(control.id)) : NODE_CONTROLS;
}

export function getTextControls<
  NodeData extends Record<string, unknown>,
  LinkData extends Record<string, unknown>,
>(keys?: (keyof NodeOptionsInterface<NodeData, LinkData>)[]) {
  const NODE_CONTROLS: GraphSettingsInputInterface<
    keyof NodeOptionsInterface<NodeData, LinkData>
  >[] = [
    {
      id: "textAlpha",
      type: "range",
      max: 1,
      min: 0,
      step: 0.1,
      label: "Прозрачность текста",
      initialValue: 1,
    },
    {
      id: "textWidth",
      type: "range",
      max: 200,
      min: 5,
      step: 1,
      label: "Ширина текста",
      initialValue: 20,
    },
    {
      id: "textShiftX",
      type: "range",
      max: 1000,
      min: 0,
      step: 1,
      label: "Смещение X текста",
      initialValue: 0,
    },
    {
      id: "textShiftY",
      type: "range",
      max: 1000,
      min: 0,
      step: 1,
      label: "Смещение Y текста",
      initialValue: 15,
    },
    {
      id: "textWeight",
      type: "range",
      max: 1000,
      min: 100,
      step: 100,
      label: "Жирность текста",
      initialValue: 500,
    },
    {
      id: "textGap",
      type: "range",
      max: 100,
      min: 0,
      step: 1,
      label: "Расстояние между текстом",
      initialValue: 1,
    },

    {
      id: "highlightTextFading",
      type: "checkbox",
      initialValue: true,
      label: "Анимация затухания текста",
    },
    {
      id: "highlightTextSizing",
      type: "checkbox",
      initialValue: true,
      label: "Анимация размера текста",
    },
  ];

  return keys ? NODE_CONTROLS.filter((control) => keys.includes(control.id)) : NODE_CONTROLS;
}

export function getLinkControls<
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
      initialValue: 1,
    },
    {
      id: "width",
      type: "range",
      max: 10,
      min: 0,
      step: 0.1,
      label: "Толщина",
      initialValue: 0,
    },

    {
      id: "color",
      type: "color",
      initialValue: "#000000FF",
      label: "Цвет",
    },
    {
      id: "highlightFading",
      type: "checkbox",
      label: "Анимация Затухания",
      initialValue: true,
    },
    {
      id: "pretty",
      type: "checkbox",
      label: "Обсчет соединения",
      initialValue: true,
    },
  ];

  return keys ? LINK_CONTROLS.filter((control) => keys.includes(control.id)) : LINK_CONTROLS;
}
