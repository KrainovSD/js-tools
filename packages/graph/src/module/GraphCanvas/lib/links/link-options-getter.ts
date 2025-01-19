import type { ZoomTransform } from "d3-zoom";
import type { LinkInterface } from "@/types";
import { LINK_SETTINGS } from "../../constants";
import type { GraphCanvasLinkOptions } from "../../types";

export function linkOptionsGetter<
  NodeData extends Record<string, unknown>,
  LinkData extends Record<string, unknown>,
>(
  _: LinkInterface<NodeData, LinkData>,
  __: number,
  ___: LinkInterface<NodeData, LinkData>[],
  transform?: ZoomTransform | null,
): Required<GraphCanvasLinkOptions> {
  return {
    ...LINK_SETTINGS,
    color:
      transform && transform.k > LINK_SETTINGS.zoomColorBorder
        ? LINK_SETTINGS.colorNear
        : LINK_SETTINGS.colorFar,
    width:
      transform && transform.k > LINK_SETTINGS.zoomWidthBorder
        ? LINK_SETTINGS.widthNear
        : LINK_SETTINGS.widthFar,
  };
}
