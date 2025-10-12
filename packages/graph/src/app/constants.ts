import {
  FORCE_CONTROLS,
  HIGHLIGHT_BY_LINK_FOR_ARROW_CONTROLS,
  HIGHLIGHT_BY_LINK_FOR_LABEL_CONTROLS,
  HIGHLIGHT_BY_LINK_FOR_LINK_CONTROLS,
  HIGHLIGHT_BY_LINK_FOR_NODE_CONTROLS,
  HIGHLIGHT_BY_LINK_FOR_TEXT_CONTROLS,
  HIGHLIGHT_BY_NODE_FOR_ARROW_CONTROLS,
  HIGHLIGHT_BY_NODE_FOR_LABEL_CONTROLS,
  HIGHLIGHT_BY_NODE_FOR_LINK_CONTROLS,
  HIGHLIGHT_BY_NODE_FOR_NODE_CONTROLS,
  HIGHLIGHT_BY_NODE_FOR_TEXT_CONTROLS,
  LINK_OPTIONS_ARROW_CONTROLS,
  LINK_OPTIONS_LINK_CONTROLS,
  LINK_OPTIONS_PARTICLE_CONTROLS,
  LINK_SETTINGS_CONTROLS,
  NODE_OPTIONS_LABEL_CONTROLS,
  NODE_OPTIONS_NODE_CONTROLS,
  NODE_OPTIONS_TEXT_CONTROLS,
  NODE_SETTINGS_CONTROLS,
} from "../constants";
import {
  FORCE_SETTINGS,
  GRAPH_SETTINGS,
  HIGHLIGHT_SETTINGS,
  LINK_OPTIONS,
  LINK_SETTINGS,
  NODE_OPTIONS,
  NODE_SETTINGS,
} from "../module/GraphCanvas";
import type { GraphSettings, SettingsTemplateInterface } from "./types";

export const DEFAULT_SETTINGS: GraphSettings = {
  forceSettings: {
    ...FORCE_SETTINGS,
  },
  graphSettings: {
    ...GRAPH_SETTINGS,
    zoomExtent: [0.1, 10],
    translateExtentCoefficient: [10, 10],
  },
  linkOptions: {
    ...LINK_OPTIONS,
    color: "#C5C5C5FF",
    arrowColor: "#C5C5C5FF",
    particleColor: "#C5C5C5FF",
    arrowBorderColor: "#C5C5C5FF",
    particleBorderColor: "#C5C5C5FF",
  },
  linkSettings: { ...LINK_SETTINGS },
  nodeOptions: { ...NODE_OPTIONS, textColor: "#d2d2d2" },
  nodeSettings: { ...NODE_SETTINGS },
  highlightSettings: { ...HIGHLIGHT_SETTINGS },
};
export const HIGHLIGHT_COLOR = "#ce7a1c";
export const TEXT_DARK_COLOR = "#d2d2d2";
export const TEXT_LIGHT_COLOR = "#21252D";
export const LINK_DARK_COLOR = "#C5C5C5FF";
export const LINK_LIGHT_COLOR = "#BBBBBB";
export const NODE_DARK_COLOR = "#21252D";
export const NODE_LIGHT_COLOR = "#21252D";

export const TEMPLATES: SettingsTemplateInterface[] = [
  {
    id: "physic",
    label: "Параметры физики",
    open: true,
    inputs: FORCE_CONTROLS,
    name: "forceSettings",
    diffInfo: [{ name: "forceSettings", keys: FORCE_CONTROLS.map((control) => control.id) }],
  },

  {
    id: "node",
    label: "Параметры вершин",
    open: false,
    diffInfo: [
      { name: "nodeSettings", keys: NODE_SETTINGS_CONTROLS.map((control) => control.id) },
      {
        name: "nodeOptions",
        keys: [NODE_OPTIONS_NODE_CONTROLS, NODE_OPTIONS_TEXT_CONTROLS, NODE_OPTIONS_LABEL_CONTROLS]
          .flat()
          .map((control) => control.id),
      },
    ],
    children: [
      {
        id: "common",
        label: "Общие параметры вершин",
        open: true,
        inputs: NODE_SETTINGS_CONTROLS,
        name: "nodeSettings",
        diffInfo: [
          { name: "nodeSettings", keys: NODE_SETTINGS_CONTROLS.map((control) => control.id) },
        ],
      },
      {
        id: "node",
        label: "Параметры вершин",
        open: true,
        inputs: NODE_OPTIONS_NODE_CONTROLS,
        name: "nodeOptions",
        diffInfo: [
          { name: "nodeOptions", keys: NODE_OPTIONS_NODE_CONTROLS.map((control) => control.id) },
        ],
      },
      {
        id: "text",
        label: "Параметры текстов",
        open: true,
        inputs: NODE_OPTIONS_TEXT_CONTROLS,
        name: "nodeOptions",
        diffInfo: [
          { name: "nodeOptions", keys: NODE_OPTIONS_TEXT_CONTROLS.map((control) => control.id) },
        ],
      },
      {
        id: "label",
        label: "Параметры подписей",
        open: true,
        inputs: NODE_OPTIONS_LABEL_CONTROLS,
        name: "nodeOptions",
        diffInfo: [
          { name: "nodeOptions", keys: NODE_OPTIONS_LABEL_CONTROLS.map((control) => control.id) },
        ],
      },
    ],
  },
  {
    id: "link",
    label: "Параметры связей",
    open: false,
    diffInfo: [
      { name: "linkSettings", keys: LINK_SETTINGS_CONTROLS.map((control) => control.id) },
      {
        name: "linkOptions",
        keys: [
          LINK_OPTIONS_PARTICLE_CONTROLS,
          LINK_OPTIONS_ARROW_CONTROLS,
          LINK_OPTIONS_LINK_CONTROLS,
        ]
          .flat()
          .map((control) => control.id),
      },
    ],
    children: [
      {
        id: "common",
        label: "Общие параметры связей",
        open: false,
        inputs: LINK_SETTINGS_CONTROLS,
        name: "linkSettings",
        diffInfo: [
          { name: "linkSettings", keys: LINK_SETTINGS_CONTROLS.map((control) => control.id) },
        ],
      },
      {
        id: "link",
        label: "Параметры связей",
        open: false,
        inputs: LINK_OPTIONS_LINK_CONTROLS,
        name: "linkOptions",
        diffInfo: [
          { name: "linkOptions", keys: LINK_OPTIONS_LINK_CONTROLS.map((control) => control.id) },
        ],
      },
      {
        id: "arrow",
        label: "Параметры стрелок",
        open: false,
        inputs: LINK_OPTIONS_ARROW_CONTROLS,
        name: "linkOptions",
        diffInfo: [
          { name: "linkOptions", keys: LINK_OPTIONS_ARROW_CONTROLS.map((control) => control.id) },
        ],
      },
      {
        id: "particle",
        label: "Параметры частиц",
        open: false,
        inputs: LINK_OPTIONS_PARTICLE_CONTROLS,
        name: "linkOptions",
        diffInfo: [
          {
            name: "linkOptions",
            keys: LINK_OPTIONS_PARTICLE_CONTROLS.map((control) => control.id),
          },
        ],
      },
    ],
  },
  {
    id: "animation",
    label: "Параметры анимаций",
    open: false,
    diffInfo: [
      {
        name: "highlightSettings",
        keys: [
          HIGHLIGHT_BY_NODE_FOR_NODE_CONTROLS,
          HIGHLIGHT_BY_NODE_FOR_TEXT_CONTROLS,
          HIGHLIGHT_BY_NODE_FOR_LABEL_CONTROLS,
          HIGHLIGHT_BY_NODE_FOR_LINK_CONTROLS,
          HIGHLIGHT_BY_NODE_FOR_ARROW_CONTROLS,
          HIGHLIGHT_BY_LINK_FOR_NODE_CONTROLS,
          HIGHLIGHT_BY_LINK_FOR_TEXT_CONTROLS,
          HIGHLIGHT_BY_LINK_FOR_LABEL_CONTROLS,
          HIGHLIGHT_BY_LINK_FOR_LINK_CONTROLS,
          HIGHLIGHT_BY_LINK_FOR_ARROW_CONTROLS,
        ]
          .flat()
          .map((control) => control.id),
      },
    ],
    children: [
      {
        id: "node",
        label: "Анимация вершины",
        open: false,
        diffInfo: [
          {
            name: "highlightSettings",
            keys: [
              HIGHLIGHT_BY_NODE_FOR_NODE_CONTROLS,
              HIGHLIGHT_BY_NODE_FOR_TEXT_CONTROLS,
              HIGHLIGHT_BY_NODE_FOR_LABEL_CONTROLS,
              HIGHLIGHT_BY_NODE_FOR_LINK_CONTROLS,
              HIGHLIGHT_BY_NODE_FOR_ARROW_CONTROLS,
            ]
              .flat()
              .map((control) => control.id),
          },
        ],
        children: [
          {
            id: "node",
            label: "Вершины",
            open: false,
            name: "highlightSettings",
            inputs: HIGHLIGHT_BY_NODE_FOR_NODE_CONTROLS,
            diffInfo: [
              { name: "forceSettings", keys: FORCE_CONTROLS.map((control) => control.id) },
            ],
          },
          {
            id: "text",
            label: "Текста",
            open: false,
            name: "highlightSettings",
            inputs: HIGHLIGHT_BY_NODE_FOR_TEXT_CONTROLS,
            diffInfo: [
              { name: "forceSettings", keys: FORCE_CONTROLS.map((control) => control.id) },
            ],
          },
          {
            id: "label",
            label: "Подписи",
            open: false,
            name: "highlightSettings",
            inputs: HIGHLIGHT_BY_NODE_FOR_LABEL_CONTROLS,
            diffInfo: [
              { name: "forceSettings", keys: FORCE_CONTROLS.map((control) => control.id) },
            ],
          },
          {
            id: "link",
            label: "Связи",
            open: false,
            name: "highlightSettings",
            inputs: HIGHLIGHT_BY_NODE_FOR_LINK_CONTROLS,
            diffInfo: [
              { name: "forceSettings", keys: FORCE_CONTROLS.map((control) => control.id) },
            ],
          },
          {
            id: "arrow",
            label: "Стрелки",
            open: false,
            name: "highlightSettings",
            inputs: HIGHLIGHT_BY_NODE_FOR_ARROW_CONTROLS,
            diffInfo: [
              { name: "forceSettings", keys: FORCE_CONTROLS.map((control) => control.id) },
            ],
          },
        ],
      },
      {
        id: "link",
        label: "Анимация вершины",
        open: false,
        diffInfo: [
          {
            name: "highlightSettings",
            keys: [
              HIGHLIGHT_BY_LINK_FOR_NODE_CONTROLS,
              HIGHLIGHT_BY_LINK_FOR_TEXT_CONTROLS,
              HIGHLIGHT_BY_LINK_FOR_LABEL_CONTROLS,
              HIGHLIGHT_BY_LINK_FOR_LINK_CONTROLS,
              HIGHLIGHT_BY_LINK_FOR_ARROW_CONTROLS,
            ]
              .flat()
              .map((control) => control.id),
          },
        ],
        children: [
          {
            id: "node",
            label: "Вершины",
            open: false,
            name: "highlightSettings",
            inputs: HIGHLIGHT_BY_LINK_FOR_NODE_CONTROLS,
            diffInfo: [
              {
                name: "highlightSettings",
                keys: HIGHLIGHT_BY_LINK_FOR_NODE_CONTROLS.map((control) => control.id),
              },
            ],
          },
          {
            id: "text",
            label: "Текста",
            open: false,
            name: "highlightSettings",
            inputs: HIGHLIGHT_BY_LINK_FOR_TEXT_CONTROLS,
            diffInfo: [
              {
                name: "highlightSettings",
                keys: HIGHLIGHT_BY_LINK_FOR_TEXT_CONTROLS.map((control) => control.id),
              },
            ],
          },
          {
            id: "label",
            label: "Подписи",
            open: false,
            name: "highlightSettings",
            inputs: HIGHLIGHT_BY_LINK_FOR_LABEL_CONTROLS,
            diffInfo: [
              {
                name: "highlightSettings",
                keys: HIGHLIGHT_BY_LINK_FOR_LABEL_CONTROLS.map((control) => control.id),
              },
            ],
          },
          {
            id: "link",
            label: "Связи",
            open: false,
            name: "highlightSettings",
            inputs: HIGHLIGHT_BY_LINK_FOR_LINK_CONTROLS,
            diffInfo: [
              {
                name: "highlightSettings",
                keys: HIGHLIGHT_BY_LINK_FOR_LINK_CONTROLS.map((control) => control.id),
              },
            ],
          },
          {
            id: "arrow",
            label: "Стрелки",
            open: false,
            name: "highlightSettings",
            inputs: HIGHLIGHT_BY_LINK_FOR_ARROW_CONTROLS,
            diffInfo: [
              {
                name: "highlightSettings",
                keys: HIGHLIGHT_BY_LINK_FOR_ARROW_CONTROLS.map((control) => control.id),
              },
            ],
          },
        ],
      },
    ],
  },
];
export const OPENED_SETTINGS_COLLAPSE_STORAGE_KEY = "collapse_storage";
