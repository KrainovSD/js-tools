import type { GraphCanvas } from "../../GraphCanvas";
import { LINK_OPTIONS, LINK_SETTINGS } from "../../constants";
import type { LinkOptionsInterface, LinkSettingsInterface } from "../../types";

export function linkSettingsGetter<
  NodeData extends Record<string, unknown>,
  LinkData extends Record<string, unknown>,
>(
  settings: LinkSettingsInterface<NodeData, LinkData> | undefined,
  prevSettings?: Required<Omit<LinkSettingsInterface<NodeData, LinkData>, "options">> &
    Pick<LinkSettingsInterface<NodeData, LinkData>, "options">,
): Required<Omit<LinkSettingsInterface<NodeData, LinkData>, "options">> &
  Pick<LinkSettingsInterface<NodeData, LinkData>, "options"> {
  return { ...(prevSettings ?? LINK_SETTINGS), ...settings };
}

export function linkOptionsGetter<
  NodeData extends Record<string, unknown>,
  LinkData extends Record<string, unknown>,
>(this: GraphCanvas<NodeData, LinkData>): Required<LinkOptionsInterface<NodeData, LinkData>> {
  return {
    ...LINK_OPTIONS,
    drawExtraLink: null,
    drawLink: null,
    color:
      this.areaTransform && this.areaTransform.k > this.linkSettings.linkScaleSwitch
        ? this.linkSettings.linkColorAfterScaleSwitch
        : this.linkSettings.linkColorBeforeScaleSwitch,
    arrowColor:
      this.areaTransform && this.areaTransform.k > this.linkSettings.linkScaleSwitch
        ? this.linkSettings.linkColorAfterScaleSwitch
        : this.linkSettings.linkColorBeforeScaleSwitch,
    width:
      this.areaTransform && this.areaTransform.k > this.linkSettings.linkScaleSwitch
        ? this.linkSettings.linkWidthAfterScaleSwitch
        : this.linkSettings.linkWidthBeforeScaleSwitch,
  };
}
