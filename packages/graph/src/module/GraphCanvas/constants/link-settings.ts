import type { LinkOptionsInterface, LinkSettingsInterface } from "../types/link-settings";

export const LINK_SETTINGS: Omit<
  Required<LinkSettingsInterface<Record<string, unknown>, Record<string, unknown>>>,
  "options"
> = {
  prettyDraw: true,
  linkScaleSwitch: 1,
  linkColorAfterScaleSwitch: "#000000FF",
  linkColorBeforeScaleSwitch: "#999",
  linkWidthAfterScaleSwitch: 0.1,
  linkWidthBeforeScaleSwitch: 1,
  arrow: true,
  arrowByHighlight: true,
  particles: true,
  particleFlexSpeed: true,
  particleFlexSpeedCoefficient: 4,
};

export const LINK_OPTIONS: Omit<
  Required<LinkOptionsInterface<Record<string, unknown>, Record<string, unknown>>>,
  "color" | "width" | "drawLink" | "drawExtraLink" | "arrowColor"
> = {
  alpha: 1,
  arrowAlpha: 1,
  arrowSize: 2,
  arrowBorderColor: "#000000FF",
  arrowBorderWidth: 0.1,
  particleAlpha: 1,
  particleColor: "#000000FF",
  particleBorderColor: "#000000FF",
  particleBorderWidth: 0.1,
  particleCount: 2,
  particleRadius: 0.5,
  particleSteps: 60,
};
