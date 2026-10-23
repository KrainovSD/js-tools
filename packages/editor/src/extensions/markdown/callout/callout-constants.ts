export type CalloutType =
  | "note"
  | "abstract"
  | "info"
  | "todo"
  | "tip"
  | "success"
  | "question"
  | "warning"
  | "failure"
  | "error"
  | "bug"
  | "example"
  | "quote";

export type CalloutMeta = {
  accent: string;
  icon: string;
};

export const CALLOUT_ALIASES: Record<string, CalloutType> = {
  summary: "abstract",
  tldr: "abstract",
  hint: "tip",
  important: "tip",
  check: "success",
  done: "success",
  help: "question",
  faq: "question",
  warn: "warning",
  caution: "warning",
  attention: "warning",
  fail: "failure",
  missing: "failure",
  danger: "error",
  cite: "quote",
};

const icon = (paths: string) =>
  `<svg viewBox="0 0 24 24" width="1em" height="1em" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths}</svg>`;

export const CALLOUT_TYPES: Record<CalloutType, CalloutMeta> = {
  note: {
    accent: "#086ddd",
    icon: icon('<path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/>'),
  },
  abstract: {
    accent: "#00bfbc",
    icon: icon(
      '<rect width="8" height="4" x="8" y="2" rx="1" ry="1"/><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><path d="M12 11h4"/><path d="M12 16h4"/><path d="M8 11h.01"/><path d="M8 16h.01"/>',
    ),
  },
  info: {
    accent: "#086ddd",
    icon: icon('<circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/>'),
  },
  todo: {
    accent: "#086ddd",
    icon: icon('<circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/>'),
  },
  tip: {
    accent: "#00bfbc",
    icon: icon(
      '<path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/>',
    ),
  },
  success: {
    accent: "#08b94e",
    icon: icon('<path d="M20 6 9 17l-5-5"/>'),
  },
  question: {
    accent: "#ec7500",
    icon: icon(
      '<circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><path d="M12 17h.01"/>',
    ),
  },
  warning: {
    accent: "#ec7500",
    icon: icon(
      '<path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><path d="M12 9v4"/><path d="M12 17h.01"/>',
    ),
  },
  failure: {
    accent: "#e93147",
    icon: icon('<path d="M18 6 6 18"/><path d="m6 6 12 12"/>'),
  },
  error: {
    accent: "#e93147",
    icon: icon('<polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>'),
  },
  bug: {
    accent: "#e93147",
    icon: icon(
      '<path d="m8 2 1.88 1.88"/><path d="M14.12 3.88 16 2"/><path d="M9 7.13v-1a3.003 3.003 0 1 1 6 0v1"/><path d="M12 20c-3.3 0-6-2.7-6-6v-3a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v3c0 3.3-2.7 6-6 6"/><path d="M12 20v-9"/><path d="M6.53 9C4.6 8.8 3 7.1 3 5"/><path d="M6 13H2"/><path d="M3 21c0-2.1 1.7-3.9 3.8-4"/><path d="M20.97 5c0 2.1-1.6 3.8-3.5 4"/><path d="M22 13h-4"/><path d="M17.2 17c2.1.1 3.8 1.9 3.8 4"/>',
    ),
  },
  example: {
    accent: "#7852ee",
    icon: icon(
      '<path d="M8 6h13"/><path d="M8 12h13"/><path d="M8 18h13"/><path d="M3 6h.01"/><path d="M3 12h.01"/><path d="M3 18h.01"/>',
    ),
  },
  quote: {
    accent: "#9e9e9e",
    icon: icon(
      '<path d="M16 3a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2 1 1 0 0 1 1 1v1a2 2 0 0 1-2 2 1 1 0 0 0-1 1v2a1 1 0 0 0 1 1 6 6 0 0 0 6-6V5a2 2 0 0 0-2-2z"/><path d="M5 3a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2 1 1 0 0 1 1 1v1a2 2 0 0 1-2 2 1 1 0 0 0-1 1v2a1 1 0 0 0 1 1 6 6 0 0 0 6-6V5a2 2 0 0 0-2-2z"/>',
    ),
  },
};

export function getCalloutType(rawType: string): CalloutType {
  const lower = rawType.toLowerCase();
  if (lower in CALLOUT_TYPES) return lower as CalloutType;
  return CALLOUT_ALIASES[lower] ?? "note";
}

export function getCalloutDefaultTitle(rawType: string): string {
  const lower = rawType.toLowerCase();
  return lower.charAt(0).toUpperCase() + lower.slice(1);
}
