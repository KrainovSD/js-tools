import { checkType } from "@/lib";
import type { GraphState, LinkInterface, LinkIterationPropsInterface } from "../../types";

export function linkIterationExtractor<
  NodeData extends Record<string, unknown>,
  LinkData extends Record<string, unknown>,
  Result extends string | number | boolean | Record<string, unknown> | unknown[],
>(
  link: LinkInterface<NodeData, LinkData>,
  i: number,
  links: LinkInterface<NodeData, LinkData>[],
  state: GraphState<NodeData, LinkData>,
  option: LinkIterationPropsInterface<NodeData, LinkData, Result> | Result,
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
  state: GraphState<NodeData, LinkData>,
  option: LinkIterationPropsInterface<NodeData, LinkData, Result> | Result,
  optionConstantGetter:
    | LinkIterationPropsInterface<NodeData, LinkData, Required<Result>>
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
  state: GraphState<NodeData, LinkData>,
  option: LinkIterationPropsInterface<NodeData, LinkData, Result> | Result,
  optionConstantGetter:
    | LinkIterationPropsInterface<NodeData, LinkData, Required<Result>>
    | Required<Result>
    | undefined,
): Result {
  let customOptions: Result | undefined;
  let constantOptions: Result | undefined;

  if (typeof option === "function") customOptions = option(link, i, links, state);
  else customOptions = option;

  if (customOptions && typeof customOptions === "object" && !Array.isArray(customOptions)) {
    for (const key in customOptions) {
      if (customOptions[key] === undefined) delete customOptions[key];
    }
  }

  if (optionConstantGetter) {
    if (typeof optionConstantGetter === "function")
      constantOptions = optionConstantGetter(link, i, links, state);
    else constantOptions = optionConstantGetter;

    if (
      constantOptions &&
      typeof constantOptions === "object" &&
      !Array.isArray(constantOptions) &&
      checkType<Record<string, unknown> | undefined>(
        customOptions,
        customOptions === undefined ||
          (typeof customOptions === "object" && !Array.isArray(customOptions)),
      )
    ) {
      return {
        ...(constantOptions as Record<string, unknown> | undefined),
        ...(customOptions as Record<string, unknown> | undefined),
      } as Result;
    }
  }

  return customOptions;
}
