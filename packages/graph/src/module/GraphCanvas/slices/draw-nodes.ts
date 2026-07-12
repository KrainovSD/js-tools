import { isNumber } from "@krainovsd/js-helpers";
import type { GraphCanvas } from "../GraphCanvas";
import { isNodeVisible, nodeFade, nodeHighlight } from "../lib";
import type { DeferredDraw, NodeDrawBatch, NodeInterface, NodeTextDrawBatch } from "../types";

export function getDrawNode<
  NodeData extends Record<string, unknown>,
  LinkData extends Record<string, unknown>,
>(
  nodeBatch: Record<string, NodeDrawBatch[]>,
  nodeImageBatch: Record<string, NodeDrawBatch[]>,
  textBatch: Record<string, Record<string, NodeTextDrawBatch[]>>,
  deferredNodeRender: DeferredDraw[],
  deferredTextRender: DeferredDraw[],
) {
  return function drawNode(
    this: GraphCanvas<NodeData, LinkData>,
    node: NodeInterface<NodeData>,
    index: number,
  ) {
    if (!this.context || !node.x || !node.y) return;
    if (node.visible != undefined && !node.visible) {
      node._radius = 0;
      node._width = 0;
      node._height = 0;
      return;
    }
    const nodeOptions = this.nodeOptionsCache[index];
    if (!nodeOptions) return;
    if (nodeOptions.nodeDraw && nodeOptions.textDraw) {
      deferredNodeRender.push(() => {
        if (nodeOptions.nodeDraw) {
          nodeOptions.nodeDraw.bind(this)(node, nodeOptions);
        }
      });
      deferredTextRender.push(() => {
        if (nodeOptions.textDraw) {
          nodeOptions.textDraw.bind(this)(node, nodeOptions);
        }
      });
      return;
    }
    let radius = nodeOptions.radius;
    let width = nodeOptions.width;
    let height = nodeOptions.height;
    let alpha = nodeOptions.alpha;
    let color = nodeOptions.color;
    let borderColor = nodeOptions.borderColor;
    let borderWidth = nodeOptions.borderWidth;
    let textAlpha = nodeOptions.textAlpha;
    let textSize = nodeOptions.textSize;
    let textShiftX = nodeOptions.textShiftX;
    let textShiftY = nodeOptions.textShiftY;
    let textWeight = nodeOptions.textWeight;
    let labelSize = nodeOptions.labelSize;
    let labelWeight = nodeOptions.labelWeight;
    let labelAlpha = nodeOptions.labelAlpha;
    /** Highlight */
    if (this.highlightedNeighbors && this.highlightedNode) {
      /** By Node Not Highlight */
      if (!this.highlightedNeighbors.has(node.id) && this.highlightedNode.id != node.id) {
        const fadingOptions = nodeFade({
          highlightProgress: this.highlightProgress,
          nodeOptions,
          highlightForLabelFadingMin: this.highlightSettings.highlightByNodeForLabelFadingMin,
          highlightForNodeColorFading: this.highlightSettings.highlightByNodeForNodeColorFading,
          highlightForNodeFadingMin: this.highlightSettings.highlightByNodeForNodeFadingMin,
          highlightForTextFadingMin: this.highlightSettings.highlightByNodeForTextFadingMin,
        });
        alpha = fadingOptions.alpha;
        color = fadingOptions.color;
        textAlpha = fadingOptions.textAlpha;
        labelAlpha = fadingOptions.labelAlpha;
      } else if (
        !this.highlightSettings.highlightByNodeOnlyRoot ||
        (this.highlightSettings.highlightByNodeOnlyRoot && this.highlightedNode.id === node.id)
      ) {
        /** By Node Highlight */
        const highlightOptions = nodeHighlight({
          highlightProgress: this.highlightProgress,
          nodeOptions,
          highlightForLabelSizingAdditional:
            this.highlightSettings.highlightByNodeForLabelSizingAdditional,
          highlightForLabelWeightAdditional:
            this.highlightSettings.highlightByNodeForLabelWeightAdditional,
          highlightForNodeBorderColor: this.highlightSettings.highlightByNodeForNodeBorderColor,
          highlightForNodeBorderSizingAdditional:
            this.highlightSettings.highlightByNodeForNodeBorderSizingAdditional,
          highlightForNodeColor: this.highlightSettings.highlightByNodeForNodeColor,
          highlightForNodeSizingAdditional:
            this.highlightSettings.highlightByNodeForNodeSizingAdditional,
          highlightForNodeSizingAdditionalCoefficient:
            this.highlightSettings.highlightByNodeForNodeSizingAdditionalCoefficient,
          highlightForTextShiftXAdditional:
            this.highlightSettings.highlightByNodeForTextShiftXAdditional,
          highlightForTextShiftYAdditional:
            this.highlightSettings.highlightByNodeForTextShiftYAdditional,
          highlightForTextSizingAdditional:
            this.highlightSettings.highlightByNodeForTextSizingAdditional,
          highlightForTextWeightAdditional:
            this.highlightSettings.highlightByNodeForTextWeightAdditional,
        });
        color = highlightOptions.color;
        borderColor = highlightOptions.borderColor;
        borderWidth = highlightOptions.borderWidth;
        radius = highlightOptions.radiusInitial;
        width = highlightOptions.widthInitial;
        height = highlightOptions.heightInitial;
        textSize = highlightOptions.textSize;
        textShiftX = highlightOptions.textShiftX;
        textShiftY = highlightOptions.textShiftY;
        textWeight = highlightOptions.textWeight;
        labelSize = highlightOptions.labelSize;
        labelWeight = highlightOptions.labelWeight;
      }
    }
    if (this.highlightedNeighbors && this.highlightedLink) {
      /** By Link Not Highlight */
      if (
        !this.highlightedNeighbors.has(node.id) &&
        this.highlightedLink.source !== node &&
        this.highlightedLink.target !== node
      ) {
        const fadingOptions = nodeFade({
          highlightProgress: this.highlightProgress,
          nodeOptions,
          highlightForLabelFadingMin: this.highlightSettings.highlightByLinkForLabelFadingMin,
          highlightForNodeColorFading: this.highlightSettings.highlightByLinkForNodeColorFading,
          highlightForNodeFadingMin: this.highlightSettings.highlightByLinkForNodeFadingMin,
          highlightForTextFadingMin: this.highlightSettings.highlightByLinkForTextFadingMin,
        });
        alpha = fadingOptions.alpha;
        color = fadingOptions.color;
        textAlpha = fadingOptions.textAlpha;
        labelAlpha = fadingOptions.labelAlpha;
      } else {
        /** By Link Highlight */

        const highlightOptions = nodeHighlight({
          highlightProgress: this.highlightProgress,
          nodeOptions,
          highlightForLabelSizingAdditional:
            this.highlightSettings.highlightByLinkForLabelSizingAdditional,
          highlightForLabelWeightAdditional:
            this.highlightSettings.highlightByLinkForLabelWeightAdditional,
          highlightForNodeBorderColor: this.highlightSettings.highlightByLinkForNodeBorderColor,
          highlightForNodeBorderSizingAdditional:
            this.highlightSettings.highlightByLinkForNodeBorderSizingAdditional,
          highlightForNodeColor: this.highlightSettings.highlightByLinkForNodeColor,
          highlightForNodeSizingAdditional:
            this.highlightSettings.highlightByLinkForNodeSizingAdditional,
          highlightForNodeSizingAdditionalCoefficient:
            this.highlightSettings.highlightByLinkForNodeSizingAdditionalCoefficient,
          highlightForTextShiftXAdditional:
            this.highlightSettings.highlightByLinkForTextShiftXAdditional,
          highlightForTextShiftYAdditional:
            this.highlightSettings.highlightByLinkForTextShiftYAdditional,
          highlightForTextSizingAdditional:
            this.highlightSettings.highlightByLinkForTextSizingAdditional,
          highlightForTextWeightAdditional:
            this.highlightSettings.highlightByLinkForTextWeightAdditional,
        });
        color = highlightOptions.color;
        borderColor = highlightOptions.borderColor;
        borderWidth = highlightOptions.borderWidth;
        radius = highlightOptions.radiusInitial;
        width = highlightOptions.widthInitial;
        height = highlightOptions.heightInitial;
        textSize = highlightOptions.textSize;
        textShiftX = highlightOptions.textShiftX;
        textShiftY = highlightOptions.textShiftY;
        textWeight = highlightOptions.textWeight;
        labelSize = highlightOptions.labelSize;
        labelWeight = highlightOptions.labelWeight;
      }
    }
    node._radius = radius;
    node._borderWidth = borderWidth;
    node._width = width;
    node._height = height;
    node._borderRadius =
      isNumber(nodeOptions.borderRadius) && nodeOptions.borderRadius > 0
        ? Math.min(nodeOptions.borderRadius, nodeOptions.width / 2, nodeOptions.height / 2)
        : 0;
    node._shape = nodeOptions.shape ?? "circle";
    if (
      !isNodeVisible({
        height: this.height,
        width: this.width,
        transform: this.areaTransform,
        node,
      })
    ) {
      node._visible = false;

      return;
    }
    node._visible = true;

    const nodeBatchKey = `${alpha}|${borderColor}|${borderWidth}|${color}`;
    let nodeGroup: NodeDrawBatch[];
    if (!node.image) {
      nodeBatch[nodeBatchKey] ??= [];
      nodeGroup = nodeBatch[nodeBatchKey];
    } else {
      nodeImageBatch[nodeBatchKey] ??= [];
      nodeGroup = nodeImageBatch[nodeBatchKey];
    }
    nodeGroup.push({
      shape: nodeOptions.shape,
      x: node.x,
      y: node.y,
      radius,
      width,
      height,
      image: node.image,
    });
    const labelLines = this.cachedNodeLabel[index];
    if (labelLines && labelLines.length > 0) {
      let y = node.y + labelSize / 3;
      let weight = labelWeight;
      if (nodeOptions.shape == "text") {
        y = node.y + textSize / 4 - (labelLines.length - 1) * (textSize / 2);
        weight = textWeight;
      }
      const font = `${nodeOptions.labelStyle} normal ${weight} ${labelSize}px ${nodeOptions.labelFont}`;
      textBatch[font] ??= {};
      const fontBatch = textBatch[font];
      const textBatchKey = `${labelAlpha}|${nodeOptions.labelAlign}|${nodeOptions.labelColor}`;
      fontBatch[textBatchKey] ??= [];
      const textGroup = fontBatch[textBatchKey];
      for (let i = 0; i < labelLines.length; i++) {
        const line = labelLines[i];
        textGroup.push({
          text: line,
          x: node.x,
          y: y + i * textSize + i * nodeOptions.textGap,
        });
      }
    }
    if (nodeOptions.nodeExtraDraw) {
      deferredNodeRender.push(() => {
        nodeOptions?.nodeExtraDraw?.bind?.(this)?.(node, {
          ...nodeOptions,
          radius,
          alpha,
          color,
          textAlpha,
          textSize,
          textShiftX,
          textShiftY,
          textWeight,
        });
      });
    }
    const textLines = this.cachedNodeText[index];
    if (textLines && textLines.length > 0) {
      if (nodeOptions.textDraw) {
        deferredTextRender.push(() => {
          nodeOptions?.textDraw?.bind?.(this)?.(node, {
            ...nodeOptions,
            radius,
            alpha,
            color,
            textAlpha,
            textSize,
            textShiftX,
            textShiftY,
            textWeight,
          });
        });
      }
      let y = node.y + textShiftY;
      if (nodeOptions.shape === "circle") {
        y += radius;
      }
      if (nodeOptions.shape === "square" || nodeOptions.shape === "text") {
        y += height / 2;
      }
      const font = `${nodeOptions.textStyle} normal ${textWeight} ${textSize}px ${nodeOptions.textFont}`;
      textBatch[font] ??= {};
      const fontBatch = textBatch[font];
      const textBatchKey = `${textAlpha}|${nodeOptions.textAlign}|${nodeOptions.textColor}`;
      fontBatch[textBatchKey] ??= [];
      const textGroup = fontBatch[textBatchKey];
      for (let i = 0; i < textLines.length; i++) {
        const line = textLines[i];
        textGroup.push({
          text: line,
          x: node.x + textShiftX,
          y: y + i * textSize + i * nodeOptions.textGap,
        });
      }
      if (nodeOptions.textExtraDraw) {
        deferredTextRender.push(() => {
          nodeOptions?.textExtraDraw?.bind?.(this)?.(node, {
            ...nodeOptions,
            radius,
            alpha,
            color,
            textAlpha,
            textSize,
            textShiftX,
            textShiftY,
            textWeight,
          });
        });
      }
    }
  };
}
