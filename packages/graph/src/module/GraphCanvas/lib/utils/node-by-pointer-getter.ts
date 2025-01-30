import type { ZoomTransform } from "d3-zoom";
import type { NodeInterface } from "@/types";
import type { GraphSettingsInterface } from "../../types";
import { nodeRadiusGetter } from "../settings";
import { isOverlapsNode } from "./is-overlaps-node";
import { pointerGetter } from "./pointer-getter";

export type NodeByPointerGetterOptions<NodeData extends Record<string, unknown>> = {
  mouseEvent: MouseEvent;
  areaRect: DOMRect | undefined;
  areaTransform: ZoomTransform;
  nodes: NodeInterface<NodeData>[];

  graphSettings: Required<GraphSettingsInterface<NodeData>>;
};

export function nodeByPointerGetter<NodeData extends Record<string, unknown>>({
  areaRect,
  areaTransform,
  mouseEvent,
  nodes,
  graphSettings,
}: NodeByPointerGetterOptions<NodeData>): NodeInterface<NodeData> | undefined {
  if (!areaRect) return undefined;

  const [pointerX, pointerY] = pointerGetter(mouseEvent, areaRect, areaTransform);

  return nodes.find((node) => {
    const radius = nodeRadiusGetter({
      radiusFlexible: graphSettings.nodeRadiusFlexible,
      radiusInitial: graphSettings.nodeRadiusInitial,
      radiusCoefficient: graphSettings.nodeRadiusCoefficient,
      radiusFactor: graphSettings.nodeRadiusFactor,
      linkCount: node.linkCount,
    });

    return isOverlapsNode(node, radius, pointerX, pointerY);
  });
}
