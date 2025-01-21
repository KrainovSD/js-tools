import type { ZoomTransform } from "d3-zoom";
import { colorGetter } from "@/lib";
import type { NodeInterface } from "@/types";
import { COMMON_SETTINGS, NODE_SETTINGS } from "../../constants";
import type { GraphCanvasNodeOptions, GraphCanvasNodeSettings } from "../../types";

export function nodeSettingsGetter<NodeData extends Record<string, unknown>>(
  settings: GraphCanvasNodeSettings<NodeData> | undefined,
): Required<Omit<GraphCanvasNodeSettings<NodeData>, "options">> &
  Pick<GraphCanvasNodeSettings<NodeData>, "options"> {
  return {
    idGetter: settings?.idGetter ?? nodeIdGetter,
    options: settings?.options,
  };
}

const color = colorGetter();

export function nodeOptionsGetter<NodeData extends Record<string, unknown>>(
  node: NodeInterface<NodeData>,
  _: number,
  __: NodeInterface<NodeData>[],
  transform?: ZoomTransform,
): Required<GraphCanvasNodeOptions> {
  const { textShiftY, textSize } = nodeTextSizeGetter(transform);

  return {
    ...NODE_SETTINGS,
    color: color(String(node.group || "_DEFAULT")),
    textVisible: Boolean(transform && transform.k > COMMON_SETTINGS.nodeTextScaleMin),
    text: node.id != undefined ? String(node.id) : null,
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

export function nodeIdGetter<NodeData extends Record<string, unknown>>(d: NodeInterface<NodeData>) {
  return d.id;
}
