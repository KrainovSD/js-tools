import type { LinkInterface } from "@/types";
import type { LinkIterationProps } from "../GraphCanvas.types";

export function linkIterationExtractor<
  NodeData extends Record<string, unknown>,
  LinkData extends Record<string, unknown>,
  Result extends string | number | boolean | Record<string, unknown> | unknown[],
>(
  link: LinkInterface<NodeData, LinkData>,
  i: number,
  links: LinkInterface<NodeData, LinkData>[],
  option: LinkIterationProps<NodeData, LinkData, Result> | Result,
) {
  if (typeof option === "function") return option(link, i, links);

  return option;
}
