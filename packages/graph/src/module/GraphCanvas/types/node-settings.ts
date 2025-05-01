import type { GraphCanvas } from "../GraphCanvas";
import type { NodeInterface, NodeShape, TextStyleEnum } from "./nodes";
import type { NodeIterationPropsInterface } from "./utils";

export type NodeSettingsInterface<
  NodeData extends Record<string, unknown>,
  LinkData extends Record<string, unknown>,
> = {
  cacheOptions?: boolean;
  nodeRadiusFlexible?: boolean;
  nodeRadiusCoefficient?: number;
  nodeRadiusFactor?: number;
  nodeSizeFlexible?: boolean;
  nodeSizeCoefficient?: number;
  nodeSizeFactor?: number;
  textNodeDebug?: boolean;
  idGetter?: NodeIterationPropsInterface<NodeData, LinkData, string | number>;
  options?:
    | NodeIterationPropsInterface<NodeData, LinkData, NodeOptionsInterface<NodeData, LinkData>>
    | NodeOptionsInterface<NodeData, LinkData>;
};

export type NodeOptionsInterface<
  NodeData extends Record<string, unknown>,
  LinkData extends Record<string, unknown>,
> = {
  nodeDraw?:
    | ((
        this: GraphCanvas<NodeData, LinkData>,
        node: NodeInterface<NodeData>,
        options: Required<NodeOptionsInterface<NodeData, LinkData>>,
      ) => void)
    | null;
  textDraw?:
    | ((
        this: GraphCanvas<NodeData, LinkData>,
        node: NodeInterface<NodeData>,
        options: Required<NodeOptionsInterface<NodeData, LinkData>>,
      ) => void)
    | null;
  nodeExtraDraw?:
    | ((
        this: GraphCanvas<NodeData, LinkData>,
        node: NodeInterface<NodeData>,
        options: Required<NodeOptionsInterface<NodeData, LinkData>>,
      ) => void)
    | null;
  textExtraDraw?:
    | ((
        this: GraphCanvas<NodeData, LinkData>,
        node: NodeInterface<NodeData>,
        options: Required<NodeOptionsInterface<NodeData, LinkData>>,
      ) => void)
    | null;
} & NodeOptionsNodeInterface &
  NodeOptionsTextInterface &
  NodeOptionsLabelInterface;

export type NodeOptionsNodeInterface = {
  shape?: NodeShape;
  width?: number;
  height?: number;
  radius?: number;
  alpha?: number;
  color?: string;
  borderRadius?: number;
  borderColor?: string;
  borderWidth?: number;
};
export type NodeOptionsTextInterface = {
  textVisible?: boolean;
  text?: string | null;
  textColor?: string;
  textSize?: number;
  textAlpha?: number;
  textWidth?: number;
  textShiftX?: number;
  textShiftY?: number;
  textWeight?: number;
  textGap?: number;
  textFont?: string;
  textAlign?: CanvasTextAlign;
  textStyle?: TextStyleEnum;
};
export type NodeOptionsLabelInterface = {
  labelAlpha?: number;
  labelYPadding?: number;
  labelXPadding?: number;
  labelAlign?: CanvasTextAlign;
  labelColor?: string;
  labelSize?: number;
  labelFont?: string;
  labelWidth?: number;
  labelStyle?: TextStyleEnum;
  labelWeight?: number;
  labelGap?: number;
  label?: string | null;
};
