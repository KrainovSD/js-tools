import { greatest } from "d3-array";
import type { ZoomTransform } from "d3-zoom";
import type { NodeInterface } from "@/types";
import type { NodeSettingsInterface } from "../../types";
import { nodeRadiusGetter } from "../settings";
import { isOverlapsNode } from "./is-overlaps-node";
import { pointerGetter } from "./pointer-getter";

export type NodeByPointerGetterOptions<
  NodeData extends Record<string, unknown>,
  LinkData extends Record<string, unknown>,
> = {
  mouseEvent: MouseEvent | TouchEvent;
  areaRect: DOMRect | undefined;
  areaTransform: ZoomTransform;
  nodes: NodeInterface<NodeData>[];
  nodeSettings: Required<Omit<NodeSettingsInterface<NodeData, LinkData>, "options">> &
    Pick<NodeSettingsInterface<NodeData, LinkData>, "options">;
};

export function nodeByPointerGetter<
  NodeData extends Record<string, unknown>,
  LinkData extends Record<string, unknown>,
>({
  areaRect,
  areaTransform,
  mouseEvent,
  nodes,
  nodeSettings,
}: NodeByPointerGetterOptions<NodeData, LinkData>): NodeInterface<NodeData> | undefined {
  if (!areaRect) return undefined;

  const [pointerX, pointerY] = pointerGetter(mouseEvent, areaRect, areaTransform);

  return greatest(nodes, (node) => {
    const radius =
      node._radius ??
      nodeRadiusGetter({
        radiusFlexible: nodeSettings.nodeRadiusFlexible,
        radiusInitial: nodeSettings.nodeRadiusInitial,
        radiusCoefficient: nodeSettings.nodeRadiusCoefficient,
        radiusFactor: nodeSettings.nodeRadiusFactor,
        linkCount: node.linkCount,
      });

    if (isOverlapsNode(node, radius, pointerX, pointerY)) return node.index;
  });
}
