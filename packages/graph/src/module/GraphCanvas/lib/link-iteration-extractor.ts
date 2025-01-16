import type { ZoomTransform } from "d3";
import { checkType } from "@/lib";
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
  optionConstantGetter: undefined,
): Result;

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
  optionConstantGetter:
    | GraphCanvasLinkIterationProps<NodeData, LinkData, Required<Result>>
    | Required<Result>,
): Required<Result>;

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
  optionConstantGetter:
    | GraphCanvasLinkIterationProps<NodeData, LinkData, Required<Result>>
    | Required<Result>
    | undefined,
): Result {
  let customOptions: Result | undefined;
  let constantOptions: Result | undefined;

  if (typeof option === "function") customOptions = option(link, i, links, transform);
  else customOptions = option;

  if (optionConstantGetter) {
    if (typeof optionConstantGetter === "function")
      constantOptions = optionConstantGetter(link, i, links, transform);
    else constantOptions = optionConstantGetter;

    if (
      constantOptions &&
      typeof constantOptions === "object" &&
      !Array.isArray(constantOptions) &&
      checkType<Record<string, unknown> | undefined>(
        customOptions,
        customOptions === undefined ||
          (typeof customOptions === "object" && !Array.isArray(constantOptions)),
      )
    ) {
      return {
        ...constantOptions,
        ...((customOptions as Record<string, unknown> | undefined) || {}),
      } as Result;
    }
  }

  return customOptions;
}
