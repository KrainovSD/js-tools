import type { GraphCanvas } from "../GraphCanvas";
import {
  nodeIterationExtractor,
  nodeOptionsGetter,
  nodeRadiusGetter,
  nodeSizeGetter,
} from "../lib";
import { getTextLines } from "./draw-text";

export function updateNodeCache<
  NodeData extends Record<string, unknown>,
  LinkData extends Record<string, unknown>,
>(this: GraphCanvas<NodeData, LinkData>) {
  this.nodeOptionsCache = {};
  if (!this.context) return;

  for (let i = 0; i < this.nodes.length; i++) {
    const node = this.nodes[i];
    const nodeOptions = nodeIterationExtractor(
      node,
      i,
      this.nodes,
      this,
      this.nodeSettings.options ?? {},
      nodeOptionsGetter,
    );
    const radius =
      nodeOptions.shape === "circle"
        ? nodeRadiusGetter({
            radiusFlexible: this.nodeSettings.nodeRadiusFlexible,
            radiusInitial: nodeOptions.radius,
            radiusIncrementByStep: this.nodeSettings.nodeRadiusIncrementByStep,
            radiusLinkCountForStep: this.nodeSettings.nodeRadiusLinkCountForStep,
            radiusMaxLinearSteps: this.nodeSettings.nodeRadiusMaxLinearSteps,
            radiusLogFactor: this.nodeSettings.nodeRadiusLogFactor,
            radiusLinkCountDividerForLog: this.nodeSettings.nodeRadiusLinkCountDividerForLog,
            linkCount: node.linkCount,
          })
        : nodeOptions.radius;

    let width = nodeOptions.width;
    let height = nodeOptions.height;
    let labelSize = nodeOptions.labelSize;
    if (nodeOptions.shape === "square") {
      const size = nodeSizeGetter({
        heightInitial: nodeOptions.height,
        widthInitial: nodeOptions.width,
        linkCount: node.linkCount,
        sizeFlexible: this.nodeSettings.nodeSizeFlexible,
        sizeIncrementByStep: this.nodeSettings.nodeSizeIncrementByStep,
        sizeLinkCountForStep: this.nodeSettings.nodeSizeLinkCountForStep,
        sizeMaxLinearSteps: this.nodeSettings.nodeSizeMaxLinearSteps,
        sizeLogFactor: this.nodeSettings.nodeSizeLogFactor,
        sizeLinkCountDividerForLog: this.nodeSettings.nodeSizeLinkCountDividerForLog,
      });
      width = size.width;
      height = size.height;
    }
    if (nodeOptions.shape === "text") {
      width = nodeOptions.width;
      const size = nodeSizeGetter({
        heightInitial: nodeOptions.height,
        widthInitial: width,
        linkCount: node.linkCount,
        sizeFlexible: this.nodeSettings.nodeSizeFlexible,
        sizeIncrementByStep: this.nodeSettings.nodeSizeIncrementByStep,
        sizeLinkCountForStep: this.nodeSettings.nodeSizeLinkCountForStep,
        sizeMaxLinearSteps: this.nodeSettings.nodeSizeMaxLinearSteps,
        sizeLogFactor: this.nodeSettings.nodeSizeLogFactor,
        sizeLinkCountDividerForLog: this.nodeSettings.nodeSizeLinkCountDividerForLog,
      });

      labelSize *= size.additionalSizeCoefficient;
    }
    /** Size by text in textNode */
    if (nodeOptions.shape === "text" && nodeOptions.label) {
      const textInfo = getTextLines({
        context: this.context,
        text: nodeOptions.label,
        textAlign: nodeOptions.labelAlign,
        textColor: nodeOptions.labelColor,
        textFont: nodeOptions.labelFont,
        textSize: labelSize,
        maxWidth: nodeOptions.labelWidth,
        textStyle: nodeOptions.labelStyle,
        textWeight: nodeOptions.textWeight,
      });
      const textNodeParameters = [textInfo.currentMaxSize, labelSize];
      const lines = textInfo.lines;
      const textSizeCoefficient = labelSize / textNodeParameters[1];
      const maxSize = textNodeParameters[0] * textSizeCoefficient;

      height =
        lines.length * labelSize +
        (lines.length - 1) * nodeOptions.labelGap +
        nodeOptions.labelYPadding;

      width = maxSize + nodeOptions.labelXPadding;
    }

    nodeOptions.width = width;
    nodeOptions.height = height;
    nodeOptions.radius = radius;
    nodeOptions.labelSize = labelSize;

    this.nodeOptionsCache[node.id] = nodeOptions;
  }
}
