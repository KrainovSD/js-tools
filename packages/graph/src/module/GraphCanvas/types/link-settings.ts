import type { GraphState } from "./graph";
import type { LinkInterface } from "./links";
import type { LinkIterationPropsInterface } from "./utils";

export type LinkSettingsInterface<
  NodeData extends Record<string, unknown>,
  LinkData extends Record<string, unknown>,
> = {
  cacheOptions?: boolean;
  prettyDraw?: boolean;
  arrow?: boolean;
  arrowByHighlight?: boolean;
  particles?: boolean;
  particleFlexSpeed?: boolean;
  particleFlexSpeedCoefficient?: number;
  options?:
    | LinkIterationPropsInterface<NodeData, LinkData, LinkOptionsInterface<NodeData, LinkData>>
    | LinkOptionsInterface<NodeData, LinkData>;
};

export type LinkOptionsInterface<
  NodeData extends Record<string, unknown>,
  LinkData extends Record<string, unknown>,
> = {
  drawLink?:
    | ((
        link: LinkInterface<NodeData, LinkData>,
        options: Required<LinkOptionsInterface<NodeData, LinkData>>,
        state: GraphState<NodeData, LinkData>,
      ) => void)
    | null;
  drawExtraLink?:
    | ((
        link: LinkInterface<NodeData, LinkData>,
        options: Required<LinkOptionsInterface<NodeData, LinkData>>,
        state: GraphState<NodeData, LinkData>,
      ) => void)
    | null;
} & LinkOptionsLinkInterface &
  LinkOptionsArrowInterface &
  LinkOptionsParticleInterface;

export type LinkOptionsLinkInterface = {
  alpha?: number;
  color?: string;
  width?: number;
};

export type LinkOptionsArrowInterface = {
  arrowAlpha?: number;
  arrowColor?: string;
  arrowSize?: number;
  arrowBorderColor?: string;
  arrowBorderWidth?: number;
};

export type LinkOptionsParticleInterface = {
  particleAlpha?: number;
  particleColor?: string;
  particleRadius?: number;
  particleCount?: number;
  particleSteps?: number;
  particleBorderWidth?: number;
  particleBorderColor?: string;
};
