import { isNumber } from "@krainovsd/js-helpers";
import type { GraphCanvas } from "../GraphCanvas";
import {
  isNodeVisible,
  nodeFade,
  nodeHighlight,
  nodeIterationExtractor,
  nodeOptionsGetter,
  nodeRadiusGetter,
  nodeSizeGetter,
} from "../lib";
import type {
  CachedTextNodeParametersInterface,
  GraphState,
  NodeInterface,
  NodeOptionsInterface,
} from "../types";
import { drawText, getTextLines } from "./draw-text";

export function getDrawNode<
  NodeData extends Record<string, unknown>,
  LinkData extends Record<string, unknown>,
>(nodeRenders: (() => void)[], textRenders: (() => void)[], state: GraphState<NodeData, LinkData>) {
  return function drawNode(
    this: GraphCanvas<NodeData, LinkData>,
    node: NodeInterface<NodeData>,
    index: number,
  ) {
    if (!this.context || !node.x || !node.y) return;

    let nodeOptions: Required<NodeOptionsInterface<NodeData, LinkData>>;
    if (this.nodeSettings.cacheOptions && this.nodeOptionsCache[node.id]) {
      nodeOptions = this.nodeOptionsCache[node.id];
    } else {
      nodeOptions = nodeIterationExtractor(
        node,
        index,
        this.nodes,
        state,
        this.nodeSettings.options ?? {},
        nodeOptionsGetter,
      );
      if (this.nodeSettings.cacheOptions) {
        this.nodeOptionsCache[node.id] = nodeOptions;
      }
    }

    if (nodeOptions.nodeDraw && nodeOptions.textDraw) {
      nodeRenders.push(() => {
        if (nodeOptions.nodeDraw) {
          nodeOptions.nodeDraw.bind(this)(node, nodeOptions);
        }
      });

      textRenders.push(() => {
        if (nodeOptions.textDraw) {
          nodeOptions.textDraw.bind(this)(node, nodeOptions);
        }
      });

      return;
    }

    let alpha = nodeOptions.alpha;
    let color = nodeOptions.color;
    let borderColor = nodeOptions.borderColor;
    let borderWidth = nodeOptions.borderWidth;
    let radiusInitial = nodeOptions.radius;
    let widthInitial = nodeOptions.width;
    let heightInitial = nodeOptions.height;
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
          highlightForNodeColorFadingMin:
            this.highlightSettings.highlightByNodeForNodeColorFadingMin,
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
        radiusInitial = highlightOptions.radiusInitial;
        widthInitial = highlightOptions.widthInitial;
        heightInitial = highlightOptions.heightInitial;
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
          highlightForNodeColorFadingMin:
            this.highlightSettings.highlightByLinkForNodeColorFadingMin,
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
        radiusInitial = highlightOptions.radiusInitial;
        widthInitial = highlightOptions.widthInitial;
        heightInitial = highlightOptions.heightInitial;
        textSize = highlightOptions.textSize;
        textShiftX = highlightOptions.textShiftX;
        textShiftY = highlightOptions.textShiftY;
        textWeight = highlightOptions.textWeight;
        labelSize = highlightOptions.labelSize;
        labelWeight = highlightOptions.labelWeight;
      }
    }

    /** Flex radius */
    const radius =
      nodeOptions.shape === "circle"
        ? nodeRadiusGetter({
            radiusFlexible: this.nodeSettings.nodeRadiusFlexible,
            radiusInitial,
            radiusCoefficient: this.nodeSettings.nodeRadiusCoefficient,
            radiusFactor: this.nodeSettings.nodeRadiusFactor,
            linkCount: node.linkCount,
          })
        : radiusInitial;
    /** Flex size */
    let height: number = heightInitial;
    let width: number = widthInitial;
    if (nodeOptions.shape === "square") {
      const size = nodeSizeGetter({
        heightInitial,
        widthInitial,
        linkCount: node.linkCount,
        sizeCoefficient: this.nodeSettings.nodeSizeCoefficient,
        sizeFactor: this.nodeSettings.nodeSizeFactor,
        sizeFlexible: this.nodeSettings.nodeSizeFlexible,
      });
      width = size.width;
      height = size.height;
    }
    if (nodeOptions.shape === "text") {
      width = nodeOptions.width;

      const size = nodeSizeGetter({
        heightInitial,
        widthInitial: width,
        linkCount: node.linkCount,
        sizeCoefficient: this.nodeSettings.nodeSizeCoefficient,
        sizeFactor: this.nodeSettings.nodeSizeFactor,
        sizeFlexible: this.nodeSettings.nodeSizeFlexible,
      });

      labelSize *= size.additionalSizeCoefficient;
    }
    /** Size by text in textNode */
    if (nodeOptions.shape === "text" && nodeOptions.label) {
      let lines: string[];

      let textNodeParameters: CachedTextNodeParametersInterface;

      const cachedLines = this.cachedNodeLabel[node.id];
      const cachedTextNodeParameters = this.cachedTextNodeParameters[node.id];
      if (cachedLines != undefined && cachedTextNodeParameters != undefined) {
        lines = cachedLines;
        textNodeParameters = cachedTextNodeParameters;
      } else {
        const textInfo = getTextLines({
          context: this.context,
          text: nodeOptions.label,
          textAlign: nodeOptions.labelAlign,
          textColor: nodeOptions.labelColor,
          textFont: nodeOptions.labelFont,
          textSize: labelSize,
          maxWidth: nodeOptions.labelWidth,
          textStyle: nodeOptions.labelStyle,
          textWeight,
        });
        textNodeParameters = [textInfo.currentMaxSize, labelSize];
        lines = textInfo.lines;
        this.cachedNodeLabel[node.id] = lines;
        this.cachedTextNodeParameters[node.id] = textNodeParameters;
      }

      const textSizeCoefficient = labelSize / textNodeParameters[1];
      const maxSize = textNodeParameters[0] * textSizeCoefficient;

      height =
        lines.length * labelSize +
        (lines.length - 1) * nodeOptions.labelGap +
        nodeOptions.labelYPadding;

      width = maxSize + nodeOptions.labelXPadding;
    }

    /** Node parameters */
    node._radius = radius;
    node._width = width;
    node._height = height;
    node._borderRadius =
      isNumber(nodeOptions.borderRadius) && nodeOptions.borderRadius > 0
        ? Math.min(nodeOptions.borderRadius, nodeOptions.width / 2, nodeOptions.height / 2)
        : 0;
    node._shape = nodeOptions.shape ?? "circle";

    /** Node Visibility */
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

    /** Node draw */
    nodeRenders.push(() => {
      if (!this.context || !node.x || !node.y) return;

      this.context.beginPath();
      this.context.globalAlpha = alpha;
      this.context.lineWidth = borderWidth;
      this.context.strokeStyle = borderColor;
      this.context.fillStyle = color;

      switch (nodeOptions.shape) {
        case "circle": {
          if (!node.image) {
            this.context.arc(node.x, node.y, radius, 0, 2 * Math.PI);
            this.context.fill();
            if (borderWidth > 0) {
              this.context.stroke();
            }
          } else {
            this.context.arc(node.x, node.y, radius, 0, 2 * Math.PI);
            this.context.closePath();
            this.context.save();
            this.context.clip();

            this.context.drawImage(
              node.image,
              node.x - radius,
              node.y - radius,
              radius * 2,
              radius * 2,
            );

            this.context.restore();
            if (borderWidth > 0) {
              this.context.stroke();
            }
          }

          if (node.label) {
            this.context.globalAlpha = labelAlpha;
            drawText({
              context: this.context,
              cachedNodeText: this.cachedNodeLabel,
              id: node.id,
              text: node.label,
              textAlign: nodeOptions.labelAlign,
              textColor: nodeOptions.labelColor,
              textFont: nodeOptions.labelFont,
              textGap: nodeOptions.labelGap,
              textSize: labelSize,
              textStyle: nodeOptions.labelStyle,
              textWeight: labelWeight,
              maxWidth: nodeOptions.labelWidth,
              x: node.x,
              y: node.y + labelSize / 3,
            });
          }

          break;
        }
        case "square": {
          if (!node.image) {
            this.context.roundRect(
              node.x - width / 2,
              node.y - height / 2,
              width,
              height,
              node._borderRadius,
            );
            this.context.fill();
            if (borderWidth > 0) {
              this.context.stroke();
            }
          } else {
            this.context.roundRect(
              node.x - width / 2,
              node.y - height / 2,
              width,
              height,
              node._borderRadius,
            );
            this.context.closePath();
            this.context.save();
            this.context.clip();
            this.context.drawImage(
              node.image,
              node.x - width / 2,
              node.y - height / 2,
              width,
              height,
            );
            this.context.restore();

            if (borderWidth > 0) {
              this.context.stroke();
            }
          }
          if (node.label) {
            this.context.globalAlpha = labelAlpha;
            drawText({
              context: this.context,
              cachedNodeText: this.cachedNodeLabel,
              id: node.id,
              text: node.label,
              textAlign: nodeOptions.labelAlign,
              textColor: nodeOptions.labelColor,
              textFont: nodeOptions.labelFont,
              textGap: nodeOptions.labelGap,
              textSize: labelSize,
              textStyle: nodeOptions.labelStyle,
              textWeight: labelWeight,
              maxWidth: nodeOptions.labelWidth,
              x: node.x,
              y: node.y + labelSize / 3,
            });
          }
          break;
        }
        case "text": {
          if (this.nodeSettings.textNodeDebug) {
            this.context.strokeRect(node.x - width / 2, node.y - height / 2, width, height);
          }

          const lines = this.cachedNodeLabel[node.id];
          if (nodeOptions.label && lines)
            drawText({
              id: node.id,
              cachedNodeText: this.cachedNodeLabel,
              context: this.context,
              text: nodeOptions.label,
              textAlign: nodeOptions.labelAlign,
              textColor: nodeOptions.labelColor,
              textFont: nodeOptions.labelFont,
              textSize: labelSize,
              x: node.x,
              y: node.y + textSize / 4 - (lines.length - 1) * (textSize / 2),
              maxWidth: nodeOptions.labelWidth,
              textStyle: nodeOptions.labelStyle,
              textWeight,
              textGap: nodeOptions.labelGap,
            });
          this.context.fill();
          if (borderWidth > 0) {
            this.context.stroke();
          }
          break;
        }
        default: {
          this.context.arc(node.x, node.y, radius, 0, 2 * Math.PI);
          this.context.fill();
          if (borderWidth > 0) {
            this.context.stroke();
          }
          break;
        }
      }
    });

    if (nodeOptions.nodeExtraDraw) {
      nodeRenders.push(() => {
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

    /** Text draw */
    if (nodeOptions.textVisible && nodeOptions.text) {
      textRenders.push(() => {
        if (nodeOptions.textDraw) {
          nodeOptions.textDraw.bind(this)(node, {
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

          return;
        }

        if (!this.context || !node.x || !node.y || !nodeOptions.text) return;
        this.context.beginPath();
        this.context.globalAlpha = textAlpha;

        let y = node.y + textShiftY;
        if (nodeOptions.shape === "circle") {
          y += radius;
        }
        if (nodeOptions.shape === "square" || nodeOptions.shape === "text") {
          y += height / 2;
        }

        drawText({
          id: node.id,
          cachedNodeText: this.cachedNodeText,
          context: this.context,
          text: nodeOptions.text,
          textAlign: nodeOptions.textAlign,
          textColor: nodeOptions.textColor,
          textFont: nodeOptions.textFont,
          textSize,
          x: node.x + textShiftX,
          y,
          maxWidth: nodeOptions.textWidth,
          textStyle: nodeOptions.textStyle,
          textWeight,
          textGap: nodeOptions.textGap,
        });

        if (nodeOptions.textExtraDraw) {
          nodeOptions.textExtraDraw.bind(this)(node, {
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
        }
      });
    }
  };
}
