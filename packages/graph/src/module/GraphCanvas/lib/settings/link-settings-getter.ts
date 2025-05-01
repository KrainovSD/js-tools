import { COMMON_SETTINGS, LINK_OPTIONS, LINK_SETTINGS } from "../../constants";
import type {
  GraphState,
  LinkInterface,
  LinkOptionsInterface,
  LinkSettingsInterface,
} from "../../types";

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
>(
  _: LinkInterface<NodeData, LinkData>,
  __: number,
  ___: LinkInterface<NodeData, LinkData>[],
  state?: GraphState<NodeData, LinkData>,
): Required<LinkOptionsInterface<NodeData, LinkData>> {
  return {
    ...LINK_OPTIONS,
    drawExtraLink: null,
    drawLink: null,
    color:
      state?.areaTransform && state?.areaTransform.k > COMMON_SETTINGS.linkColorZoomBorder
        ? COMMON_SETTINGS.linkColorZoomNear
        : COMMON_SETTINGS.linkColorZoomFar,
    arrowColor:
      state?.areaTransform && state?.areaTransform.k > COMMON_SETTINGS.linkColorZoomBorder
        ? COMMON_SETTINGS.linkColorZoomNear
        : COMMON_SETTINGS.linkColorZoomFar,
    width:
      state?.areaTransform && state?.areaTransform.k > COMMON_SETTINGS.linkWidthZoomBorder
        ? COMMON_SETTINGS.linkWidthZoomNear
        : COMMON_SETTINGS.linkWidthZoomFar,
  };
}
