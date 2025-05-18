import type { ThemeName, ThemeVariableConfig } from "../types";

export const THEME_COLORS: Record<ThemeName, ThemeVariableConfig> = {
  light: {
    common: {
      transition: {
        "ksd-transition-fast": "0.1s",
        "ksd-transition-mid": "0.2s",
        "ksd-transition-slow": "0.3s",
      },
      controlHeight: {
        "ksd-control-height-sm": "24px",
        "ksd-control-height": "32px",
        "ksd-control-height-lg": "40px",
      },

      shadow: {
        "ksd-shadow":
          "0 6px 16px 0 rgba(0, 0, 0, 0.08), 0 3px 6px -4px rgba(0, 0, 0, 0.12), 0 9px 28px 8px rgba(0, 0, 0, 0.05)",
        "ksd-shadow-secondary":
          "0 6px 16px 0 rgba(0, 0, 0, 0.08), 0 3px 6px -4px rgba(0, 0, 0, 0.12), 0 9px 28px 8px rgba(0, 0, 0, 0.05)",
        "ksd-shadow-tertiary":
          "0 1px 2px 0 rgba(0, 0, 0, 0.03), 0 1px 6px -1px rgba(0, 0, 0, 0.02), 0 2px 4px 0 rgba(0, 0, 0, 0.02)",
        "ksd-shadow-accent":
          "0 6px 16px 0 rgba(0, 0, 0, 0.08), 0 3px 6px -4px rgba(0, 0, 0, 0.12), 0 9px 28px 8px rgba(0, 0, 0, 0.05)",
        "ksd-shadow-bottom":
          "0 -6px 16px 0 rgba(0, 0, 0, 0.08), 0 -3px 6px -4px rgba(0, 0, 0, 0.12), 0 -9px 28px 8px rgba(0, 0, 0, 0.05)",
        "ksd-shadow-left":
          "6px 0 16px 0 rgba(0, 0, 0, 0.08), 3px 0 6px -4px rgba(0, 0, 0, 0.12), 9px 0 28px 8px rgba(0, 0, 0, 0.05)",
        "ksd-shadow-right":
          "-6px 0 16px 0 rgba(0, 0, 0, 0.08), -3px 0 6px -4px rgba(0, 0, 0, 0.12), -9px 0 28px 8px rgba(0, 0, 0, 0.05)",
        "ksd-shadow-top":
          "0 6px 16px 0 rgba(0, 0, 0, 0.08), 0 3px 6px -4px rgba(0, 0, 0, 0.12), 0 9px 28px 8px rgba(0, 0, 0, 0.05)",
      },
      border: {
        "ksd-border-radius-xs": "2px",
        "ksd-border-radius-sm": "4px",
        "ksd-border-radius": "6px",
        "ksd-border-radius-lg": "8px",
        "ksd-border-radius-outer": "4px",
      },
      padding: {
        "ksd-padding-xxs": "4px",
        "ksd-padding-xs": "8px",
        "ksd-padding-sm": "12px",
        "ksd-padding": "16px",
        "ksd-padding-md": "20px",
        "ksd-padding-lg": "24px",
        "ksd-padding-xl": "32px",
      },
      font: {
        "ksd-font-family": "Nunito",
        "ksd-font-weight": "400",
        "ksd-line-height": "1.5",
        "ksd-font-size-sm": "0.857rem",
        "ksd-font-size-lg": "1.143rem",
        "ksd-font-size-xl": "1.429rem",
      },
      colors: {
        "ksd-bg-color": "#edeef0",
        "ksd-bg-sidebar-color": "",
        "ksd-bg-header-color": "",
        "ksd-bg-modal-color": "#ffffff",
        "ksd-text-bg-disabled-color": "rgba(0, 0, 0, 0.04)",
        "ksd-text-bg-hover-color": "rgba(0, 0, 0, 0.06)",
        "ksd-text-bg-active-color": "rgba(0, 0, 0, 0.15)",
        "ksd-text-main-color": "#262626",
        "ksd-text-main-disabled-color": "rgba(0, 0, 0, 0.25)",
        "ksd-text-main-hover-color": "",
        "ksd-text-secondary-color": "#8c8c8c",
        "ksd-text-secondary-disabled-color": "rga(140, 140, 140, 0.25)",
        "ksd-text-secondary-hover-color": "",
        "ksd-text-reverse-color": "#ffffff",
        "ksd-text-reverse-secondary-color": "",
        "ksd-text-accent-hover-color": "#4096ff",
        "ksd-text-accent-color": "#1677ff",
        "ksd-text-accent-active-color": "#0958d9",
        "ksd-border-accent-hover-color": "#4096ff",
        "ksd-border-accent-color": "#1677ff",
        "ksd-border-accent-active-color": "#0958d9",
        "ksd-border-color": "#d9d9d9",
        "ksd-border-hover-color": "",
        "ksd-accent-color": "#1677ff",
        "ksd-accent-hover-color": "#4096ff",
        "ksd-accent-active-color": "#0958d9",
        "ksd-error-color": "#ff4d4f",
        "ksd-error-active-color": "#d9363e",
        "ksd-error-hover-color": "#ff7875",
        "ksd-error-bg-color": "#fff2f0",
        "ksd-error-bg-active-color": "#ffccc7",
        "ksd-error-bg-hover-color": "#fff1f0",
      },
    },
    components: {
      collapse: {
        "ksd-collapse-header-bg": "rgba(0, 0, 0, 0.02)",
        "ksd-collapse-body-bg": "#ffffff",
      },
      button: {
        "ksd-button-bg": "#ffffff",
        "ksd-button-border": "#d9d9d9",
        "ksd-button-padding": "15px",
        "ksd-button-padding-lg": "15px",
        "ksd-button-padding-sm": "7px",
        "ksd-button-bg-disabled-color": "rgba(0, 0, 0, 0.04)",
        "ksd-button-border-disabled-color": "#d9d9d9",
        "ksd-button-text-disabled-color": "rgba(0, 0, 0, 0.25)",
      },
    },
  },
};
