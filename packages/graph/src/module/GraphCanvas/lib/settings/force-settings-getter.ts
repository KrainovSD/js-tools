import { FORCE_SETTINGS } from "../../constants";
import type { ForceSettingsInterface } from "../../types";

export function forceSettingsGetter<
  NodeData extends Record<string, unknown>,
  LinkData extends Record<string, unknown>,
>(
  settings: ForceSettingsInterface<NodeData, LinkData> | undefined,
  prevSettings?: Required<ForceSettingsInterface<NodeData, LinkData>>,
): Required<ForceSettingsInterface<NodeData, LinkData>> {
  return {
    ...(prevSettings ?? FORCE_SETTINGS),
    ...settings,
  };
}
