import { HIGHLIGHT_SETTINGS } from "../../constants";
import type { HighlightSettingsInterface } from "../../types";

export function highlightSettingsGetter(
  settings: HighlightSettingsInterface | undefined,
  prevSettings?: Required<HighlightSettingsInterface>,
): Required<HighlightSettingsInterface> {
  return {
    ...(prevSettings ?? HIGHLIGHT_SETTINGS),
    ...settings,
  };
}
