import type { ZoomTransform } from "d3-zoom";
import type { NodeInterface } from "@/types";
import type { GraphCanvasNodeIterationProps, GraphCanvasNodeOptions } from "../../types";
import { pointerGetter } from "../pointer-getter";
import { isOverlapsNode } from "./is-overlaps-node";
import { nodeIterationExtractor } from "./node-iteration-extractor";
import { nodeOptionsGetter } from "./node-options-getter";
import { nodeRadiusGetter } from "./node-radius-getter";

export type NodeByPointerGetterOptions<NodeData extends Record<string, unknown>> = {
  mouseEvent: MouseEvent;
  areaRect: DOMRect | undefined;
  areaTransform: ZoomTransform;
  nodes: NodeInterface<NodeData>[];
  nodeCustomOptions:
    | GraphCanvasNodeIterationProps<NodeData, GraphCanvasNodeOptions>
    | GraphCanvasNodeOptions
    | undefined;
};

export function nodeByPointerGetter<NodeData extends Record<string, unknown>>({
  areaRect,
  areaTransform,
  mouseEvent,
  nodes,
  nodeCustomOptions,
}: NodeByPointerGetterOptions<NodeData>): NodeInterface<NodeData> | undefined {
  if (!areaRect) return undefined;

  const [pointerX, pointerY] = pointerGetter(mouseEvent, areaRect, areaTransform);

  return nodes.find((node, index) => {
    const nodeOptions = nodeIterationExtractor(
      node,
      index,
      nodes,
      areaTransform,
      nodeCustomOptions || {},
      nodeOptionsGetter,
    );

    const radius = nodeRadiusGetter({
      flexibleRadius: nodeOptions.flexibleRadius,
      initialRadius: nodeOptions.initialRadius,
      radiusCoefficient: nodeOptions.radiusCoefficient,
      radiusFactor: nodeOptions.radiusFactor,
      linkCount: node.linkCount,
    });

    return isOverlapsNode(node, radius, pointerX, pointerY);
  });
}
