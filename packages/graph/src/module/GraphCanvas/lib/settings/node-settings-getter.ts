import type { ZoomTransform } from "d3-zoom";
import { colorGetter } from "@/lib";
import type { GraphCanvas } from "../../GraphCanvas";
import { NODE_OPTIONS, NODE_SETTINGS } from "../../constants";
import type {
  GraphNodeSettingsInterface,
  NodeInterface,
  NodeOptionsInterface,
  NodeSettingsInterface,
} from "../../types";

export function nodeSettingsGetter<
  NodeData extends Record<string, unknown>,
  LinkData extends Record<string, unknown>,
>(
  settings: NodeSettingsInterface<NodeData, LinkData> | undefined,
  prevNodeSettings?: GraphNodeSettingsInterface<NodeData, LinkData>,
): GraphNodeSettingsInterface<NodeData, LinkData> {
  const result = {
    ...(prevNodeSettings ?? NODE_SETTINGS),
    idGetter: nodeIdGetter,
    ...settings,
  };
  if (result.smartCache && (!result.textScaleSteps || result.textScaleSteps.length === 0)) {
    const step = (result.textScaleMax - result.textScaleMin) / 9;
    const steps: number[] = [];
    for (let i = 0; i < 10; i++) {
      steps.push(result.textScaleMin + i * step);
    }
    result.textScaleSteps = steps;
  }
  return result as Required<Omit<NodeSettingsInterface<NodeData, LinkData>, "options">> &
    Pick<NodeSettingsInterface<NodeData, LinkData>, "options">;
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
    textShiftY,
    textSize,
  };
}

export function nodeTextGetter<
  NodeData extends Record<string, unknown>,
  LinkData extends Record<string, unknown>,
>(
  this: GraphCanvas<NodeData, LinkData>,
  node: NodeInterface<NodeData>,
  index: number,
): Required<string | null> {
  const cache = this.nodeOptionsCache[index];
  if (cache?.shape == "text") return null;
  return this.areaTransform.k > this.nodeSettings.textScaleMin
    ? (node.name ?? node.id.toString())
    : null;
}

export function nodeLabelGetter<
  NodeData extends Record<string, unknown>,
  LinkData extends Record<string, unknown>,
>(
  this: GraphCanvas<NodeData, LinkData>,
  node: NodeInterface<NodeData>,
  index: number,
): Required<string | null> {
  const cache = this.nodeOptionsCache[index];
  if (cache?.shape == "text") return node.name ?? null;
  return node.label ?? null;
}

export function nodeTextSizeGetter<
  NodeData extends Record<string, unknown>,
  LinkData extends Record<string, unknown>,
>(
  transform: ZoomTransform | undefined,
  nodeSettings: GraphNodeSettingsInterface<NodeData, LinkData>,
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
