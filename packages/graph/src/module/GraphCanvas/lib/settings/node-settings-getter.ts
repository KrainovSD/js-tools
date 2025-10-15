import type { ZoomTransform } from "d3-zoom";
import { colorGetter } from "@/lib";
import type { GraphCanvas } from "../../GraphCanvas";
import { NODE_OPTIONS, NODE_SETTINGS } from "../../constants";
import type { NodeInterface, NodeOptionsInterface, NodeSettingsInterface } from "../../types";

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
  this: GraphCanvas<NodeData, LinkData>,
  node: NodeInterface<NodeData>,
): Required<NodeOptionsInterface<NodeData, LinkData>> {
  const { textShiftY, textSize } = nodeTextSizeGetter(this.areaTransform, this.nodeSettings);

  return {
    ...NODE_OPTIONS,
    nodeDraw: null,
    nodeExtraDraw: null,
    textDraw: null,
    textExtraDraw: null,
    color: color(String(node.group ?? "_DEFAULT")),
    textVisible: Boolean(this.areaTransform.k > this.nodeSettings.textScaleMin),
    text: node.name ?? node.id.toString(),
    textShiftY,
    textSize,
  };
}

export function nodeTextSizeGetter<
  NodeData extends Record<string, unknown>,
  LinkData extends Record<string, unknown>,
>(
  transform: ZoomTransform | undefined,
  nodeSettings: Required<Omit<NodeSettingsInterface<NodeData, LinkData>, "options">> &
    Pick<NodeSettingsInterface<NodeData, LinkData>, "options">,
) {
  let textSize: number = nodeSettings.textSizeMin;
  let textShiftY: number = nodeSettings.textShiftYMin;

  if (transform) {
    if (transform.k >= nodeSettings.textScaleMax) {
      textSize = nodeSettings.textSizeMax;
      textShiftY = nodeSettings.textShiftYMax;
    } else if (transform.k > nodeSettings.textScaleMin) {
      textSize =
        nodeSettings.textSizeMin +
        ((transform.k - nodeSettings.textScaleMin) *
          (nodeSettings.textSizeMax - nodeSettings.textSizeMin)) /
          (nodeSettings.textScaleMax - nodeSettings.textScaleMin);

      textShiftY =
        nodeSettings.textShiftYMin +
        ((transform.k - nodeSettings.textScaleMin) *
          (nodeSettings.textShiftYMax - nodeSettings.textShiftYMin)) /
          (nodeSettings.textScaleMax - nodeSettings.textScaleMin);
    }
  }

  return { textSize, textShiftY };
}

export type NodeRadiusGetterOptions = {
  linkCount: number | undefined;
  radiusFlexible: boolean;
  radiusInitial: number;
  radiusLinkCountForStep: number;
  radiusIncrementByStep: number;
  radiusMaxLinearSteps: number;
  radiusLogFactor: number;
  radiusLinkCountDividerForLog: number;
};

export function nodeRadiusGetter({
  radiusFlexible,
  linkCount,
  radiusInitial,
  radiusIncrementByStep,
  radiusLinkCountDividerForLog,
  radiusLinkCountForStep,
  radiusLogFactor,
  radiusMaxLinearSteps,
}: NodeRadiusGetterOptions) {
  if (!radiusFlexible || !linkCount) return radiusInitial;
  const steps = linkCount / radiusLinkCountForStep;

  if (steps < radiusMaxLinearSteps) {
    return steps * radiusIncrementByStep + radiusInitial;
  }

  return (
    radiusInitial +
    radiusMaxLinearSteps * radiusIncrementByStep +
    radiusLogFactor * Math.log10(linkCount / radiusLinkCountDividerForLog)
  );
}

export type NodeSizeGetterOptions = {
  linkCount: number | undefined;
  sizeFlexible: boolean;
  widthInitial: number;
  heightInitial: number;
  sizeLinkCountForStep: number;
  sizeIncrementByStep: number;
  sizeMaxLinearSteps: number;
  sizeLogFactor: number;
  sizeLinkCountDividerForLog: number;
};

export function nodeSizeGetter({
  heightInitial,
  linkCount,
  sizeFlexible,
  widthInitial,
  sizeIncrementByStep,
  sizeLinkCountDividerForLog,
  sizeLinkCountForStep,
  sizeLogFactor,
  sizeMaxLinearSteps,
}: NodeSizeGetterOptions) {
  let additionalSizeCoefficient = 1;
  if (sizeFlexible && linkCount != undefined) {
    const steps = linkCount / sizeLinkCountForStep;
    if (steps < sizeMaxLinearSteps) {
      additionalSizeCoefficient += steps * sizeIncrementByStep;
    } else {
      additionalSizeCoefficient +=
        sizeMaxLinearSteps * sizeIncrementByStep +
        sizeLogFactor * Math.log10(linkCount / sizeLinkCountDividerForLog);
    }
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
