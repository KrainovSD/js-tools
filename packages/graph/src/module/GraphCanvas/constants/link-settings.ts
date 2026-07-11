import type { LinkOptionsInterface, LinkSettingsInterface } from "../types/link-settings";

export const LINK_SETTINGS: Omit<
  Required<LinkSettingsInterface<Record<string, unknown>, Record<string, unknown>>>,
  "options"
> = {
  smartCache: true,
  prettyDraw: true,
  curve: true,
  linkScaleSwitch: 1,
  linkColorAfterScaleSwitch: "#C5C5C5FF",
  linkColorBeforeScaleSwitch: "#999",
  linkWidthAfterScaleSwitch: 0.1,
  linkWidthBeforeScaleSwitch: 1,
  arrow: true,
  arrowByHighlight: true,
  particles: true,
  // spawn one more particle for N px
  particleCountByDistance: 25,
  // speed for 1px
  particleSpeedByDistance: 50,
};

export const LINK_OPTIONS: Omit<
  Required<LinkOptionsInterface<Record<string, unknown>, Record<string, unknown>>>,
  "color" | "width" | "drawLink" | "drawExtraLink" | "arrowColor"
> = {
  alpha: 1,
  arrowAlpha: 1,
  arrowSize: 2,
  arrowBorderColor: "#C5C5C5FF",
  arrowBorderWidth: 0.1,
  particleAlpha: 1,
  particleColor: "#C5C5C5FF",
  particleBorderColor: "#C5C5C5FF",
  particleBorderWidth: 0.1,
  particleRadius: 0.5,
};
