import type {
  HighlighCommonSettingsInterface,
  HighlightByLinkForArrowSettingsInterface,
  HighlightByLinkForLabelSettingsInterface,
  HighlightByLinkForLinkSettingsInterface,
  HighlightByLinkForNodeSettingsInterface,
  HighlightByLinkForTextSettingsInterface,
  HighlightByNodeForArrowSettingsInterface,
  HighlightByNodeForLabelSettingsInterface,
  HighlightByNodeForLinkSettingsInterface,
  HighlightByNodeForNodeSettingsInterface,
  HighlightByNodeForTextSettingsInterface,
} from "@/module/GraphCanvas";
import { HIGHLIGHT_SETTINGS } from "@/module/GraphCanvas/constants";
import type { GraphSettingsInputInterface } from "@/types";

export const HIGHLIGHT_COMMON_CONTROLS: GraphSettingsInputInterface<
  keyof HighlighCommonSettingsInterface
>[] = [
  {
    id: "highlightByHoverNode",
    type: "checkbox",
    initialValue: HIGHLIGHT_SETTINGS.highlightByHoverNode,
    label: "Анимация при наведении на вершину",
  },
  {
    id: "highlightByHoverLink",
    type: "checkbox",
    label: "Анимация при наведении на связь",
    initialValue: HIGHLIGHT_SETTINGS.highlightByHoverLink,
  },
  {
    id: "linkHoverExtraZone",
    initialValue: HIGHLIGHT_SETTINGS.linkHoverExtraZone,
    max: 10,
    min: 0,
    step: 0.01,
    type: "range",
    label: "Расширение границы связи для курсора",
  },
  {
    id: "highlightDownFrames",
    initialValue: HIGHLIGHT_SETTINGS.highlightDownFrames,
    max: 60,
    min: 1,
    step: 1,
    type: "range",
    label: "Скорость отмены анимации в кадрах",
  },
  {
    id: "highlightUpFrames",
    initialValue: HIGHLIGHT_SETTINGS.highlightUpFrames,
    max: 60,
    min: 1,
    step: 1,
    type: "range",
    label: "Скорость применения анимации в кадрах",
  },
];

export const HIGHLIGHT_BY_NODE_FOR_NODE_CONTROLS: GraphSettingsInputInterface<
  keyof HighlightByNodeForNodeSettingsInterface
>[] = [
  {
    id: "highlightByNodeOnlyRoot",
    type: "checkbox",
    initialValue: HIGHLIGHT_SETTINGS.highlightByNodeOnlyRoot,
    label: "Основная анимация только на инициаторе",
  },
  {
    id: "highlightByNodeForNodeColorFading",
    type: "checkbox",
    initialValue: HIGHLIGHT_SETTINGS.highlightByNodeForNodeColorFading,
    label: "Прозрачность без альфа канала",
  },
  {
    id: "highlightByNodeForNodeColor",
    type: "color",
    initialValue: HIGHLIGHT_SETTINGS.highlightByNodeForNodeColor ?? "#000000",
    label: "Цвет",
  },
  {
    id: "highlightByNodeForNodeFadingMin",
    initialValue: HIGHLIGHT_SETTINGS.highlightByNodeForNodeFadingMin,
    max: 1,
    min: 0,
    step: 0.01,
    type: "range",
    label: "Граница прозрачности",
  },
  {
    id: "highlightByNodeForNodeSizingAdditional",
    initialValue: HIGHLIGHT_SETTINGS.highlightByNodeForNodeSizingAdditional,
    max: 10,
    min: -10,
    step: 0.01,
    type: "range",
    label: "Изменение радиуса (только для круга)",
  },
  {
    id: "highlightByNodeForNodeSizingAdditionalCoefficient",
    initialValue: HIGHLIGHT_SETTINGS.highlightByNodeForNodeSizingAdditionalCoefficient,
    max: 10,
    min: 0.01,
    step: 0.01,
    type: "range",
    label: "Коэффициент изменения размера (только не для круга)",
  },
  {
    id: "highlightByNodeForNodeBorderColor",
    type: "color",
    initialValue: HIGHLIGHT_SETTINGS.highlightByNodeForNodeBorderColor ?? "#000000",
    label: "Цвет границы",
  },
  {
    id: "highlightByNodeForNodeBorderSizingAdditional",
    initialValue: HIGHLIGHT_SETTINGS.highlightByNodeForNodeBorderSizingAdditional,
    max: 10,
    min: 0.01,
    step: 0.01,
    type: "range",
    label: "Изменение размера границы",
  },
];

export const HIGHLIGHT_BY_NODE_FOR_TEXT_CONTROLS: GraphSettingsInputInterface<
  keyof HighlightByNodeForTextSettingsInterface
>[] = [
  {
    id: "highlightByNodeForTextFadingMin",
    initialValue: HIGHLIGHT_SETTINGS.highlightByNodeForTextFadingMin,
    max: 1,
    min: 0,
    step: 0.01,
    type: "range",
    label: "Граница прозрачности",
  },
  {
    id: "highlightByNodeForTextSizingAdditional",
    initialValue: HIGHLIGHT_SETTINGS.highlightByNodeForTextSizingAdditional,
    max: 10,
    min: -10,
    step: 0.1,
    type: "range",
    label: "Изменение размера",
  },
  {
    id: "highlightByNodeForTextWeightAdditional",
    initialValue: HIGHLIGHT_SETTINGS.highlightByNodeForTextWeightAdditional,
    max: 1000,
    min: -1000,
    step: 100,
    type: "range",
    label: "Изменение жирности",
  },
  {
    id: "highlightByNodeForTextShiftXAdditional",
    initialValue: HIGHLIGHT_SETTINGS.highlightByNodeForTextShiftXAdditional,
    max: 50,
    min: -50,
    step: 0.1,
    type: "range",
    label: "Смещение по оси X",
  },
  {
    id: "highlightByNodeForTextShiftYAdditional",
    initialValue: HIGHLIGHT_SETTINGS.highlightByNodeForTextShiftYAdditional,
    max: 50,
    min: -50,
    step: 0.1,
    type: "range",
    label: "Смещение по оси Y",
  },
];

export const HIGHLIGHT_BY_NODE_FOR_LABEL_CONTROLS: GraphSettingsInputInterface<
  keyof HighlightByNodeForLabelSettingsInterface
>[] = [
  {
    id: "highlightByNodeForLabelFadingMin",
    initialValue: HIGHLIGHT_SETTINGS.highlightByNodeForLabelFadingMin,
    max: 1,
    min: 0,
    step: 0.01,
    type: "range",
    label: "Граница прозрачности",
  },
  {
    id: "highlightByNodeForLabelSizingAdditional",
    initialValue: HIGHLIGHT_SETTINGS.highlightByNodeForLabelSizingAdditional,
    max: 10,
    min: -10,
    step: 0.1,
    type: "range",
    label: "Изменение размера",
  },
  {
    id: "highlightByNodeForLabelWeightAdditional",
    initialValue: HIGHLIGHT_SETTINGS.highlightByNodeForLabelWeightAdditional,
    max: 1000,
    min: -1000,
    step: 100,
    type: "range",
    label: "Изменение жирности",
  },
];

export const HIGHLIGHT_BY_NODE_FOR_LINK_CONTROLS: GraphSettingsInputInterface<
  keyof HighlightByNodeForLinkSettingsInterface
>[] = [
  {
    id: "highlightByNodeForLinkColor",
    type: "color",
    initialValue: HIGHLIGHT_SETTINGS.highlightByNodeForLinkColor ?? "#000000",
    label: "Цвет",
  },
  {
    id: "highlightByNodeForLinkFadingMin",
    initialValue: HIGHLIGHT_SETTINGS.highlightByNodeForLinkFadingMin,
    max: 1,
    min: 0,
    step: 0.01,
    type: "range",
    label: "Граница прозрачности",
  },
  {
    id: "highlightByNodeForLinkSizeAdditional",
    initialValue: HIGHLIGHT_SETTINGS.highlightByNodeForLinkSizeAdditional,
    max: 10,
    min: -10,
    step: 0.1,
    type: "range",
    label: "Изменение размера",
  },
];

export const HIGHLIGHT_BY_NODE_FOR_ARROW_CONTROLS: GraphSettingsInputInterface<
  keyof HighlightByNodeForArrowSettingsInterface
>[] = [
  {
    id: "highlightByNodeForArrowColor",
    type: "color",
    initialValue: HIGHLIGHT_SETTINGS.highlightByNodeForArrowColor ?? "#000000",
    label: "Цвет",
  },
  {
    id: "highlightByNodeForArrowFadingMin",
    initialValue: HIGHLIGHT_SETTINGS.highlightByNodeForArrowFadingMin,
    max: 1,
    min: 0,
    step: 0.01,
    type: "range",
    label: "Граница прозрачности",
  },
  {
    id: "highlightByNodeForArrowSizeAdditional",
    initialValue: HIGHLIGHT_SETTINGS.highlightByNodeForArrowSizeAdditional,
    max: 10,
    min: -10,
    step: 0.1,
    type: "range",
    label: "Изменение размера",
  },
  {
    id: "highlightByNodeForArrowBorderColor",
    type: "color",
    initialValue: HIGHLIGHT_SETTINGS.highlightByNodeForArrowBorderColor ?? "#000000",
    label: "Цвет границы",
  },
  {
    id: "highlightByNodeForArrowBorderSizingAdditional",
    initialValue: HIGHLIGHT_SETTINGS.highlightByNodeForArrowBorderSizingAdditional,
    max: 10,
    min: 0.01,
    step: 0.01,
    type: "range",
    label: "Изменение размера границы",
  },
];

export const HIGHLIGHT_BY_LINK_FOR_NODE_CONTROLS: GraphSettingsInputInterface<
  keyof HighlightByLinkForNodeSettingsInterface
>[] = [
  {
    id: "highlightByLinkForNodeColorFading",
    type: "checkbox",
    initialValue: HIGHLIGHT_SETTINGS.highlightByLinkForNodeColorFading,
    label: "Прозрачность без альфа канала",
  },
  {
    id: "highlightByLinkForNodeColor",
    type: "color",
    initialValue: HIGHLIGHT_SETTINGS.highlightByLinkForNodeColor ?? "#000000",
    label: "Цвет",
  },
  {
    id: "highlightByLinkForNodeFadingMin",
    initialValue: HIGHLIGHT_SETTINGS.highlightByLinkForNodeFadingMin,
    max: 1,
    min: 0,
    step: 0.01,
    type: "range",
    label: "Граница прозрачности",
  },
  {
    id: "highlightByLinkForNodeSizingAdditional",
    initialValue: HIGHLIGHT_SETTINGS.highlightByLinkForNodeSizingAdditional,
    max: 10,
    min: -10,
    step: 0.01,
    type: "range",
    label: "Изменение радиуса (только для круга)",
  },
  {
    id: "highlightByLinkForNodeSizingAdditionalCoefficient",
    initialValue: HIGHLIGHT_SETTINGS.highlightByLinkForNodeSizingAdditionalCoefficient,
    max: 10,
    min: 0.01,
    step: 0.01,
    type: "range",
    label: "Коэффициент изменения размера (только не для круга)",
  },
  {
    id: "highlightByLinkForNodeBorderColor",
    type: "color",
    initialValue: HIGHLIGHT_SETTINGS.highlightByLinkForNodeBorderColor ?? "#000000",
    label: "Цвет границы",
  },
  {
    id: "highlightByLinkForNodeBorderSizingAdditional",
    initialValue: HIGHLIGHT_SETTINGS.highlightByLinkForNodeBorderSizingAdditional,
    max: 10,
    min: 0.01,
    step: 0.01,
    type: "range",
    label: "Изменение размера границы",
  },
];

export const HIGHLIGHT_BY_LINK_FOR_TEXT_CONTROLS: GraphSettingsInputInterface<
  keyof HighlightByLinkForTextSettingsInterface
>[] = [
  {
    id: "highlightByLinkForTextFadingMin",
    initialValue: HIGHLIGHT_SETTINGS.highlightByLinkForTextFadingMin,
    max: 1,
    min: 0,
    step: 0.01,
    type: "range",
    label: "Граница прозрачности",
  },
  {
    id: "highlightByLinkForTextSizingAdditional",
    initialValue: HIGHLIGHT_SETTINGS.highlightByLinkForTextSizingAdditional,
    max: 10,
    min: -10,
    step: 0.1,
    type: "range",
    label: "Изменение размера",
  },
  {
    id: "highlightByLinkForTextWeightAdditional",
    initialValue: HIGHLIGHT_SETTINGS.highlightByLinkForTextWeightAdditional,
    max: 1000,
    min: -1000,
    step: 100,
    type: "range",
    label: "Изменение жирности",
  },
  {
    id: "highlightByLinkForTextShiftXAdditional",
    initialValue: HIGHLIGHT_SETTINGS.highlightByLinkForTextShiftXAdditional,
    max: 50,
    min: -50,
    step: 0.1,
    type: "range",
    label: "Смещение по оси X",
  },
  {
    id: "highlightByLinkForTextShiftYAdditional",
    initialValue: HIGHLIGHT_SETTINGS.highlightByLinkForTextShiftYAdditional,
    max: 50,
    min: -50,
    step: 0.1,
    type: "range",
    label: "Смещение по оси Y",
  },
];

export const HIGHLIGHT_BY_LINK_FOR_LABEL_CONTROLS: GraphSettingsInputInterface<
  keyof HighlightByLinkForLabelSettingsInterface
>[] = [
  {
    id: "highlightByLinkForLabelFadingMin",
    initialValue: HIGHLIGHT_SETTINGS.highlightByLinkForLabelFadingMin,
    max: 1,
    min: 0,
    step: 0.01,
    type: "range",
    label: "Граница прозрачности",
  },
  {
    id: "highlightByLinkForLabelSizingAdditional",
    initialValue: HIGHLIGHT_SETTINGS.highlightByLinkForLabelSizingAdditional,
    max: 10,
    min: -10,
    step: 0.1,
    type: "range",
    label: "Изменение размера",
  },
  {
    id: "highlightByLinkForLabelWeightAdditional",
    initialValue: HIGHLIGHT_SETTINGS.highlightByLinkForLabelWeightAdditional,
    max: 1000,
    min: -1000,
    step: 100,
    type: "range",
    label: "Изменение жирности",
  },
];

export const HIGHLIGHT_BY_LINK_FOR_LINK_CONTROLS: GraphSettingsInputInterface<
  keyof HighlightByLinkForLinkSettingsInterface
>[] = [
  {
    id: "highlightByLinkForLinkColor",
    type: "color",
    initialValue: HIGHLIGHT_SETTINGS.highlightByLinkForLinkColor ?? "#000000",
    label: "Цвет",
  },
  {
    id: "highlightByLinkForLinkFadingMin",
    initialValue: HIGHLIGHT_SETTINGS.highlightByLinkForLinkFadingMin,
    max: 1,
    min: 0,
    step: 0.01,
    type: "range",
    label: "Граница прозрачности",
  },
  {
    id: "highlightByLinkForLinkSizeAdditional",
    initialValue: HIGHLIGHT_SETTINGS.highlightByLinkForLinkSizeAdditional,
    max: 10,
    min: -10,
    step: 0.1,
    type: "range",
    label: "Изменение размера",
  },
];

export const HIGHLIGHT_BY_LINK_FOR_ARROW_CONTROLS: GraphSettingsInputInterface<
  keyof HighlightByLinkForArrowSettingsInterface
>[] = [
  {
    id: "highlightByLinkForArrowColor",
    type: "color",
    initialValue: HIGHLIGHT_SETTINGS.highlightByLinkForArrowColor ?? "#000000",
    label: "Цвет",
  },
  {
    id: "highlightByLinkForArrowFadingMin",
    initialValue: HIGHLIGHT_SETTINGS.highlightByLinkForArrowFadingMin,
    max: 1,
    min: 0,
    step: 0.01,
    type: "range",
    label: "Граница прозрачности",
  },
  {
    id: "highlightByLinkForArrowSizeAdditional",
    initialValue: HIGHLIGHT_SETTINGS.highlightByLinkForArrowSizeAdditional,
    max: 10,
    min: -10,
    step: 0.1,
    type: "range",
    label: "Изменение размера",
  },
  {
    id: "highlightByLinkForArrowBorderColor",
    type: "color",
    initialValue: HIGHLIGHT_SETTINGS.highlightByLinkForArrowBorderColor ?? "#000000",
    label: "Цвет границы",
  },
  {
    id: "highlightByLinkForArrowBorderSizingAdditional",
    initialValue: HIGHLIGHT_SETTINGS.highlightByLinkForArrowBorderSizingAdditional,
    max: 10,
    min: 0.01,
    step: 0.01,
    type: "range",
    label: "Изменение размера границы",
  },
];
