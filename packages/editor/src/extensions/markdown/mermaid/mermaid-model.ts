import type { MermaidConfig } from "mermaid";

export type MermaidModel = {
  from: number;
  to: number;
  source: string;
  replaceable: boolean;
  triggerFrom: number;
  triggerTo: number;
};

export type MermaidSettings = {
  config?: MermaidConfig;
  emptyLabel: string;
  errorLabel: string;
};

export const DEFAULT_MERMAID_SETTINGS: MermaidSettings = {
  emptyLabel: "Empty diagram",
  errorLabel: "Error parsing diagram",
};
