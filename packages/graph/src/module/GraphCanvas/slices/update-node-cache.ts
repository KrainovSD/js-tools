import type { GraphCanvas } from "../GraphCanvas";
import {
  nodeIterationExtractor,
  nodeLabelGetter,
  nodeOptionsGetter,
  nodeRadiusGetter,
  nodeSizeGetter,
  nodeTextGetter,
} from "../lib";
import { getTextLines } from "./draw-text";

export function updateNodeCache<
  NodeData extends Record<string, unknown>,
  LinkData extends Record<string, unknown>,
>(this: GraphCanvas<NodeData, LinkData>) {
  if (!this.context) return;

  const currentZoom = this.areaTransform.k;
  const options = this.nodeOptionsCache.length === 0;
  const label = this.cachedNodeLabel.length === 0;
  let text = this.cachedNodeText.length === 0;

  if (
    this.nodeSettings.smartCache &&
    this._lastNodeZoomK !== undefined &&
    !options &&
    !text &&
    !label
  ) {
    const thresholds = this.nodeSettings.textScaleSteps;
    if (thresholds && thresholds.length > 0) {
      const min = Math.min(this._lastNodeZoomK, currentZoom);
      const max = Math.max(this._lastNodeZoomK, currentZoom);
      const crossed = thresholds.some((t) => t >= min && t <= max);
      this._lastNodeZoomK = currentZoom;
      if (!crossed) return;
    }
    this.cachedNodeText.length = 0;
    text = true;
  }
  this._lastNodeZoomK = currentZoom;

  for (let i = 0; i < this.nodes.length; i++) {
    const node = this.nodes[i];
    if (options) {
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

      nodeOptions.width = node.visible === false ? 0 : width;
      nodeOptions.height = node.visible === false ? 0 : height;
      nodeOptions.radius = node.visible === false ? 0 : radius;
      nodeOptions.labelSize = labelSize;
      this.nodeOptionsCache[i] = nodeOptions;
    }

    const nodeOptions = this.nodeOptionsCache[i];
    if (!nodeOptions) continue;
    /** label */
    if (label) {
      const label = nodeIterationExtractor(
        node,
        i,
        this.nodes,
        this,
        this.nodeSettings.label,
        nodeLabelGetter,
      );
      /** label in not text shape */
      if (nodeOptions.shape !== "text" && label) {
        this.context.font = `${nodeOptions.labelStyle} normal ${nodeOptions.labelWeight} ${nodeOptions.labelSize}px ${nodeOptions.labelFont}`;
        this.context.fillStyle = nodeOptions.labelColor;
        this.context.textAlign = nodeOptions.labelAlign;

        if (
          nodeOptions.labelWidth == undefined ||
          this.context.measureText(label).width <= nodeOptions.labelWidth
        ) {
          this.cachedNodeLabel[i] = [label];
        }

        const { lines } = getTextLines({
          context: this.context,
          maxWidth: nodeOptions.labelWidth,
          text: label,
          textAlign: nodeOptions.labelAlign,
          textColor: nodeOptions.labelColor,
          textFont: nodeOptions.labelFont,
          textSize: nodeOptions.labelSize,
          textStyle: nodeOptions.labelStyle,
          textWeight: nodeOptions.labelWeight,
        });
        this.cachedNodeLabel[i] = lines;
        /** label in text shape */
      } else if (nodeOptions.shape === "text" && label) {
        const textInfo = getTextLines({
          context: this.context,
          text: label,
          textAlign: nodeOptions.labelAlign,
          textColor: nodeOptions.labelColor,
          textFont: nodeOptions.labelFont,
          textSize: nodeOptions.labelSize,
          maxWidth: nodeOptions.labelWidth,
          textStyle: nodeOptions.labelStyle,
          textWeight: nodeOptions.textWeight,
        });
        const textNodeParameters = [textInfo.currentMaxSize, nodeOptions.labelSize];
        const lines = textInfo.lines;
        const textSizeCoefficient = nodeOptions.labelSize / textNodeParameters[1];
        const maxSize = textNodeParameters[0] * textSizeCoefficient;

        nodeOptions.height =
          lines.length * nodeOptions.labelSize +
          (lines.length - 1) * nodeOptions.labelGap +
          nodeOptions.labelYPadding;

        nodeOptions.width = maxSize + nodeOptions.labelXPadding;
        this.cachedNodeLabel[i] = lines;
      } else {
        this.cachedNodeLabel[i] = [];
      }
    }

    /** text */
    if (text) {
      const text = nodeIterationExtractor(
        node,
        i,
        this.nodes,
        this,
        this.nodeSettings.text,
        nodeTextGetter,
      );
      if (!text) {
        this.cachedNodeText[i] = [];
        continue;
      }
      this.context.font = `${nodeOptions.textStyle} normal ${nodeOptions.textWeight} ${nodeOptions.textSize}px ${nodeOptions.textFont}`;
      this.context.fillStyle = nodeOptions.textColor;
      this.context.textAlign = nodeOptions.textAlign;
      const { lines } = getTextLines({
        context: this.context,
        maxWidth: nodeOptions.textWidth,
        text,
        textAlign: nodeOptions.textAlign,
        textColor: nodeOptions.textColor,
        textFont: nodeOptions.textFont,
        textSize: nodeOptions.textSize,
        textStyle: nodeOptions.textStyle,
        textWeight: nodeOptions.textWeight,
      });
      this.cachedNodeText[i] = lines;
    }
  }
}
