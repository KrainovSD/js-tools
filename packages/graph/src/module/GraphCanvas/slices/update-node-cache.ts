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
    /** label in not text shape */
    if (nodeOptions.shape !== "text" && nodeOptions.label) {
      this.context.font = `${nodeOptions.labelStyle} normal ${nodeOptions.labelWeight} ${nodeOptions.labelSize}px ${nodeOptions.labelFont}`;
      this.context.fillStyle = nodeOptions.labelColor;
      this.context.textAlign = nodeOptions.labelAlign;

      if (
        nodeOptions.labelWidth == undefined ||
        this.context.measureText(nodeOptions.label).width <= nodeOptions.labelWidth
      ) {
        this.cachedNodeLabel[node.id] = [nodeOptions.label];
      }

      const { lines } = getTextLines({
        context: this.context,
        maxWidth: nodeOptions.labelWidth,
        text: nodeOptions.label,
        textAlign: nodeOptions.labelAlign,
        textColor: nodeOptions.labelColor,
        textFont: nodeOptions.labelFont,
        textSize: nodeOptions.labelSize,
        textStyle: nodeOptions.labelStyle,
        textWeight: nodeOptions.labelWeight,
      });
      this.cachedNodeLabel[node.id] = lines;
    }
    /** label in text shape */
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
      this.cachedNodeLabel[node.id] = lines;
    }

    nodeOptions.width = node.visible === false ? 0 : width;
    nodeOptions.height = node.visible === false ? 0 : height;
    nodeOptions.radius = node.visible === false ? 0 : radius;
    nodeOptions.labelSize = labelSize;

    /** text */
    if (nodeOptions.text) {
      this.context.font = `${nodeOptions.textStyle} normal ${nodeOptions.textWeight} ${nodeOptions.textSize}px ${nodeOptions.textFont}`;
      this.context.fillStyle = nodeOptions.textColor;
      this.context.textAlign = nodeOptions.textAlign;

      if (
        nodeOptions.textWidth == undefined ||
        this.context.measureText(nodeOptions.text).width <= nodeOptions.textWidth
      ) {
        this.cachedNodeText[node.id] = [nodeOptions.text];
      }

      const { lines } = getTextLines({
        context: this.context,
        maxWidth: nodeOptions.textWidth,
        text: nodeOptions.text,
        textAlign: nodeOptions.textAlign,
        textColor: nodeOptions.textColor,
        textFont: nodeOptions.textFont,
        textSize: nodeOptions.textSize,
        textStyle: nodeOptions.textStyle,
        textWeight: nodeOptions.textWeight,
      });
      this.cachedNodeText[node.id] = lines;
    }

    this.nodeOptionsCache[node.id] = nodeOptions;
  }
}
