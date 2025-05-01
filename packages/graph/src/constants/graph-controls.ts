import type { GraphSettingsInterface } from "@/module/GraphCanvas";
import { GRAPH_SETTINGS } from "@/module/GraphCanvas/constants";
import type { GraphSettingsInputInterface } from "@/types";

export const GRAPH_CONTROLS: GraphSettingsInputInterface<
  keyof GraphSettingsInterface<Record<string, unknown>>
>[] = [
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
