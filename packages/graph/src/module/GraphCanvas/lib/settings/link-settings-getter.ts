import type { ZoomTransform } from "d3-zoom";
import type { LinkInterface } from "@/types";
import { COMMON_SETTINGS, LINK_SETTINGS } from "../../constants";
import type { LinkOptionsInterface, LinkSettingsInterface } from "../../types";

export function linkSettingsGetter<
  NodeData extends Record<string, unknown>,
  LinkData extends Record<string, unknown>,
>(
  settings: LinkSettingsInterface<NodeData, LinkData> | undefined,
): Required<Omit<LinkSettingsInterface<NodeData, LinkData>, "options">> &
  Pick<LinkSettingsInterface<NodeData, LinkData>, "options"> {
  return { options: settings?.options };
}

export function linkOptionsGetter<
  NodeData extends Record<string, unknown>,
  LinkData extends Record<string, unknown>,
>(
  _: LinkInterface<NodeData, LinkData>,
  __: number,
  ___: LinkInterface<NodeData, LinkData>[],
  transform?: ZoomTransform | null,
): Required<LinkOptionsInterface> {
  return {
    ...LINK_SETTINGS,
    color:
      transform && transform.k > COMMON_SETTINGS.linkColorZoomBorder
        ? COMMON_SETTINGS.linkColorZoomNear
        : COMMON_SETTINGS.linkColorZoomFar,
    width:
      transform && transform.k > COMMON_SETTINGS.linkWidthZoomBorder
        ? COMMON_SETTINGS.linkWidthZoomNear
        : COMMON_SETTINGS.linkWidthZoomFar,
  };
}
