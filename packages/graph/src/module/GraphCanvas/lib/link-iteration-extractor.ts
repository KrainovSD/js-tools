import type { ZoomTransform } from "d3";
import type { LinkInterface } from "@/types";
import type { GraphCanvasLinkIterationProps } from "../types";

export function linkIterationExtractor<
  NodeData extends Record<string, unknown>,
  LinkData extends Record<string, unknown>,
  Result extends string | number | boolean | Record<string, unknown> | unknown[],
>(
  link: LinkInterface<NodeData, LinkData>,
  i: number,
  links: LinkInterface<NodeData, LinkData>[],
  transform: ZoomTransform,
  option: GraphCanvasLinkIterationProps<NodeData, LinkData, Result> | Result,
): Result {
  if (typeof option === "function") return option(link, i, links, transform);

  return option;
}
