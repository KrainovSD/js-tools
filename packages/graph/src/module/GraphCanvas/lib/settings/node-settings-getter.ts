import type { ZoomTransform } from "d3-zoom";
import { colorGetter } from "@/lib";
import type { NodeInterface } from "@/types";
import { COMMON_SETTINGS, NODE_OPTIONS, NODE_SETTINGS } from "../../constants";
import type { GraphState, NodeOptionsInterface, NodeSettingsInterface } from "../../types";

export function nodeSettingsGetter<
  NodeData extends Record<string, unknown>,
  LinkData extends Record<string, unknown>,
>(
  settings: NodeSettingsInterface<NodeData, LinkData> | undefined,
  prevNodeSettings?: Required<Omit<NodeSettingsInterface<NodeData, LinkData>, "options">> &
    Pick<NodeSettingsInterface<NodeData, LinkData>, "options">,
): Required<Omit<NodeSettingsInterface<NodeData, LinkData>, "options">> &
  Pick<NodeSettingsInterface<NodeData, LinkData>, "options"> {
  return {
    ...(prevNodeSettings ?? NODE_SETTINGS),
    idGetter: nodeIdGetter,
    ...settings,
  };
}

const color = colorGetter();

export function nodeOptionsGetter<
  NodeData extends Record<string, unknown>,
  LinkData extends Record<string, unknown>,
>(
  node: NodeInterface<NodeData>,
  _: number,
  __: NodeInterface<NodeData>[],
  state?: GraphState<NodeData, LinkData>,
): Required<NodeOptionsInterface<NodeData, LinkData>> {
  const { textShiftY, textSize } = nodeTextSizeGetter(state?.areaTransform);

  return {
    ...NODE_OPTIONS,
    nodeDraw: null,
    nodeExtraDraw: null,
    textDraw: null,
    textExtraDraw: null,
    color: color(String(node.group ?? "_DEFAULT")),
    textVisible: Boolean(
      state?.areaTransform && state.areaTransform.k > COMMON_SETTINGS.nodeTextScaleMin,
    ),
    text: node.name ?? node.id.toString(),
    textShiftY,
    textSize,
  };
}

export function nodeTextSizeGetter(transform: ZoomTransform | undefined) {
  let textSize: number = COMMON_SETTINGS.nodeTextSizeMax;
  let textShiftY: number = COMMON_SETTINGS.nodeTextShiftYMax;

  if (transform) {
    const scaleStepCoefficient =
      (COMMON_SETTINGS.nodeTextScaleMax - COMMON_SETTINGS.nodeTextScaleMin) /
      COMMON_SETTINGS.nodeTextChangeStepCount;
    const textStepCoefficient =
      (COMMON_SETTINGS.nodeTextSizeMax - COMMON_SETTINGS.nodeTextSizeMin) /
      COMMON_SETTINGS.nodeTextChangeStepCount;
    const shiftStepCoefficient =
      (COMMON_SETTINGS.nodeTextShiftYMax - COMMON_SETTINGS.nodeTextShiftYMin) /
      COMMON_SETTINGS.nodeTextChangeStepCount;

    if (transform.k >= COMMON_SETTINGS.nodeTextScaleMax) {
      textSize = COMMON_SETTINGS.nodeTextSizeMin;
      textShiftY = COMMON_SETTINGS.nodeTextShiftYMin;
    } else if (transform.k > COMMON_SETTINGS.nodeTextScaleMin) {
      const transformSteps =
        (transform.k - COMMON_SETTINGS.nodeTextScaleMin) / scaleStepCoefficient;

      textSize -= transformSteps * textStepCoefficient;
      textShiftY -= transformSteps * shiftStepCoefficient;
    }
  }

  return { textSize, textShiftY };
}

export type NodeRadiusGetterOptions = {
  linkCount: number | undefined;
  radiusFlexible: boolean;
  radiusCoefficient: number;
  radiusFactor: number;
  radiusInitial: number;
};

export function nodeRadiusGetter({
  radiusFlexible,
  radiusInitial,
  linkCount,
  radiusCoefficient,
  radiusFactor,
}: NodeRadiusGetterOptions) {
  return (
    (radiusFlexible && linkCount ? linkCount / radiusCoefficient : 0) * radiusFactor + radiusInitial
  );
}

export type NodeSizeGetterOptions = {
  linkCount: number | undefined;
  sizeFlexible: boolean;
  sizeCoefficient: number;
  sizeFactor: number;
  widthInitial: number;
  heightInitial: number;
};

export function nodeSizeGetter({
  heightInitial,
  linkCount,
  sizeCoefficient,
  sizeFactor,
  sizeFlexible,
  widthInitial,
}: NodeSizeGetterOptions) {
  let additionalSizeCoefficient = 1;
  if (sizeFlexible && linkCount != undefined) {
    additionalSizeCoefficient += (linkCount / sizeCoefficient) * sizeFactor;
  }

  return {
    width: widthInitial * additionalSizeCoefficient,
    height: heightInitial * additionalSizeCoefficient,
    additionalSizeCoefficient,
  };
}

export function nodeIdGetter<NodeData extends Record<string, unknown>>(
  node: NodeInterface<NodeData>,
) {
  return node.id;
}
